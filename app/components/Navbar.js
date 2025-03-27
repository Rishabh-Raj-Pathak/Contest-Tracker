"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActiveTab = (path) => {
    return pathname === path
      ? "bg-white/90 text-gray-900 shadow-sm"
      : "text-white/90 hover:bg-white/10";
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="bg-[#1a1b1e]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="font-bold text-2xl tracking-tight text-blue-300">
                  CP
                </span>
              </Link>
            </div>

            {/* Center Navigation */}
            <div className="flex-1 flex justify-center space-x-4">
              <div className="bg-black/20 rounded-full p-1 flex items-center">
                <Link
                  href="/"
                  className={`
                    px-6 py-2 rounded-full font-medium
                    transition-all duration-200 flex items-center gap-2
                    ${isActiveTab("/")}
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Contests</span>
                </Link>

                <Link
                  href="/calendar"
                  className={`
                    px-6 py-2 rounded-full font-medium
                    transition-all duration-200 flex items-center gap-2
                    ${isActiveTab("/calendar")}
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Calendar</span>
                </Link>
              </div>
            </div>

            {/* Right Section - Avatar */}
            <div className="flex-shrink-0">
              <button className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white/90"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
