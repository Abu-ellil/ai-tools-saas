"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  // For demo purposes, we'll simulate a signed-in state
  const isSignedIn = false;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          أدوات الذكاء
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="hover:text-primary transition">
            الأسعار
          </Link>
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-primary transition">
                لوحة التحكم
              </Link>
              <Link href="/tools" className="hover:text-primary transition">
                الأدوات
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hover:text-primary transition">
                تسجيل الدخول
              </Link>
            </>
          )}
          <div className="flex items-center gap-4">
            <ModeToggle />
            {isSignedIn && (
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            )}
            {!isSignedIn && (
              <Button asChild>
                <Link href="/sign-up">إنشاء حساب</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          <ModeToggle />
          {isSignedIn && (
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          )}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="w-full cursor-pointer">
                  الأسعار
                </Link>
              </DropdownMenuItem>
              {isSignedIn ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full cursor-pointer">
                      لوحة التحكم
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tools" className="w-full cursor-pointer">
                      الأدوات
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-in" className="w-full cursor-pointer">
                      تسجيل الدخول
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-up" className="w-full cursor-pointer">
                      إنشاء حساب
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
