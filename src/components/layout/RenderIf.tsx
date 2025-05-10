import type { ReactNode } from "react";

import { memo } from "react";

export type RenderIfProps = {
  condition: boolean;
  fallback?: ReactNode;
  children: ReactNode;
};

export default memo(function RenderIf({
  condition,
  fallback = null,
  children,
}: RenderIfProps) {
  if (condition) {
    return children;
  }
  return fallback;
});
