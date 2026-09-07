import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  cn(
    'group pointer-events-auto relative flex w-full max-w-[400px] items-start gap-3',
    'overflow-hidden rounded-md border p-4 pr-12 shadow-lg',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)]',
    'data-[swipe=move]:rotate-[var(--radix-toast-swipe-rotate)]',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[swipe=end]:slide-out-to-right',
    'data-[state=open]:slide-in-from-top-full',
  ),
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive: 'border-destructive bg-destructive/10 text-destructive',
        success: 'border-green-600 bg-green-50 text-green-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4',
      'xbottom-0 xb:right-4 xb:top-auto',
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 items-center justify-center rounded-md border bg-secondary px-3 text-xs font-medium',
      'transition-colors hover:bg-secondary/80 focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50',
      'hover:text-foreground focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  >
    {props.children}
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  toastVariants,
};

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
export type ToastActionProps = React.ComponentPropsWithoutRef<typeof ToastAction>;
