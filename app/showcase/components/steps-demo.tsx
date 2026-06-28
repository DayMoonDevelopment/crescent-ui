import * as React from "react";

import {
  Step,
  StepContent,
  Steps,
  type StepStatus,
} from "@registry/bases/base/ui/steps";
import { IconPlaceholder } from "~/ui/icon-placeholder";

import { Example } from "./example";

// A launchpad-style onboarding checklist — the canonical Steps use case. Each
// row is a self-contained piece of content (title + supporting copy) beside the
// status rail; the rail's indicators and connectors are driven entirely by each
// step's `status`.
type DemoStep = {
  status: StepStatus;
  title: string;
  description: string;
  disabled?: boolean;
};

const onboarding: DemoStep[] = [
  {
    status: "complete",
    title: "Create your account",
    description: "Your workspace is ready to go.",
  },
  {
    status: "complete",
    title: "Connect a channel",
    description: "Two channels linked and authorized.",
  },
  {
    status: "current",
    title: "Schedule your first post",
    description: "Pick a time and we'll handle the rest.",
  },
  {
    status: "upcoming",
    title: "Invite your team",
    description: "Collaborators can draft and review together.",
    disabled: true,
  },
];

function StepRow({ status, title, description, disabled }: DemoStep) {
  return (
    <Step status={status} disabled={disabled}>
      {/* The consumer owns what "disabled" looks like — here we dim the row. */}
      <StepContent className={disabled ? "opacity-50" : undefined}>
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </StepContent>
    </Step>
  );
}

// The hero — the four-step onboarding rail with a mix of done / current /
// upcoming so every indicator and connector tone is on show.
export function StepsPreview() {
  return (
    <Steps className="w-full max-w-sm">
      {onboarding.map((step) => (
        <StepRow key={step.title} {...step} />
      ))}
    </Steps>
  );
}

export function StepsExamples() {
  return (
    <div className="space-y-8">
      <Example
        name="With actions"
        description="Each step's content is yours — drop a title, description, and an inline action beside the rail."
      >
        <Steps className="w-full max-w-sm">
          <Step status="complete">
            <StepContent className="gap-1">
              <span className="text-sm font-medium text-foreground">
                Profile completed
              </span>
              <button
                type="button"
                className="cn-button w-fit border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent"
              >
                Edit profile
              </button>
            </StepContent>
          </Step>
          <Step status="current">
            <StepContent className="gap-1">
              <span className="text-sm font-medium text-foreground">
                Verify your email
              </span>
              <button
                type="button"
                className="cn-button w-fit border bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                Resend email
              </button>
            </StepContent>
          </Step>
          <Step status="upcoming">
            <StepContent>
              <span className="text-sm font-medium text-foreground">
                Add a payment method
              </span>
            </StepContent>
          </Step>
        </Steps>
      </Example>

      <Example
        name="Titles only"
        description="A compact rail — single-line steps with no supporting copy."
      >
        <Steps className="w-full max-w-xs">
          <Step status="complete">
            <StepContent className="justify-center">
              <span className="text-sm font-medium text-foreground">Cart</span>
            </StepContent>
          </Step>
          <Step status="complete">
            <StepContent className="justify-center">
              <span className="text-sm font-medium text-foreground">
                Shipping
              </span>
            </StepContent>
          </Step>
          <Step status="current">
            <StepContent className="justify-center">
              <span className="text-sm font-medium text-foreground">
                Payment
              </span>
            </StepContent>
          </Step>
          <Step status="upcoming">
            <StepContent className="justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                Review
              </span>
            </StepContent>
          </Step>
        </Steps>
      </Example>

      <Example
        name="Leading icons"
        description="The content slot is freeform — pair each step with an icon from the active library."
      >
        <Steps className="w-full max-w-sm">
          <Step status="complete">
            <StepContent className="flex-row items-center gap-2">
              <IconPlaceholder
                lucide="Package"
                tabler="IconPackage"
                phosphor="Package"
                hugeicons="PackageIcon"
                remixicon="RiBox3Line"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm font-medium text-foreground">
                Order placed
              </span>
            </StepContent>
          </Step>
          <Step status="current">
            <StepContent className="flex-row items-center gap-2">
              <IconPlaceholder
                lucide="Truck"
                tabler="IconTruck"
                phosphor="Truck"
                hugeicons="TruckIcon"
                remixicon="RiTruckLine"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm font-medium text-foreground">
                Out for delivery
              </span>
            </StepContent>
          </Step>
          <Step status="upcoming">
            <StepContent className="flex-row items-center gap-2">
              <IconPlaceholder
                lucide="House"
                tabler="IconHome"
                phosphor="House"
                hugeicons="Home01Icon"
                remixicon="RiHome2Line"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm font-medium text-muted-foreground">
                Delivered
              </span>
            </StepContent>
          </Step>
        </Steps>
      </Example>
    </div>
  );
}
