"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { DAppKitProvider } from "@mysten/dapp-kit-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dAppKit } from "@evefrontier/dapp-kit/config";
import { NotificationProvider, SmartObjectContext, VaultProvider } from "@evefrontier/dapp-kit/providers";
import {
  Assemblies,
  AssemblyType,
  DetailedSmartCharacterResponse,
  QueryParams
} from "@evefrontier/dapp-kit/types";
import {
  DEFAULT_TENANT,
  POLLING_INTERVAL,
  getObjectId,
  getDatahubGameInfo,
  transformToAssembly,
  transformToCharacter
} from "@evefrontier/dapp-kit/utils";
import { getAssemblyWithOwner, type MoveObjectData } from "@evefrontier/dapp-kit/graphql";
import { useConnection } from "@evefrontier/dapp-kit/hooks";

const OBJECT_ID_FALLBACK = (process.env.NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID ?? "").trim();

export function EveFrontierProvider({ children, queryClient }: { children: ReactNode; queryClient: QueryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider dAppKit={dAppKit}>
        <VaultProvider>
          <PatchedSmartObjectProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </PatchedSmartObjectProvider>
        </VaultProvider>
      </DAppKitProvider>
    </QueryClientProvider>
  );
}

type FetchObjectDataInput = { itemId: string; selectedTenant: string } | { objectId: string };

function PatchedSmartObjectProvider({ children }: { children: ReactNode }) {
  const [assembly, setAssembly] = useState<AssemblyType<Assemblies> | null>(null);
  const [assemblyOwner, setAssemblyOwner] = useState<DetailedSmartCharacterResponse | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string>("");
  const [selectedTenant, setSelectedTenant] = useState<string>(DEFAULT_TENANT);
  const [isObjectIdDirect, setIsObjectIdDirect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataHashRef = useRef<string | null>(null);
  const { isConnected } = useConnection();

  const fetchObjectData = useCallback(
    async (input: FetchObjectDataInput, isInitialFetch = false) => {
      const hasItemId = "itemId" in input && "selectedTenant" in input;
      if (hasItemId) {
        if (!input.itemId || !input.selectedTenant) {
          return;
        }
      } else if (!input.objectId) {
        return;
      }

      if (isInitialFetch) {
        setLoading(true);
      }
      setError(null);

      try {
        const objectId = hasItemId ? await getObjectId(input.itemId, input.selectedTenant) : input.objectId;
        console.log(
          "[GIN] SmartObjectProvider: Fetching object:",
          hasItemId ? { itemId: input.itemId, selectedTenant: input.selectedTenant } : { objectId }
        );

        const { moveObject, assemblyOwner: characterInfo, energySource, destinationGate } =
          await getAssemblyWithOwner(objectId);

        if (!moveObject) {
          console.warn("[GIN] SmartObjectProvider: Object not found or not a Move object");
          setAssembly(null);
          setAssemblyOwner(null);
          setError("Object not found or not a Move object");
          return;
        }

        const dataHash = JSON.stringify({ moveObject, assemblyOwner: characterInfo, energySource });
        if (isInitialFetch || lastDataHashRef.current !== dataHash) {
          lastDataHashRef.current = dataHash;

          const rawJson = moveObject.contents?.json as { type_id?: string; status?: { type_id?: string } } | undefined;
          const typeId = rawJson?.type_id || rawJson?.status?.type_id || "0";

          let datahubInfo = null;
          try {
            datahubInfo = await getDatahubGameInfo(parseInt(typeId, 10));
          } catch (err) {
            console.warn("[GIN] SmartObjectProvider: Failed to fetch datahub info", err);
          }

          const transformed = await transformToAssembly(objectId, moveObject as MoveObjectData, {
            character: characterInfo,
            datahubInfo,
            energySource,
            destinationGate
          });

          setAssembly(transformed);

          if (characterInfo) {
            setAssemblyOwner(transformToCharacter(characterInfo));
          } else {
            setAssemblyOwner(null);
          }
        }
        setError(null);
      } catch (err) {
        console.error("[GIN] SmartObjectProvider: Query error", err);
        setError(err instanceof Error ? err.message : "Failed to fetch object");
      } finally {
        if (isInitialFetch) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    console.log("[GIN] SmartObjectProvider: Checking for item ID");
    const queryParams = new URLSearchParams(window.location.search);
    const queryTenant = queryParams.get(QueryParams.TENANT)?.trim() || DEFAULT_TENANT;
    const envObjectId = OBJECT_ID_FALLBACK.length ? OBJECT_ID_FALLBACK : undefined;

    if (envObjectId) {
      console.log("[GIN] SmartObjectProvider: Using Sui object ID from env", envObjectId);
      setSelectedObjectId(envObjectId);
      setSelectedTenant(queryTenant);
      setIsObjectIdDirect(true);
      return;
    }

    const queryItemId = queryParams.get(QueryParams.ITEM_ID);
    if (queryItemId) {
      setSelectedObjectId(queryItemId);
      setSelectedTenant(queryTenant);
      setIsObjectIdDirect(false);
    } else {
      console.warn(
        "[GIN] SmartObjectProvider: No object ID provided; falling back to locked experience. Set NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID or pass ?itemId=<assembly>."
      );
      setError("Missing assembly identifier. Provide NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID or ?itemId=.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedObjectId || !isConnected) {
      setLoading(false);
      return;
    }

    const input: FetchObjectDataInput = isObjectIdDirect
      ? { objectId: selectedObjectId }
      : { itemId: selectedObjectId, selectedTenant };

    fetchObjectData(input, true);
    pollingRef.current = setInterval(() => {
      fetchObjectData(input, false);
    }, POLLING_INTERVAL);

    console.log("[GIN] SmartObjectProvider: Started polling for object", selectedObjectId);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        console.log("[GIN] SmartObjectProvider: Stopped polling");
      }
      lastDataHashRef.current = null;
    };
  }, [selectedObjectId, selectedTenant, isObjectIdDirect, isConnected, fetchObjectData]);

  const handleRefetch = useCallback(async () => {
    if (!selectedObjectId) {
      return;
    }
    const input: FetchObjectDataInput = isObjectIdDirect
      ? { objectId: selectedObjectId }
      : { itemId: selectedObjectId, selectedTenant };
    await fetchObjectData(input, true);
  }, [selectedObjectId, selectedTenant, isObjectIdDirect, fetchObjectData]);

  return (
    <SmartObjectContext.Provider
      value={{ tenant: selectedTenant, assembly, assemblyOwner, loading, error, refetch: handleRefetch }}
    >
      {children}
    </SmartObjectContext.Provider>
  );
}
