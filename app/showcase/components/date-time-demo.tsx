import * as React from "react";

import {
  DATE_FORMAT,
  LocaleDateTime,
  useLocaleDateTime,
} from "@registry/bases/base/ui/date-time";

import { Example } from "./example";

// A fixed instant so the showcase is deterministic across renders. The component
// itself emits a UTC-based string on the server + first paint, then re-formats it
// in the viewer's own timezone after hydration — so the exact time you see below
// depends on where you're reading this from.
const SAMPLE = "2026-06-25T15:15:00Z";
const EARLIER = "2026-01-08T09:30:00Z";

// The hero — the default "MMM d, yyyy 'at' h:mmaaa" timestamp.
export function DateTimePreview() {
  return (
    <LocaleDateTime
      value={SAMPLE}
      className="text-lg font-medium tabular-nums"
    />
  );
}

// Demonstrates the raw-string hook for callers that compose their own markup
// rather than rendering the wrapped <time> element.
function RelativeLabel() {
  const text = useLocaleDateTime(SAMPLE);
  return (
    <p className="text-sm text-muted-foreground">
      Last updated <span className="font-medium text-foreground">{text}</span>
    </p>
  );
}

// The additional usages, each its own flat example.
export function DateTimeExamples() {
  return (
    <div className="space-y-8">
      <Example
        name="Date only"
        description="Pass a custom date-fns pattern — here the date-only DATE_FORMAT."
      >
        <LocaleDateTime
          value={SAMPLE}
          pattern={DATE_FORMAT}
          className="text-lg font-medium tabular-nums"
        />
      </Example>
      <Example
        name="Custom pattern"
        description="Any date-fns format string works — e.g. a 24-hour weekday stamp."
      >
        <LocaleDateTime
          value={EARLIER}
          pattern="EEE, MMM d · HH:mm"
          className="text-lg font-medium tabular-nums"
        />
      </Example>
      <Example
        name="Raw string via useLocaleDateTime"
        description="The hook returns the formatted string for composing your own markup."
      >
        <RelativeLabel />
      </Example>
    </div>
  );
}
