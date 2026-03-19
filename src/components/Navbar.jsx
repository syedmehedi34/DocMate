"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Stethoscope,
  Sun,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* close on route change */
  useEffect(() => {
    setUserMenu(false);
    setIsOpen(false);
  }, [pathname]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "All Doctors", href: "/alldoctors" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const dashboardHref = `/dashboard/${session?.user?.role}/profile`;
  const isActive = (href) => pathname === href;
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`nav-root ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link href="/" className="nav-logo" onClick={closeMenu}>
            <div className="nav-logo-icon">
              <Stethoscope size={17} color="#16a34a" strokeWidth={2.2} />
            </div>
            <span className="nav-logo-text">
              Doc<span>Mate</span>
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? "nav-link-active" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* ── Desktop right side ── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle — wired up by parent/context */}
            {/* <button className="nav-theme-btn" aria-label="Toggle theme">
              <Sun size={15} />
            </button> */}

            {session ? (
              /* ── User dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  className="nav-user-btn"
                  aria-label="User menu"
                >
                  <div className="nav-user-avatar">
                    {session.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </div>
                  <span className="nav-user-name">
                    {session.user?.name ?? "User"}
                  </span>
                  {session.user?.role && (
                    <span className="nav-role-tag">{session.user.role}</span>
                  )}
                  <ChevronDown
                    size={13}
                    className={`nav-chevron ${userMenu ? "nav-chevron-open" : ""}`}
                  />
                </button>

                {userMenu && (
                  <div className="nav-dropdown">
                    {/* Header */}
                    <div className="nav-dropdown-header">
                      <p className="nav-dropdown-name">
                        {session.user?.name ?? "User"}
                      </p>
                      <p className="nav-dropdown-email">
                        {session.user?.email ?? ""}
                      </p>
                    </div>

                    {/* Items */}
                    <div className="nav-dropdown-body">
                      <Link
                        href={dashboardHref}
                        className="nav-dropdown-item"
                        onClick={() => setUserMenu(false)}
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>

                      <Link
                        href={dashboardHref}
                        className="nav-dropdown-item"
                        onClick={() => setUserMenu(false)}
                      >
                        <User size={15} />
                        My Profile
                      </Link>

                      <div className="nav-dropdown-sep" />

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="nav-dropdown-item nav-dropdown-item-danger"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`nav-btn-login ${isActive("/login") ? "nav-btn-current-outline" : ""}`}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className={`nav-btn-register ${isActive("/register") ? "nav-btn-current-solid" : ""}`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile right side ── */}
          <div className="md:hidden flex items-center gap-2">
            <button className="nav-theme-btn" aria-label="Toggle theme">
              <Sun size={14} />
            </button>
            <button
              className="nav-hamburger"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className="md:hidden nav-drawer"
        style={{
          maxHeight: isOpen ? "520px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-4 pt-2 pb-5 flex flex-col gap-0.5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMenu}
              className={`nav-mobile-link ${isActive(item.href) ? "nav-mobile-link-active" : ""}`}
            >
              {item.name}
            </Link>
          ))}

          <div className="nav-divider" />

          {session ? (
            <div className="flex flex-col gap-2 pt-1">
              {/* User info */}
              <div className="flex items-center gap-3 px-2 py-1">
                <div
                  className="nav-user-avatar"
                  style={{ width: 34, height: 34, fontSize: "0.9rem" }}
                >
                  {session.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    style={{
                      color: "#111827",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                    }}
                  >
                    {session.user?.name ?? "User"}
                  </span>
                  {session.user?.role && (
                    <span
                      className="nav-role-tag"
                      style={{ width: "fit-content" }}
                    >
                      {session.user.role}
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={dashboardHref}
                onClick={closeMenu}
                className="nav-mobile-link"
                style={{ gap: 9 }}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>

              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  closeMenu();
                }}
                className="nav-mobile-signout"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link
                href="/login"
                onClick={closeMenu}
                className={`nav-btn-login flex-1 justify-center ${isActive("/login") ? "nav-btn-current-outline" : ""}`}
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className={`nav-btn-register flex-1 justify-center ${isActive("/register") ? "nav-btn-current-solid" : ""}`}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
