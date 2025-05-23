"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";

export type NavItem = {
  title: string;
  href?: string;
  children?: NavItem[];
  description?: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    title: "الإضافة",
    children: [
      {
        title: "إضافة  طلبية",
        href: "/add/orders",
        description: "إضافة طلبية جديدة إلى النظام",
      },
      {
        title: "إضافة ارتباط",
        href: "/add/user",
        description: "إضافة مستخدم جديد إلى النظام",
      },
      {
        title: "إضافة فئة",
        href: "/add/category",
        description: "إضافة فئة جديدة للمنتجات",
      },
    ],
  },
  {
    title: "البحث",
    children: [
      {
        title: "رقم طلبية",
        href: "/search/orders",
        description: "البحث عن طريق رقم الطليية  ",
      },
      {
        title: "اسم المادة",
        href: "/search/materialName",
        description: "البحث عن طريق اسم المادة",
      },
      {
        title: "بحث متقدم",
        href: "/dynmicTableWithPagination/",
        description: "خيارات البحث المتقدم مع فلاتر متعددة",
      },
    ],
  },
  {
    title: "هيكلة الشركة",
    children: [
      {
        title: "الإدارات",
        href: "/structure/departments",
        description: "هيكلة الإدارات والفرق",
      },
      {
        title: "الموظفون",
        href: "/structure/employees",
        description: "سجل موظفي الشركة",
      },
      {
        title: "الفروع",
        href: "/structure/branches",
        description: "فروع الشركة والمخازن",
      },
    ],
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      dir="rtl"
    >
      <div className="container flex h-16 items-center">
        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">تبديل القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="text-right">
              <div className="flex flex-col space-y-4 pt-6">
                {NAV_ITEMS.map((item) => (
                  <div key={item.title} className="flex flex-col">
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setActiveSubmenu(
                            activeSubmenu === item.title ? null : item.title
                          )}
                          className={cn(
                            "flex items-center justify-between font-medium font-arabic py-2",
                            "transition-colors duration-500 hover:text-sky-500"
                          )}
                        >
                          {item.title}
                          <span className={cn(
                            " transform transition-transform duration-300",
                            activeSubmenu === item.title ? "rotate-180" : "rotate-0"
                          )}>
                            ↓
                          </span>
                        </button>
                        {activeSubmenu === item.title && (
                          <div className="flex flex-col pr-4 space-y-2 mt-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.title}
                                href={child.href || "#"}
                                className={cn(
                                  " text-sm py-1.5 block font-arabic text-right",
                                  "transition-colors duration-500 hover:text-sky-500 rounded-md px-2"
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                <div className="flex flex-col items-end">
                                  {child.description && (
                                    <span className="text-xs text-muted-foreground">
                                      {child.description}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className={cn(
                          "font-medium font-arabic py-2",
                          "transition-colors duration-500 hover:text-sky-500"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center mx-4 font-arabic">
          <span className="inline-block font-bold text-lg hover:text-sky-500 transition-colors duration-500">
            شركة مصافي الوسط
          </span>
        </Link>

        {/* Desktop Navigation with Sky Blue Hover Effects */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div 
              key={item.title}
              className="relative group"
              onMouseEnter={() => setActiveSubmenu(item.title)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              {item.children ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      "font-arabic text-lg font-extrabold  px-3 py-2",
                      "transition-colors duration-500",
                      "text-foreground hover:text-sky-500"
                    )}
                  >
                    {item.title}
                    <span className={cn(
                      "font-extrabold text-lg mr-1 transform transition-transform duration-300",
                      activeSubmenu === item.title ? "rotate-180" : "rotate-0"
                    )}>
                      ↑
                    </span>
                  </Button>
                  <div className={cn(
                    "absolute right-0 mt-0 w-56 origin-top-right rounded-md bg-popover shadow-lg",
                    "transition-all duration-300 ease-out",
                    "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100",
                    activeSubmenu === item.title ? "block" : "hidden"
                  )}>
                    <div className="py-1 ">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href || "#"}
                          className={cn(
                            "font-extrabold  text-sm block px-4 py-2  font-arabic text-right",
                            "transition-colors duration-500",
                            "text-foreground hover:text-sky-500"
                          )}
                        >
                          <div className="flex flex-col ">
                            <span>{child.title}</span> 
                            {child.description && (
                              <span className="text-xs text-muted-foreground">
                                {child.description}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "font-arabic text-sm font-medium px-3 py-2",
                    "transition-colors duration-500",
                    "text-foreground hover:text-sky-500"
                  )}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Empty div to balance the layout */}
       
        <Link href="/" className="flex items-center mx-4 font-arabic">
        ,<div className="flex items-center justify-between">
        <span className=" inline-block font-bold text-lg hover:text-sky-500 transition-colors duration-500">
          نظام متابعة الطلبيات
          </span>

         
        </div>
        </Link>

        
      </div>
    </header>
  );
}