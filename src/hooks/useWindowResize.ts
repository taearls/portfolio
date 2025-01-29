import { DependencyList, useEffect } from "react";

export default function useWindowResize(
  callback: () => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const eventListener = () => {
      callback();
    };
    window.addEventListener("resize", eventListener);

    callback();

    return () => window.removeEventListener("resize", eventListener);
  }, deps);
}
