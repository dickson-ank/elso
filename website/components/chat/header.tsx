"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Header({ userName, onLogout }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
      <h1 className="text-lg font-bold text-foreground hidden sm:block">
        ElSO DENTAL AI
      </h1>

      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {userName}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="gap-2 text-xs md:text-sm bg-transparent"
        >
          <LogOut size={16} className="hidden md:inline" />
          <span>Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
