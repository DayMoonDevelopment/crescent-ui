import {
  Copyable,
  CopyableButton,
  CopyableContent,
} from "@registry/bases/base/ui/copyable";

import { Example } from "./example";

// The hero — the canonical Copyable use case: a CLI install command sitting in a
// card surface with a copy button that confirms with a check.
export function CopyablePreview() {
  return (
    <Copyable className="w-full max-w-md" value="npx shadcn@latest add @crescent-ui/copyable">
      <CopyableContent>npx shadcn@latest add @crescent-ui/copyable</CopyableContent>
      <CopyableButton />
    </Copyable>
  );
}

// The additional usages, each its own flat example.
export function CopyableExamples() {
  return (
    <div className="space-y-8">
      <Example
        name="Secret value"
        description="Any string — an API key, a token, a URL — copies on press; the value shown can differ from what's copied."
      >
        <Copyable className="w-full max-w-md" value="crsnt_demo_3f8a1c9b2e7d406192a5">
          <CopyableContent>crsnt_demo_••••••••••••••••••••</CopyableContent>
          <CopyableButton />
        </Copyable>
      </Example>
      <Example
        name="Custom content"
        description="CopyableContent is just a slot — drop in a label, badge, or any markup beside the value."
      >
        <Copyable className="w-full max-w-md" value="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB">
          <CopyableContent className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-muted-foreground">
              Public key
            </span>
            <span className="truncate">ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB</span>
          </CopyableContent>
          <CopyableButton />
        </Copyable>
      </Example>
    </div>
  );
}
