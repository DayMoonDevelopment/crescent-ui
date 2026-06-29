import * as React from "react";

import { InputSecret } from "@registry/bases/base/ui/input-secret";
import { Label } from "~/ui/label";

import { Example } from "./example";

// A representative secret: the kind of opaque token pasted from a developer
// portal that this control is built for. Prefilled so the mask — and the
// reveal toggle — are immediately visible in the preview.
const SAMPLE_KEY = "sk-live-3f9a2c7e1b8d4056af21";

// The hero — a single labeled secret field, the simplest representative usage.
export function InputSecretPreview() {
  const [value, setValue] = React.useState(SAMPLE_KEY);
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="api-key-preview">API key</Label>
      <InputSecret
        id="api-key-preview"
        name="api-key-preview"
        placeholder="sk-…"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}

// The additional usages, each its own flat example.
export function InputSecretExamples() {
  const [token, setToken] = React.useState(SAMPLE_KEY);
  return (
    <div className="space-y-8">
      <Example
        name="Empty"
        description="With no value yet, the field reads like any other input until something is typed."
      >
        <InputSecret
          className="w-full max-w-sm"
          name="webhook-secret"
          placeholder="Paste your secret…"
        />
      </Example>
      <Example
        name="Custom toggle labels"
        description="`revealLabel` and `hideLabel` set the toggle's accessible name — localize them or match your product's voice."
      >
        <InputSecret
          className="w-full max-w-sm"
          name="access-token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          revealLabel="Reveal token"
          hideLabel="Hide token"
        />
      </Example>
      <Example
        name="Disabled"
        description="A non-editable secret — the value stays masked and the toggle is unavailable."
      >
        <InputSecret
          className="w-full max-w-sm"
          name="rotated-key"
          defaultValue={SAMPLE_KEY}
          disabled
        />
      </Example>
    </div>
  );
}
