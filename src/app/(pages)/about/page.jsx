import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Award,
  Users,
  Hospital,
  Stethoscope,
} from "lucide-react";

const features = [
  {
    title: "Expert Guidance",
    desc: "Personalized advice from certified medical professionals at every step.",
  },
  {
    title: "Extensive Network",
    desc: "Connected with 1,200+ doctors across 15+ partner hospitals.",
  },
  {
    title: "Seamless Coordination",
    desc: "End-to-end support from consultation to recovery follow-up.",
  },
  {
    title: "Quality Assurance",
    desc: "Rigorous standards ensuring the highest level of patient care.",
  },
];

const stats = [
  { icon: <Award size={20} />, value: "12+", label: "Years Experience" },
  { icon: <Users size={20} />, value: "10k+", label: "Patients Served" },
  { icon: <Hospital size={20} />, value: "15+", label: "Partner Hospitals" },
  { icon: <Stethoscope size={20} />, value: "1,200+", label: "Expert Doctors" },
];

const values = [
  {
    title: "Our Mission",
    desc: "To make world-class healthcare accessible to every patient, regardless of borders or barriers.",
    color: "bg-green-50 border-green-100",
    accent: "text-green-700",
    iconBg: "bg-green-100",
  },
  {
    title: "Our Vision",
    desc: "To become the most trusted medical tourism partner across South Asia and beyond.",
    color: "bg-blue-50 border-blue-100",
    accent: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  {
    title: "Our Values",
    desc: "Compassion, excellence, transparency — guiding every decision we make for our patients.",
    color: "bg-amber-50 border-amber-100",
    accent: "text-amber-700",
    iconBg: "bg-amber-100",
  },
];

export default function About() {
  return (
    <div className="bg-[#f8faf9]">
      {/* ── Hero Banner ── */}
      <div className="relative w-full h-[52vh] min-h-80 flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/aboutUs.jpg"
          alt="About DocMate"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gray-950/65" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#f8faf9]" />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-green-500" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4">
          <div
            className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/25
                          rounded-full px-4 py-1.5 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">
              Who We Are
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight">
            About <span className="text-green-400">DocMate</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base mt-3 max-w-md mx-auto">
            Your trusted partner in expert medical care and healthcare
            solutions.
          </p>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="max-w-7xl mx-auto px-4 -mt-2 mb-16">
        <div
          className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2
                        divide-gray-100 border-2 border-gray-100 rounded-2xl overflow-hidden
                        bg-white shadow-sm"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center text-center
                         px-6 py-8 hover:bg-green-50 transition-colors duration-300 group"
            >
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl
                              bg-green-100 text-green-700 mb-3
                              group-hover:bg-green-700 group-hover:text-white
                              transition-colors duration-300"
              >
                {s.icon}
              </div>
              <p className="text-3xl font-black text-gray-900 leading-none">
                {s.value}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-1.5 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main about section ── */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — images collage */}
          <div className="relative h-105 md:h-125">
            {/* Main large image */}
            <div className="absolute left-0 top-0 w-[65%] h-[85%] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/assets/aboutUs.jpg"
                alt="DocMate team"
                fill
                className="object-cover"
              />
            </div>
            {/* Small overlay image */}
            <div
              className="absolute right-0 bottom-0 w-[50%] h-[55%] rounded-2xl overflow-hidden
                            shadow-xl border-4 border-white"
            >
              <Image
                src="/assets/abouts-img2.jpg"
                alt="Medical care"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating experience badge */}
            <div
              className="absolute left-[55%] top-[30%] -translate-x-1/2 z-10
                            bg-white rounded-2xl px-5 py-4 shadow-xl border border-gray-100 text-center"
            >
              <p className="text-4xl font-black text-green-700 leading-none">
                12
              </p>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Years of
                <br />
                Excellence
              </p>
            </div>
            {/* Green dot decoration */}
            <div className="absolute -bottom-4 left-8 w-16 h-16 bg-green-100 rounded-full z-0" />
            <div className="absolute top-6 right-6 w-8 h-8 bg-green-200 rounded-full z-0" />
          </div>

          {/* Right — text */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Regarding Us
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-4">
              DocMate — Your Trusted Partner in{" "}
              <span className="text-green-700">Medical Tourism</span>
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              At DocMate, we understand that health knows no borders, and access
              to world-class medical care is a universal right. Our team is
              dedicated to providing seamless coordination for your entire
              medical journey.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              We combine expertise, compassion, and personalized care to make
              your healthcare experience as smooth and effective as possible —
              from first consultation to full recovery.
            </p>

            {/* Features list */}
            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <CheckCircle2
                    size={17}
                    className="text-green-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {f.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/pages/alldoctors"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800
                         text-white text-sm font-semibold px-6 py-3 rounded-xl
                         transition-colors duration-200 shadow-sm"
            >
              Meet Our Doctors
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mission / Vision / Values ── */}
      <div className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-8 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Our Foundation
              </p>
              <span className="w-8 h-0.5 bg-green-600 rounded-full" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              What Drives <span className="text-green-700">DocMate</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className={`${v.color} border rounded-2xl p-7 hover:shadow-md transition-shadow duration-300`}
              >
                <h3 className={`text-lg font-bold ${v.accent} mb-3`}>
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA banner ── */}
      <div className="relative overflow-hidden bg-gray-950 py-16 px-4">
        <div className="absolute inset-0 bg-[url('/assets/aboutUs.jpg')] bg-cover bg-center opacity-8" />
        <div className="absolute -left-10 bottom-0 w-64 h-64 bg-green-600/15 rounded-full blur-3xl" />
        <div className="absolute right-0 top-0 w-48 h-48 bg-green-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-3">
            Ready to get started?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Find the Right Doctor for You
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Browse our network of 1,200+ certified specialists and book your
            appointment in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pages/alldoctors"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700
                         text-white text-sm font-semibold px-7 py-3.5 rounded-xl
                         transition-colors duration-200 shadow-md"
            >
              Browse All Doctors
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/pages/contact"
              className="inline-flex items-center justify-center gap-2
                         border border-white/15 hover:border-white/30
                         bg-white/5 hover:bg-white/10
                         text-white text-sm font-medium px-7 py-3.5 rounded-xl
                         transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
