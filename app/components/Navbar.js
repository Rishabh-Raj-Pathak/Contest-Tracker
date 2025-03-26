"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActiveTab = (path) => {
    return pathname === path ? "tab-active" : "";
  };

  return (
    <div className="navbar bg-white border-b shadow-sm h-16">
      {/* Logo Section */}
      <div className="navbar-start pl-4">
        <Link
          href="/"
          className="btn btn-ghost gap-2 normal-case text-xl hover:bg-base-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="font-semibold">Contest Tracker</span>
        </Link>
      </div>

      {/* Navigation Tabs - Desktop */}
      <div className="navbar-center hidden lg:flex">
        <div className="tabs tabs-boxed bg-base-200 p-1 gap-1">
          <Link
            href="/"
            className={`tab min-w-[120px] ${isActiveTab(
              "/"
            )} hover:bg-base-100 transition-colors duration-200`}
          >
            Contests
          </Link>
          <Link
            href="/calendar"
            className={`tab min-w-[120px] ${isActiveTab(
              "/calendar"
            )} hover:bg-base-100 transition-colors duration-200`}
          >
            Calendar
          </Link>
          <Link
            href="/videos"
            className={`tab min-w-[120px] ${isActiveTab(
              "/videos"
            )} hover:bg-base-100 transition-colors duration-200`}
          >
            Videos
          </Link>
        </div>
      </div>

      {/* Theme Toggle & Mobile Menu */}
      <div className="navbar-end pr-4">
        <button className="btn btn-ghost btn-circle hover:bg-base-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>

        {/* Mobile Menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle hover:bg-base-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                Contests
              </Link>
            </li>
            <li>
              <Link
                href="/calendar"
                className={pathname === "/calendar" ? "active" : ""}
              >
                Calendar
              </Link>
            </li>
            <li>
              <Link
                href="/videos"
                className={pathname === "/videos" ? "active" : ""}
              >
                Videos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
