'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink(props: { href: string, pathRoot: string, title: string }) {
  const pathName = usePathname();

  return (
    <Link href={props.href} className={pathName.startsWith(props.pathRoot) ? 'font-semibold text-primary' : 'hover:underline'}>{props.title}</Link>
  );
}
