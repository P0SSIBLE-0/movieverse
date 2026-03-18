'use client';

import type { ReactNode } from "react";
import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
} from "next/navigation";

type LinkProps = Omit<React.ComponentProps<typeof NextLink>, "href"> & {
  to: string;
};

export function Link({ to, ...props }: LinkProps) {
  return <NextLink href={to} {...props} />;
}

type NavLinkProps = Omit<LinkProps, "className"> & {
  className?: string | ((args: { isActive: boolean }) => string);
};

export function NavLink({ to, className, ...props }: NavLinkProps) {
  const pathname = usePathname() ?? "";
  const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  return <NextLink href={to} className={resolvedClassName} {...props} />;
}

export function useNavigate() {
  const router = useRouter();

  return (to: number | string) => {
    if (typeof to === "number") {
      if (to === -1) {
        router.back();
        return;
      }

      window.history.go(to);
      return;
    }

    router.push(to);
  };
}

export function useLocation() {
  const pathname = usePathname() ?? "";
  const search = typeof window !== "undefined" ? window.location.search : "";

  return {
    pathname,
    search,
    hash: "",
  };
}

export function useParams<T extends Record<string, string | undefined>>() {
  const params = useNextParams<Record<string, string | string[]>>() ?? {};

  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  ) as T;
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function Routes({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function Route() {
  return null;
}

export function Outlet() {
  return null;
}
