import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  cn(
    'relative w-full rounded-lg border p-4',
    '[&>svg+div]:translate-y-1',
    '[&>[class^="radical"]]:mb-0',
    'text-sm',
  ),
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive bg-destructive/10 text-destructive',
        success: 'border-green-600 bg-green-50 text-green-900',
        warning: 'border-amber-600 bg-amber-50 text-amber-900',
        info: 'border-blue-600 bg-blue-50 text-blue-900',
      },
      size: {
        default: 'py-4',
        sm: 'py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant, size }), className)}
    {...props}
  >
    {props.children}
  </div>
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm [&_a]:underline', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
