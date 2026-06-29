import { Fact } from "@registry/bases/base/ui/fact";

import { Example } from "./example";

// A small status value built from primitives the registry already ships (a dot +
// label), so the demo stays dependency-free — in real use the value slot happily
// takes a Badge, a Copyable, an Avatar, etc.
function Status({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-1.5 rounded-full bg-primary" aria-hidden />
      {label}
    </span>
  );
}

// The hero — a "facts strip": several label→value facts laid out in a grid, the
// canonical detail-page usage (ids, dates, status, counts side by side).
export function FactPreview() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-x-10 gap-y-5">
      <Fact label="Platform">Instagram</Fact>
      <Fact label="Connected">May 15, 2026</Fact>
      <Fact label="ID">
        <span className="truncate font-mono">sa_3kf9d72bnq10x8zv</span>
      </Fact>
      <Fact label="Posts">128</Fact>
    </div>
  );
}

export function FactExamples() {
  return (
    <div className="space-y-8">
      <Example
        name="Single"
        description="One labelled fact — a small uppercase label above its value."
      >
        <Fact label="Connected">May 15, 2026</Fact>
      </Example>

      <Example
        name="Freeform values"
        description="The value slot is freeform: plain text, a monospaced id, a status, a count — whatever the surface needs."
      >
        <div className="grid w-full max-w-md grid-cols-2 gap-x-10 gap-y-5">
          <Fact label="ID">
            <span className="truncate font-mono">sa_3kf9d72bnq10x8zv</span>
          </Fact>
          <Fact label="Status">
            <Status label="Connected" />
          </Fact>
          <Fact label="Platform">Instagram</Fact>
          <Fact label="Posts">128</Fact>
        </div>
      </Example>

      <Example
        name="Horizontal"
        description="orientation=&quot;horizontal&quot; lays the label and value on one row. Give the label a width to align values down a column — the settings-row look."
      >
        <div className="flex w-full max-w-md flex-col gap-3 [&_[data-slot=fact-label]]:w-24">
          <Fact label="Platform" orientation="horizontal">
            Instagram
          </Fact>
          <Fact label="Connected" orientation="horizontal">
            May 15, 2026
          </Fact>
          <Fact label="Status" orientation="horizontal">
            <Status label="Connected" />
          </Fact>
          <Fact label="Posts" orientation="horizontal">
            128
          </Fact>
        </div>
      </Example>
    </div>
  );
}
