"use client";

import type React from "react";
import { Input } from "@/components/ui/input";



export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  autoCapitalize,
  autoCorrect,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1">
        {label}
      </label>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full"
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
      />
    </div>
  );
}
