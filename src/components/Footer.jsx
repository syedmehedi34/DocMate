import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Phone, Mail, MapPin, ArrowUpRight, Stethoscope } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Doctors", href: "/pages/alldoctors" },
  { name: "About Us", href: "/pages/about" },
  { name: "Contact Us", href: "/pages/contact" },
];

const services = [
  "Heart Surgery",
  "Neuro Surgery",
  "Spine Surgery",
  "Organ Transplant",
  "Cancer Treatment",
  "Orthopedic Surgery",
];

const socials = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
];

const SocialIcon = ({ icon: Icon, href, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className="flex items-center justify-center w-9 h-9 rounded-xl
               bg-white/5 hover:bg-green-600 border border-white/10
               hover:border-green-600 text-gray-400 hover:text-white
               transition-colors duration-200"
  >
    <Icon size={15} />
  </motion.a>
);

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Top green accent */}
      <div className="h-px bg-green-500" />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ── Col 1: Brand ── */}
          <div className="lg:col-span-1">
            {/* Text logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-5 group"
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl
                              bg-green-700 border border-green-600/40 shrink-0"
              >
                <Stethoscope size={17} color="#fff" strokeWidth={2.2} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Doc<span className="text-green-400">Mate</span>
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted consultancy for expert medical advice and world-class
              healthcare solutions.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <SocialIcon key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* ── Col 2: Quick Links ── */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-1.5 text-sm text-gray-400
                               hover:text-green-400 transition-colors duration-200 group"
                  >
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Services ── */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    href="/pages/alldoctors"
                    className="flex items-center gap-1.5 text-sm text-gray-400
                               hover:text-green-400 transition-colors duration-200 group"
                  >
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Contact ── */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+8801700000000"
                  className="flex items-start gap-3 text-sm text-gray-400
                             hover:text-green-400 transition-colors duration-200"
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg
                                  bg-green-500/10 border border-green-500/20 shrink-0 mt-0.5"
                  >
                    <Phone size={13} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-gray-600 uppercase tracking-wider mb-0.5">
                      Phone
                    </p>
                    +880 1700-000000
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@docmate.com"
                  className="flex items-start gap-3 text-sm text-gray-400
                             hover:text-green-400 transition-colors duration-200"
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg
                                  bg-green-500/10 border border-green-500/20 shrink-0 mt-0.5"
                  >
                    <Mail size={13} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-gray-600 uppercase tracking-wider mb-0.5">
                      Email
                    </p>
                    info@docmate.com
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg
                                  bg-green-500/10 border border-green-500/20 shrink-0 mt-0.5"
                  >
                    <MapPin size={13} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-gray-600 uppercase tracking-wider mb-0.5">
                      Address
                    </p>
                    Dhaka, Bangladesh
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/5">
        <div
          className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row
                        items-center justify-between gap-3"
        >
          <p className="text-gray-600 text-xs text-center">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-400 font-semibold">DocMate</span> · All
            rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <Link
                key={t}
                href="#"
                className="text-gray-600 hover:text-gray-400 text-xs
                           transition-colors duration-200"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
