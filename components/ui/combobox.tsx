"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Seleziona...",
  searchPlaceholder = "Cerca...",
  emptyText = "Nessun risultato.",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-10 justify-between bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700 text-white hover:text-white rounded-xl text-sm font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-none",
            className
          )}
        >
          <span className={cn(!selectedLabel ? "text-neutral-400" : "text-white font-medium")}>
            {selectedLabel ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-neutral-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-neutral-900 border border-neutral-800 text-white rounded-2xl shadow-2xl overflow-hidden z-50"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command className="bg-neutral-900 text-white">
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-10 border-b border-neutral-800 text-white placeholder:text-neutral-500 text-xs px-3"
          />
          <CommandList className="max-h-60 overflow-y-auto p-1.5 text-white">
            <CommandEmpty className="py-6 text-center text-xs text-neutral-400">
              {emptyText}
            </CommandEmpty>
            <CommandGroup className="text-white">
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onValueChange(opt.value);
                    setOpen(false);
                  }}
                  className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-neutral-200 data-[selected=true]:bg-neutral-800 data-[selected=true]:text-white hover:bg-neutral-800 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4 text-blue-400",
                        value === opt.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{opt.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
