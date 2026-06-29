import { ChoiceboxExamples, ChoiceboxPreview } from "./choicebox-demo";
import { FactExamples, FactPreview } from "./fact-demo";

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
  fact: {
    title: "Fact",
    description:
      "A compact, read-only label→value block for detail and summary surfaces — ids, dates, status, counts. Lay several out in a grid for a facts strip.",
    sourceFile: "ui/fact.tsx",
    preview: <FactPreview />,
    examples: <FactExamples />,
  },
};

export const demoOrder = Object.keys(demos);
