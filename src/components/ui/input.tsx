import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: HTMLElement["className"];
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, required, label, error, containerClassName, ...props },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col", containerClassName)}>
        {label ? (
          <div className="flex gap-1">
            <Label className="font-bold font-sans text-dark-blue">
              {label}
            </Label>
            {required ? (
              <span className="text-red-700 font-sans">*</span>
            ) : null}
          </div>
        ) : null}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-sans",
            className,
            {
              ["border-red-500"]: Boolean(error),
            }
          )}
          ref={ref}
          required={required}
          {...props}
        />
        {error ? (
          <p className="text-red-500 text-xs font-sans pl-1 pt-1 font-medium">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
