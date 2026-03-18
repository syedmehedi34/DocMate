import Image from "next/image";
import { MapPin, Phone, Mail, Send, ArrowRight } from "lucide-react";
import {
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";

const contactCards = [
  {
    icon: <MapPin size={20} />,
    title: "Our Location",
    value: "Uttara, Dhaka, 110018",
    href: "https://maps.google.com",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
    border: "border-green-100",
  },
  {
    icon: <Phone size={20} />,
    title: "Phone Number",
    value: "+880 1259-847490",
    href: "tel:+8801259847490",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    border: "border-blue-100",
  },
  {
    icon: <Mail size={20} />,
    title: "Email Address",
    value: "info@docmate.com",
    href: "mailto:info@docmate.com",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    border: "border-amber-100",
  },
];

const socials = [
  { icon: FaFacebook, color: "#1877f2", href: "#", label: "Facebook" },
  { icon: FaGoogle, color: "#db4437", href: "#", label: "Google" },
  { icon: FaInstagram, color: "#e1306c", href: "#", label: "Instagram" },
  { icon: FaYoutube, color: "#ff0000", href: "#", label: "YouTube" },
  { icon: FaPinterest, color: "#bd081c", href: "#", label: "Pinterest" },
];

const inputCls =
  "w-full px-4 py-3 text-sm bg-[#f8faf9] border border-gray-200 rounded-xl outline-none " +
  "focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 " +
  "text-gray-800 placeholder-gray-400";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* ── Hero ── */}
      <div className="relative w-full h-64 md:h-90 flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/aboutUs.jpg"
          alt="Contact background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gray-950/72" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#f8faf9]" />
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-green-500" />

        <div className="relative z-10 text-center px-4">
          <div
            className="inline-flex items-center gap-2 bg-green-500/12 border border-green-500/25
                          rounded-full px-4 py-1.5 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">
              Get In Touch
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight">
            Contact <span className="text-green-400">Us</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base mt-3 max-w-md mx-auto">
            We're here to help and answer any questions you might have.
          </p>
        </div>
      </div>

      {/* ── Contact cards ── */}
      <div className="max-w-5xl mx-auto px-4 -mt-2 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 ${card.bg} border ${card.border}
                          rounded-2xl p-5 hover:shadow-md transition-all duration-300`}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl
                              ${card.iconBg} ${card.iconColor} shrink-0`}
              >
                {card.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                  {card.title}
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {card.value}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="ml-auto text-gray-300 group-hover:text-gray-500
                           group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
              />
            </a>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── Left: info + map + socials ── */}
          <div className="flex flex-col gap-6">
            {/* Text block */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-0.5 bg-green-600 rounded-full" />
                <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                  Stay Connected
                </p>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-3">
                Let's Start a{" "}
                <span className="text-green-700">Conversation</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Have questions about our services or need medical assistance?
                Our dedicated team is here to help you with world-class
                healthcare solutions — anytime, anywhere.
              </p>

              {/* Office hours */}
              <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
                {[
                  { day: "Mon – Fri", time: "9:00 AM – 6:00 PM" },
                  { day: "Sat – Sun", time: "10:00 AM – 4:00 PM" },
                ].map((h) => (
                  <div
                    key={h.day}
                    className="bg-[#f8faf9] rounded-xl px-4 py-3"
                  >
                    <p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">
                      {h.day}
                    </p>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">
                      {h.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Map embed placeholder */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-52 bg-gray-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.4!2d90.3854!3d23.8759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUyJzMyLjMiTiA5MMKwMjMnMDcuNiJF!5e0!3m2!1sen!2sbd!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>

            {/* Socials */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest font-semibold mb-4">
                Follow Us On
              </p>
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-xl
                               bg-[#f8faf9] border border-gray-200 hover:border-transparent
                               transition-all duration-200 hover:scale-110 hover:shadow-md"
                    style={{ "--hover-color": s.color }}
                  >
                    <s.icon size={17} style={{ color: s.color }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Contact form ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Send a Message
              </p>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              We'll get back to you within 24 hours.
            </h3>

            <form className="space-y-4">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className={inputCls}
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  placeholder="Write your message here..."
                  rows={5}
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2
                           bg-green-700 hover:bg-green-800 text-white
                           text-sm font-semibold py-3.5 rounded-xl
                           transition-colors duration-200 shadow-sm mt-2"
              >
                <Send size={15} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
