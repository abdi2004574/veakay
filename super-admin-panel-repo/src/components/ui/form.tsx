import * as React from 'react';
import {
  Controller,
  FormProvider,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Form = FormProvider;

type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  render: (props: {
    field: {
      name: TName;
      value: unknown;
      onChange: (value: unknown) => void;
      onBlur: () => void;
      ref: React.Ref<unknown>;
    };
    fieldState: {
      error?: { message?: string };
    };
    formState: unknown;
  }) => React.ReactNode;
};

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  render,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => render({ field, fieldState, formState })}
    />
  );
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props} />
  ),
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn('text-sm font-medium leading-none', className)}
    {...props}
  />
));
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm', className)} {...props} />
  ),
);
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formState, name } = useFormContext();
  const error = formState?.errors?.[name]?.message;

  if (!error) return null;

  return (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {typeof error === 'string' ? error : 'Invalid value'}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
};
