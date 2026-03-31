"use client";

import * as React from "react";
import {
  Activity,
  ArrowRight,
  BarChart,
  Bird,
  Menu,
  Plug,
  Sparkles,
  Zap
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "INTELLIGENCE", href: "#intel" },
  { title: "ADVISOR", href: "#advisor" },
  { title: "PACKS", href: "#packs" },
  { title: "CREDITS", href: "#credits" }
];

const labels = [
  { icon: Sparkles, label: "Verified Signals" },
  { icon: Plug, label: "Frontier dApp Kit" },
  { icon: Activity, label: "Contributor Rewards" }
];

const features = [
  {
    icon: BarChart,
    label: "Threat + Opportunity Maps",
    description: "Track verified sector risk, resource spikes, and route safety in one view."
  },
  {
    icon: Zap,
    label: "Advisor Layer",
    description: "Grounded recommendations that explain why a route or sector is safe."
  },
  {
    icon: Activity,
    label: "Contributor Economy",
    description: "Submit intel, build trust, earn GIN Credits, and unlock deeper access."
  }
];

export function MynaHero() {
  const controls = useAnimation();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) {
      void controls.start("visible");
    }
  }, [controls, isInView]);

  const titleWords = ["GALACTIC", "INTELLIGENCE", "NETWORK"] as const;

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto min-h-screen px-4">
        <header>
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="flex items-center gap-2" aria-label="GIN home">
              <div className="flex items-center space-x-2">
                <Bird className="h-8 w-8" />
                <span className="font-mono text-xl font-bold">GIN</span>
              </div>
            </a>

            <nav className="hidden items-center space-x-8 md:flex">
              {navigationItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="text-sm font-mono text-foreground transition-colors hover:text-[var(--primary)]"
                >
                  {item.title}
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="default"
                className="hidden rounded-none font-mono md:inline-flex"
                style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                START SESSION <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="mt-6 flex flex-col gap-6">
                    {navigationItems.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="text-sm font-mono text-foreground transition-colors hover:text-[var(--primary)]"
                      >
                        {item.title}
                      </a>
                    ))}
                    <Button
                      className="cursor-pointer rounded-none font-mono"
                      style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                      START SESSION <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main>
          <section className="py-24">
            <div className="flex flex-col items-center text-center">
              <motion.h1
                initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative mx-auto max-w-4xl font-mono text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {titleWords.map((text, index) => (
                  <motion.span
                    key={text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    className="mx-2 inline-block md:mx-4"
                  >
                    {text}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="mx-auto mt-8 max-w-2xl text-xl font-mono text-foreground"
              >
                GIN transforms live Frontier signals into verified intelligence, trusted recommendations, and
                contributor rewards.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="mt-12 flex flex-wrap justify-center gap-6"
              >
                {labels.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + index * 0.15, duration: 0.6, type: "spring", stiffness: 100, damping: 10 }}
                    className="flex items-center gap-2 px-6"
                  >
                  <feature.icon className="h-5 w-5 text-[var(--primary)]" />
                  <span className="text-sm font-mono">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 0.6, type: "spring", stiffness: 100, damping: 10 }}
              >
                <Button
                  size="lg"
                  className="mt-12 cursor-pointer rounded-none font-mono"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  CONNECT WALLET <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </section>

          <section ref={ref} className="pb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.0, duration: 0.6, type: "spring", stiffness: 100, damping: 10 }}
              className="mb-6 text-center font-mono text-4xl font-bold"
            >
              Built for Frontier Operators
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2, duration: 0.6 }}
              className="mx-auto grid gap-6 md:grid-cols-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.2 + index * 0.2, duration: 0.6, type: "spring", stiffness: 100, damping: 10 }}
                  className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center"
                >
                  <div className="mb-4 rounded-full bg-[rgba(255,107,44,0.12)] p-4">
                    <feature.icon className="h-8 w-8 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-xl font-mono font-bold">{feature.label}</h3>
                  <p className="text-sm font-mono text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
}
