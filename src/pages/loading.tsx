import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner.tsx";
import LoadingSpinnerContainer from "@/components/LoadingSpinner/LoadingSpinnerContainer.tsx";

export default function Loading() {
  return (
    <LoadingSpinnerContainer>
      <LoadingSpinner />
    </LoadingSpinnerContainer>
  );
}
