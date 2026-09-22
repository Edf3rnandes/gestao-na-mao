"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarClock,
  Dumbbell,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  MessageCircleHeart,
  X,
} from "lucide-react";
import { signOut } from "@/app/(app)/actions";

const NAV_ITEMS = [
  { href: "/", label: "Visão do dia", icon: LayoutDashboard },
  { href: "/demandas", label: "Demandas", icon: ListTodo },
  { href: "/planner", label: "Planner", icon: CalendarClock },
  { href: "/treino", label: "Treino", icon: Dumbbell },
  {
    href: "/assistente",
    label: "Assistente",
    icon: MessageCircleHeart,
    disabled: true,
  },
];

export function AppShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        if (item.disabled) {
          return (
            <span
              key={item.href}
              title="Em breve"
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 dark:text-neutral-600"
            >
              <Icon size={18} />
              {item.label}
              <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                em breve
              </span>
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white py-6 dark:border-neutral-800 dark:bg-neutral-900 md:flex">
        <div className="px-6 pb-6">
          <p className="text-lg font-semibold">Gestão na Mão</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {email}
          </p>
        </div>
        {nav}
        <form action={signOut} className="mt-auto px-3 pt-6">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900">
            <LogOut size={18} />
            Sair
          </button>
        </form>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative z-50 flex w-64 flex-col bg-white py-6 dark:bg-neutral-900">
            <div className="flex items-center justify-between px-6 pb-6">
              <p className="text-lg font-semibold">Gestão na Mão</p>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {nav}
            <form action={signOut} className="mt-auto px-3 pt-6">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900">
                <LogOut size={18} />
                Sair
              </button>
            </form>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 md:hidden">
          <button onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <p className="text-base font-semibold">Gestão na Mão</p>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
