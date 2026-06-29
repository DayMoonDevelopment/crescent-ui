import { ChoiceboxExamples, ChoiceboxPreview } from "./choicebox-demo";
import { InputSecretExamples, InputSecretPreview } from "./input-secret-demo";

// The gallery's source of truth: one entry per published crescent-ui component.
// `preview` is the hero shown in the preview frame; `examples` are the extra
// usages listed below; `sourceFile` is the path under registry/bases/<base>/
// used to build the "view on GitHub" link and the install command.
export const demos: Record<
  string,
  {
    title: string;
    description: string;
    sourceFile: string;
    preview: React.ReactNode;
    examples: React.ReactNode;
  }
> = {
  choicebox: {
    title: "Choicebox",
    description:
      "A card-styled selection group built on the Base UI Toggle Group. Single or multi-select, horizontal rows or vertical cards.",
    sourceFile: "ui/choicebox.tsx",
    preview: <ChoiceboxPreview />,
    examples: <ChoiceboxExamples />,
  },
  "input-secret": {
    title: "Input Secret",
    description:
      "A masked secret input for API keys and tokens, built on Input Group, with a reveal/hide toggle. Deliberately not a password field so the OS/password manager doesn't offer to save it.",
    sourceFile: "ui/input-secret.tsx",
    preview: <InputSecretPreview />,
    examples: <InputSecretExamples />,
  },
};

export const demoOrder = Object.keys(demos);
