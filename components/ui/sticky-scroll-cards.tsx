"use client";

import { cn } from "@/lib/utils";
import {
  useReducedMotion,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import ReactLenis from "lenis/react";
import { useRef } from "react";

export interface StickyScrollCardItem {
  id?: string;
  content: React.ReactNode;
}

interface StickyScrollCardsProps {
  /** Array of card items, each with a title and image src URL */
  cards?: StickyScrollCardItem[];
  /** Hint label shown above the stack */
  hint?: string;
  /** Additional CSS classes for the outer container */
  className?: string;
  /** Scrollable parent container, if not scrolling the window */
  scrollContainer?: React.RefObject<HTMLElement | null>;
}

const DEFAULT_CARDS: StickyScrollCardItem[] = [];

const TILT_PATTERN = [-1.25, 0.85, -0.65, 1.35, -0.9];

function StackCard({
  card,
  index,
  total,
  container,
  reduceMotion,
  scrollContainer,
}: {
  card: StickyScrollCardItem;
  index: number;
  total: number;
  container: React.RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  scrollContainer?: React.RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: container,
    container: scrollContainer,
    offset: ["start start", "end end"],
  });
  const start = total > 1 ? index / (total + 1) : 0;
  const restingScale = Math.max(0.75, 1 - (total - index - 1) * 0.05);
  const scale = useTransform(
    scrollYProgress,
    [start, 1],
    reduceMotion ? [1, 1] : [1, restingScale],
  );

  return (
    <section className="sticky top-0 grid h-[100dvh] place-items-center">
      <motion.figure
        className="relative m-0 origin-top overflow-visible rounded-sm"
        style={{
          scale,
          rotate: reduceMotion ? 0 : TILT_PATTERN[index % TILT_PATTERN.length],
          top: `calc(5vh + ${index * 15}px)`,
          boxShadow:
            "0 2px 5px rgb(0 0 0 / 0.06), 0 18px 48px rgb(0 0 0 / 0.13)",
        }}
      >
        <div className="p-0">
          {card.content}
        </div>
      </motion.figure>
    </section>
  );
}

export function StickyScrollCards({
  cards = DEFAULT_CARDS,
  hint = "scroll to explore",
  className,
  scrollContainer,
}: StickyScrollCardsProps) {
  const container = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const content = (
    <main
      ref={container}
      className={cn(
        "relative flex w-full flex-col items-center pb-[10dvh] pt-[2dvh]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-[8%] flex -translate-x-1/2 flex-col items-center gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-30">
          {hint}
        </p>
        <span className="h-12 w-px bg-gradient-to-b from-foreground/30 to-transparent" />
      </div>

      {cards.map((card, index) => (
        <StackCard
          key={card.id || `card-${index}`}
          card={card}
          index={index}
          total={cards.length}
          container={container}
          reduceMotion={reduceMotion}
          scrollContainer={scrollContainer}
        />
      ))}
    </main>
  );

  return reduceMotion ? content : <>{content}</>;
}
