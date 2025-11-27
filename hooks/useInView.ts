import { useEffect, useState, RefObject } from "react";

export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: IntersectionObserverInit = {}
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return inView;
}
