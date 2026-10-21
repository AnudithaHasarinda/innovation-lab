"use client";
import { BusinessAssistantDemo } from "./demos/BusinessAssistantDemo";
import { DigitalIdentityDemo } from "./demos/DigitalIdentityDemo";
import { BrandStudioDemo } from "./demos/BrandStudioDemo";
import { FinanceDashboardDemo } from "./demos/FinanceDashboardDemo";
import { EmptyState } from "./ui";

/** Maps a project slug to its built-in interactive demo. Add new demos here. */
export function DemoSlot({ slug }: { slug: string }) {
  switch (slug) {
    case "ai-business-assistant": return <BusinessAssistantDemo />;
    case "digital-identity": return <DigitalIdentityDemo />;
    case "brand-studio": return <BrandStudioDemo />;
    case "finance-dashboard": return <FinanceDashboardDemo />;
    default:
      return <EmptyState title="No built-in demo for this project yet">Create a component in components/demos and register it here.</EmptyState>;
  }
}
