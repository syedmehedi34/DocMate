import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  // Footer Social Icon (same hover vibe as banner)
  const FooterSocialIcon = ({ icon: Icon, href }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300" />

      {/* Icon */}
      <div className="relative flex items-center justify-center h-10 w-10 rounded-full border border-cyan-300 bg-[#042020] text-cyan-300 hover:text-white transition-colors duration-300 z-10">
        <Icon size={18} />
      </div>
    </motion.a>
  );

  return (
    <footer className="bg-gradient-to-r from-[#042020] via-[#1e4046] to-[#0EA5E9] text-white py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start gap-4 md:gap-8 justify-between">
        {/* Left Side */}
        <div className="max-w-md">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/assets/docmate.png"
              alt="Med Expert BD Logo"
              width={150}
              height={50}
              className="mb-2"
            />
          </Link>

          <p className="text-gray-300">
            Your trusted consultancy for expert medical advice and healthcare
            solutions.
          </p>

          {/* Social Icons */}
          <div className="mt-4 flex space-x-4">
            <FooterSocialIcon href="#" icon={FaFacebookF} />
            <FooterSocialIcon href="#" icon={FaTwitter} />
            <FooterSocialIcon href="#" icon={FaLinkedinIn} />
            <FooterSocialIcon href="#" icon={FaInstagram} />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-shrink-0">
          <h3 className="text-xl font-semibold text-white">Quick Links</h3>
          <ul className="mt-2 space-y-1 md:space-y-2">
            <li>
              <Link
                href="/"
                className="text-gray-200 hover:text-white transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="text-gray-200 hover:text-white transition"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/pages/about"
                className="text-gray-200 hover:text-white transition"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/pages/contact"
                className="text-gray-200 hover:text-white transition"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-8 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} ·{" "}
        <span className="font-semibold">Med Expert BD Consultancy</span> · All
        rights reserved
      </div>
    </footer>
  );
}
