"use client";
import { useState } from "react";
import { Photography } from "./Photography";
import { Videography } from "./Videography";
import { photoProjects, videoProjects } from "@/data/projects";
const TABS = [
  {
    id: "photography",
    label: "Photography",
    title: "Photography",
    meta: "Selected stills",
    count: photoProjects.length
  },
  {
    id: "videography",
    label: "Videography",
    title: "Videography",
    meta: "Motion work",
    count: videoProjects.length
  }
];
function Media({ onOpen }) {
  const [tab, setTab] = useState("photography");
  const current = TABS.find((t) => t.id === tab);
  return <section id="media" className="border-t border-border">
      <div className="px-6 md:px-10 pt-32 pb-12">
        {
    /* Eyebrow */
  }
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-8">
          [ 04 ] {current.meta}
        </p>

        {
    /* Header row: big title + count */
  }
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9]">
            {current.title}
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 pb-2">
            {current.count} {tab === "photography" ? "projects" : "reels"}
          </span>
        </div>

        {
    /* Tabs — underline style, clearly tabs */
  }
        <div
    role="tablist"
    aria-label="Visual work"
    className="flex gap-8 border-b border-border"
  >
          {TABS.map((t) => {
    const active = tab === t.id;
    return <button
      key={t.id}
      role="tab"
      aria-selected={active}
      onClick={() => setTab(t.id)}
      className={[
        "relative font-mono text-[11px] uppercase tracking-[0.3em] py-4 transition-colors",
        active ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
      ].join(" ")}
    >
                {t.label}
                <span
      className={[
        "absolute left-0 right-0 -bottom-px h-px transition-transform origin-left",
        active ? "bg-foreground scale-x-100" : "bg-foreground scale-x-0"
      ].join(" ")}
    />
              </button>;
  })}
        </div>
      </div>

      <div key={tab}>
        {tab === "photography" ? <Photography onOpen={onOpen} hideHeader /> : <Videography onOpen={onOpen} hideHeader />}
      </div>
    </section>;
}
export {
  Media
};