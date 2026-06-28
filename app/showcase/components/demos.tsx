import { ChoiceboxExamples, ChoiceboxPreview } from "./choicebox-demo";
import { StepsExamples, StepsPreview } from "./steps-demo";

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
  steps: {
    title: "Steps",
    description:
      "A vertical, status-driven step rail. An ordered run threaded by a connecting line, each step fronted by a complete, current, or upcoming indicator.",
    sourceFile: "ui/steps.tsx",
    preview: <StepsPreview />,
    examples: <StepsExamples />,
  },
};

export const demoOrder = Object.keys(demos);
