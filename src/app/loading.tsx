"use client";
import {
  LoadingSpinner,
  LoadingSpinnerContainer,
} from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <LoadingSpinnerContainer>
      <LoadingSpinner />
    </LoadingSpinnerContainer>
  );
}
