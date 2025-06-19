"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useImperativeHandle } from "react";

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  maxHeight: number;
  minHeight: number;
};

type AutosizeTextAreaProps = {
  maxHeight?: number;
  minHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutosizeTextarea = React.forwardRef<
  AutosizeTextAreaRef,
  AutosizeTextAreaProps
>(({ className, onChange, value, ...props }, ref) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

  useImperativeHandle(ref, () => ({
    textArea: textAreaRef.current as HTMLTextAreaElement,
    focus: () => textAreaRef?.current?.focus(),
    maxHeight: props.maxHeight || Number.MAX_SAFE_INTEGER,
    minHeight: props.minHeight || 0,
  }));

  return (
    <textarea
      {...props}
      value={value}
      ref={textAreaRef}
      className={cn(
        "flex w-full md:h-full h-24 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onChange={(e) => {
        onChange?.(e);
      }}
    />
  );
});
AutosizeTextarea.displayName = "AutosizeTextarea";
