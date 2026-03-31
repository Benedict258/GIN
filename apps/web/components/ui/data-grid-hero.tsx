"use client";

import React, { useEffect, useRef } from "react";

type DataGridHeroProps = {
  rows: number;
  cols: number;
  spacing: number;
  duration: number;
  color: string;
  animationType: "pulse" | "wave" | "random";
  pulseEffect: boolean;
  mouseGlow: boolean;
  opacityMin: number;
  opacityMax: number;
  background: string;
  children?: React.ReactNode;
};

export default function DataGridHero({
  rows,
  cols,
  spacing,
  duration,
  color,
  animationType,
  pulseEffect,
  mouseGlow,
  opacityMin,
  opacityMax,
  background,
  children
}: DataGridHeroProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = gridRef.current;
    if (!container) {
      return;
    }

    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.gap = `${spacing}px`;
    container.style.setProperty("--mouse-glow-opacity", mouseGlow ? "1" : "0");

    const total = rows * cols;
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);

    for (let i = 0; i < total; i += 1) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.style.backgroundColor = color;
      cell.style.setProperty("--opacity-min", String(opacityMin));
      cell.style.setProperty("--opacity-max", String(opacityMax));

      if (pulseEffect) {
        let delay = 0;
        const row = Math.floor(i / cols);
        const col = i % cols;

        if (animationType === "wave") {
          delay = (row + col) * 0.1;
        } else if (animationType === "random") {
          delay = Math.random() * duration;
        } else {
          const dr = Math.abs(row - centerRow);
          const dc = Math.abs(col - centerCol);
          delay = Math.sqrt(dr * dr + dc * dc) * 0.2;
        }

        cell.style.animation = `cell-pulse ${duration}s infinite alternate`;
        cell.style.animationDelay = `${delay.toFixed(3)}s`;
      }

      container.appendChild(cell);
    }
  }, [rows, cols, spacing, duration, color, animationType, pulseEffect, opacityMin, opacityMax, mouseGlow]);

  useEffect(() => {
    if (!mouseGlow || !gridRef.current) {
      return;
    }

    const handler = (event: MouseEvent) => {
      const container = gridRef.current;
      if (!container) {
        return;
      }
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      container.style.setProperty("--mouse-x", `${x}px`);
      container.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseGlow]);

  return (
    <div className="data-grid-hero" style={{ background }}>
      <div ref={gridRef} className="grid-container" aria-hidden="true" />
      <div className="hero-content" role="region" aria-label="Hero Content">
        {children}
      </div>
    </div>
  );
}
