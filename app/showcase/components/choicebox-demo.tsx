import * as React from "react";

import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemContent,
  ChoiceboxItemDescription,
  ChoiceboxItemIcon,
  ChoiceboxItemIndicator,
  ChoiceboxItemTitle,
} from "@registry/bases/base/ui/choicebox";
import { IconPlaceholder } from "~/ui/icon-placeholder";

import { Example } from "./example";

// Generic placeholder content — a notification-preferences picker, the canonical
// choicebox use case (works for single-, multi-, and card-select alike).
//
// Each option's glyph is named once per supported icon library; the active
// library (driven by the configurator) decides which renders. This is the same
// shape shadcn expects in registry components — the CLI rewrites it to a real
// import on install, while the showcase resolves it live.
const options = [
  {
    value: "email",
    icon: (
      <IconPlaceholder
        lucide="Mail"
        tabler="IconMail"
        phosphor="Envelope"
        hugeicons="MailIcon"
        remixicon="RiMailLine"
      />
    ),
    title: "Email",
    description: "A copy of everything lands in your inbox.",
  },
  {
    value: "push",
    icon: (
      <IconPlaceholder
        lucide="Bell"
        tabler="IconBell"
        phosphor="Bell"
        hugeicons="Notification03Icon"
        remixicon="RiNotification3Line"
      />
    ),
    title: "Push",
    description: "Real-time alerts on all your devices.",
  },
  {
    value: "sms",
    icon: (
      <IconPlaceholder
        lucide="MessageSquare"
        tabler="IconMessage"
        phosphor="ChatCircle"
        hugeicons="Message01Icon"
        remixicon="RiMessage2Line"
      />
    ),
    title: "Text message",
    description: "A quick text for the time-sensitive stuff.",
  },
  {
    value: "quiet",
    icon: (
      <IconPlaceholder
        lucide="Moon"
        tabler="IconMoon"
        phosphor="Moon"
        hugeicons="Moon02Icon"
        remixicon="RiMoonLine"
      />
    ),
    title: "Quiet hours",
    description: "Mute everything and stay focused.",
  },
];

// The item elements are static (no per-render or per-instance data), so build
// them once at module scope — React safely reuses the same elements across the
// three Choicebox instances below.
const itemElements = options.map((option) => (
  <ChoiceboxItem key={option.value} value={option.value}>
    <ChoiceboxItemIcon>{option.icon}</ChoiceboxItemIcon>
    <ChoiceboxItemContent>
      <ChoiceboxItemTitle>{option.title}</ChoiceboxItemTitle>
      <ChoiceboxItemDescription>{option.description}</ChoiceboxItemDescription>
    </ChoiceboxItemContent>
    <ChoiceboxItemIndicator />
  </ChoiceboxItem>
));

// The hero — a single-select group, the simplest representative usage.
export function ChoiceboxPreview() {
  const [value, setValue] = React.useState<string[]>(["email"]);
  return (
    <Choicebox className="w-full max-w-md" value={value} onValueChange={setValue}>
      {itemElements}
    </Choicebox>
  );
}

// The additional usages, each its own flat example.
export function ChoiceboxExamples() {
  const [multi, setMulti] = React.useState<string[]>(["email", "push"]);
  const [card, setCard] = React.useState<string[]>(["push"]);
  return (
    <div className="space-y-8">
      <Example
        name="Multi-select"
        description="A checkbox indicator — any number of options can be active at once."
      >
        <Choicebox
          multiple
          className="w-full max-w-md"
          value={multi}
          onValueChange={setMulti}
        >
          {itemElements}
        </Choicebox>
      </Example>
      <Example
        name="Vertical cards"
        description="Icon-over-content cards laid out in a grid."
      >
        <Choicebox
          orientation="vertical"
          className="grid w-full max-w-md grid-cols-2 gap-3"
          value={card}
          onValueChange={setCard}
        >
          {itemElements}
        </Choicebox>
      </Example>
    </div>
  );
}
