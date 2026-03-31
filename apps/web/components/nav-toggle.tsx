"use client";

import { useState } from "react";

export function NavToggle() {
  const [open, setOpen] = useState(true);

  return (
    <button
      type="button"
      className="nav-toggle"
      aria-controls="primary-nav"
      aria-expanded={open}
      onClick={() => {
        const nextOpen = !open;
        setOpen(nextOpen);
        const nav = document.getElementById("primary-nav");
        if (!nav) {
          return;
        }
        nav.classList.toggle("is-collapsed", !nextOpen);
      }}
    >
      {open ? "Hide Nav" : "Show Nav"}
    </button>
  );
}
