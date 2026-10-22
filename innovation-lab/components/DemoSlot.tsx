"use client";
import { FrameDemo } from "./demos/FrameDemo";
import { TapcardDemo } from "./demos/TapcardDemo";
import { ShadowRunDemo } from "./demos/ShadowRunDemo";
import { EmptyState } from "./ui";

/** Maps a project slug to its built-in interactive demo. Add new demos here. */
export function DemoSlot({ slug }: { slug: string }) {
  switch (slug) {
    case "ai-business-assistant":
      return (
        <FrameDemo
          src="/projects/ai-business-assistant/index.html"
          title="AI Business Assistant"
          height={900}
          openLabel="Open the assistant in its own window"
          note="This is the real page, running in your browser. It is rule-based: no AI model is connected. What you type is saved only on this device and is never sent anywhere."
        />
      );
    case "digital-identity": return <FrameDemo src="/projects/digital-identity/index.html" title="Digital Identity prototype" height={860} note="Sample data only. Everything you type stays in this browser and is never uploaded." openLabel="Open in its own window" />;
    case "content-calendar":
      return <FrameDemo src="/projects/content-calendar/index.html" title="Content Calendar & Post Planner" height={900} openLabel="Open the planner in its own window" note="This is the real app, running in your browser. The ideas are built in, not AI, and your plan is saved only on this device." />;
    case "folio":
      return <FrameDemo src="/projects/folio/index.html" title="Folio" height={900} openLabel="Open Folio in its own window" note="This is the real app, running in your browser. The business and client shown are fictional samples. A logo you upload stays on this device." />;
    case "production-planner":
      return <FrameDemo src="/projects/production-planner/index.html" title="Production Budget & Shot Planner" height={900} openLabel="Open the planner in its own window" note="This is the real app, running in your browser. Starter rates are editable examples, not real quotes. Sheets are saved only on this device." />;
    case "brand-studio":
      return (
        <FrameDemo
          src="/projects/brand-studio/index.html"
          title="Brand Studio"
          height={900}
          openLabel="Open Brand Studio in its own window"
          note="This is the real app, running in your browser. A logo you upload stays on this device and is never sent anywhere."
        />
      );
    case "ledgerline":
      return (
        <FrameDemo
          src="/projects/ledgerline/index.html"
          title="Ledgerline"
          height={820}
          openLabel="Open Ledgerline in its own window"
          note={<>This is the real app, running in your browser. Tap <strong className="text-cream">Try sample data</strong> to explore with made-up numbers. Everything stays on this device. If you create an account, it is only a profile stored in this browser, so use <strong className="text-cream">Continue without an account</strong> or a throwaway password, never a real one.</>}
        />
      );
    case "tapcard": return <TapcardDemo />;
    case "shadow-run": return <ShadowRunDemo />;
    default:
      return <EmptyState title="No built-in demo for this project yet">Create a component in components/demos and register it here.</EmptyState>;
  }
}
