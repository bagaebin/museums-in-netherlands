"use client";

import { useMemo, useState } from "react";
import museumsData from "@/data/museums.json";
import { LayoutMode, MuseumData } from "@/lib/types";
import { LayoutToggle } from "@/components/LayoutToggle";
import { LockersGrid } from "@/components/LockersGrid";
import { FabButtons } from "@/components/FabButtons";

export default function HomePage() {
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const [activeId, setActiveId] = useState<string | null>(null);

  const museums = useMemo(() => museumsData as MuseumData[], []);

  return (
    <main style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: 14 }}>네덜란드 미술관 락커월</p>
          <h1 style={{ margin: 4, fontSize: 28 }}>Museum Lockers</h1>
        </div>
        <LayoutToggle layout={layout} onChange={setLayout} />
      </header>

      <LockersGrid museums={museums} layout={layout} activeId={activeId} onActiveChange={setActiveId} />

      <FabButtons />
    </main>
  );
}
