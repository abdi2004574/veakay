import { ChevronLeft, ChevronRight } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  cursor: string | null;
  hasMore: boolean;
  isLoading?: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Pagination({
  cursor,
  hasMore,
  isLoading = false,
  onNext,
  onPrevious,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <GradientButton
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={isLoading || !cursor}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </GradientButton>
      <GradientButton
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={isLoading || !hasMore}
        className={cn("ml-auto")}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </GradientButton>
    </div>
  );
}
