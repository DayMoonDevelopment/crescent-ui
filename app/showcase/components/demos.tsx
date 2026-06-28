import { ChoiceboxExamples, ChoiceboxPreview } from "./choicebox-demo";
import { DateTimeExamples, DateTimePreview } from "./date-time-demo";

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
  "date-time": {
    title: "Date Time",
    description:
      "A hydration-safe timestamp shown in the viewer's locale and timezone, rendered as a semantic <time> element. Deterministic on the server and first paint, then re-formatted client-side.",
    sourceFile: "ui/date-time.tsx",
    preview: <DateTimePreview />,
    examples: <DateTimeExamples />,
  },
};

export const demoOrder = Object.keys(demos);
