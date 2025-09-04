import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-600">© {new Date().getFullYear()} EventPolls. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/events" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Events
          </Link>
        </nav>
      </div>
    </footer>
  )
}

