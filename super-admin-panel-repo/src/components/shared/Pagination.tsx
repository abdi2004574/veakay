import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={isLoading || !cursor}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={isLoading || !hasMore}
        className={cn('ml-auto')}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
