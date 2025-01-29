import { ReactNode } from "react";

export type RenderIfProps = {
  condition: boolean;
  fallback?: ReactNode;
  children: ReactNode;
};

export default function RenderIf({
  condition,
  fallback = null,
  children,
}: RenderIfProps) {
  if (condition) {
    return children;
  }
  return fallback;
}
