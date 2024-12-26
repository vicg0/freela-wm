import Link from "next/link";

interface NavigationProps {
  icon: React.ReactNode;
  text: string;
  href: string;
}

export function Navigation({ icon, text, href }: NavigationProps) {
  return (
    <Link href={href} className="text-white flex items-center gap-3 py-2 px-4 border-[1px] border-white rounded-md hover:bg-blue-500">
      {icon}
      {text}
    </Link>
  )
}