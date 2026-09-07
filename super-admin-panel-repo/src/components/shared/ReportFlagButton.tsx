import * as React from 'react';
import { Flag, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';

const reportSchema = z.object({
  reason: z.enum(['spam', 'harassment', 'inappropriate', 'copyright', 'other']),
  notes: z.string().min(10, 'Notes must be at least 10 characters').optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export interface ReportFlagButtonProps {
  contentType: string;
  contentId: string;
  onReport?: () => void;
}

export default function ReportFlagButton({
  contentType,
  contentId,
  onReport,
}: ReportFlagButtonProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
  });

  const handleSubmit = (values: ReportFormValues) => {
    console.log('Reporting', contentType, contentId, values);
    toast({
      title: 'Report submitted',
      description: `Content has been flagged for review.`,
      variant: 'default',
    });
    onReport?.();
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Flag className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Flag Content</DialogTitle>
              <DialogDescription>
                Report this {contentType} for moderation review.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spam">Spam</SelectItem>
                          <SelectItem value="harassment">Harassment</SelectItem>
                          <SelectItem value="inappropriate">
                            Inappropriate Content
                          </SelectItem>
                          <SelectItem value="copyright">
                            Copyright Violation
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide additional context..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
