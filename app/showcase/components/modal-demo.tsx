import {
  Modal,
  ModalAside,
  ModalBody,
  ModalCarousel,
  ModalCarouselDots,
  ModalCarouselNav,
  ModalCarouselViewport,
  ModalClose,
  ModalColumn,
  ModalColumns,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalSlide,
  ModalTitle,
  ModalTrigger,
  ModalView,
  ModalViews,
  ModalViewsBack,
  useModalViews,
} from "@registry/bases/base/ui/modal";
import { Button } from "~/ui/button";

import { Example } from "./example";

const PARAGRAPHS = Array.from(
  { length: 8 },
  (_, i) =>
    `Paragraph ${i + 1}. The body is the single scroll region between the pinned header and footer — long content scrolls here while the chrome stays put.`,
);

const SLIDES = [
  {
    title: "Welcome",
    body: "The carousel steps through ordered slides — drag is off, so progress is deliberate.",
  },
  {
    title: "One step at a time",
    body: "The footer's nav drives the track; the dots track which slide is active.",
  },
  {
    title: "All set",
    body: "On the last slide Next becomes Finish — wire onFinish to close or advance.",
  },
];

// The hero — a framed dialog: pinned header + footer, the body owns the scroll.
export function ModalPreview() {
  return (
    <Modal>
      <ModalTrigger render={<Button variant="outline">Open dialog</Button>} />
      <ModalContent layout="framed">
        <ModalHeader>
          <ModalTitle>Framed dialog</ModalTitle>
          <ModalDescription>
            Header and footer pin; the body owns the only scroll.
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-3">
          {PARAGRAPHS.map((p) => (
            <p key={p} className="text-sm text-muted-foreground">
              {p}
            </p>
          ))}
        </ModalBody>
        <ModalFooter>
          <ModalClose render={<Button variant="ghost">Cancel</Button>} />
          <ModalClose render={<Button>Save</Button>} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function ModalExamples() {
  return (
    <div className="space-y-8">
      <Example
        name="Two columns (muted aside)"
        description="A primary column beside a distinguished muted panel — each scrolls independently; container-query responsive."
      >
        <Modal>
          <ModalTrigger render={<Button variant="outline">Open</Button>} />
          <ModalContent layout="framed" className="max-w-3xl">
            <ModalHeader>
              <ModalTitle>Choose an option</ModalTitle>
            </ModalHeader>
            <ModalColumns>
              <ModalColumn className="flex flex-col gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    Primary column item {i + 1}. This column scrolls
                    independently of the aside.
                  </p>
                ))}
              </ModalColumn>
              <ModalAside className="flex flex-col gap-2">
                <p className="font-heading text-lg font-semibold text-foreground">
                  Summary
                </p>
                <p className="text-sm text-muted-foreground">
                  The trailing column is a distinguished muted panel — for a
                  value-prop, a preview, or a running summary.
                </p>
              </ModalAside>
            </ModalColumns>
            <ModalFooter>
              <ModalClose render={<Button>Continue</Button>} />
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Example>

      <Example
        name="Slidable carousel"
        description="Ordered horizontal slides with a deliberate button-driven step — dots track progress; Back hides on the first slide and Next becomes Finish on the last."
      >
        <Modal>
          <ModalTrigger render={<Button variant="outline">Open tour</Button>} />
          <ModalContent layout="framed">
            <ModalCarousel>
              <ModalCarouselViewport>
                {SLIDES.map((slide) => (
                  <ModalSlide key={slide.title}>
                    <div className="flex flex-col gap-2 px-6 py-10 text-center">
                      <p className="font-heading text-lg font-semibold text-foreground">
                        {slide.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {slide.body}
                      </p>
                    </div>
                  </ModalSlide>
                ))}
              </ModalCarouselViewport>
              <ModalFooter className="sm:justify-between">
                <ModalCarouselDots />
                <ModalCarouselNav />
              </ModalFooter>
            </ModalCarousel>
          </ModalContent>
        </Modal>
      </Example>

      <Example
        name="Replace-style inner navigation"
        description="A push/pop view stack that swaps the active view in place — Back hides when there's nothing to pop."
      >
        <Modal>
          <ModalTrigger render={<Button variant="outline">Open</Button>} />
          <ModalContent layout="framed">
            <ModalViews defaultView="home">
              <ModalHeader className="flex-row items-center gap-2 text-start sm:flex-row">
                <ModalViewsBack />
                <ModalTitle>Settings</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <ModalView value="home">
                  <ViewsHome />
                </ModalView>
                <ModalView value="profile">
                  <p className="text-sm text-muted-foreground">
                    Profile settings. The previous view is replaced in place;
                    Back pops the stack.
                  </p>
                </ModalView>
                <ModalView value="billing">
                  <p className="text-sm text-muted-foreground">
                    Billing settings. Each destination is its own view, mounted
                    only when active.
                  </p>
                </ModalView>
              </ModalBody>
            </ModalViews>
          </ModalContent>
        </Modal>
      </Example>
    </div>
  );
}

function ViewsHome() {
  const { push } = useModalViews();
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={() => push("profile")}>
        Profile
      </Button>
      <Button variant="outline" onClick={() => push("billing")}>
        Billing
      </Button>
    </div>
  );
}
