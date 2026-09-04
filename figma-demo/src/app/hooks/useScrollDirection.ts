import { useState, useEffect, useRef } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [prevScrollY, setPrevScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const currentScrollY = target.scrollTop;

      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        // Scrolling down
        setScrollDirection("down");
      } else if (currentScrollY < prevScrollY) {
        // Scrolling up
        setScrollDirection("up");
      }

      setPrevScrollY(currentScrollY);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [prevScrollY]);

  return { scrollDirection, scrollContainerRef };
}
