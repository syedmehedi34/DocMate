"use client";

import Image from "next/image";
import { useState } from "react";
import { Parallax } from "react-parallax";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

const Newsletter = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log(e.target.email.value);
      e.target.email.value = "";
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }, 800);
  };

  return (
    <Parallax
      blur={{ min: -30, max: 30 }}
      bgImage="https://i.ibb.co/qYkBsgdW/three.jpg"
      bgImageAlt="Newsletter background"
      strength={-200}
    >
      {/* Overlay */}
      <div className="relative bg-gray-950/80 backdrop-blur-sm">
        {/* Top green accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-green-500" />

        <div className="max-w-2xl mx-auto px-6 py-14 flex flex-col items-center text-center">
          {/* Logo */}
          <Image
            src="/assets/docmate.png"
            alt="DocMate"
            width={140}
            height={46}
            className="mx-auto mb-6 opacity-95"
          />

          {/* Label */}
          <div
            className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25
                          rounded-full px-4 py-1.5 mb-5"
          >
            <Mail size={12} className="text-green-400" />
            <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">
              Newsletter
            </p>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-3">
            Stay Updated with <span className="text-green-400">DocMate</span>
          </h2>

          {/* Subtext */}
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
            Your trusted consultancy for expert medical advice and healthcare
            solutions. Get the latest health tips and news delivered to your
            inbox.
          </p>

          {/* Form */}
          {submitted ? (
            <div
              className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/30
                            rounded-xl px-6 py-4 text-green-400 text-sm font-semibold"
            >
              <CheckCircle2 size={18} />
              You're subscribed! Thank you.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md"
            >
              <div className="relative flex-1">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white/8 hover:bg-white/10 focus:bg-white/12
                             border border-white/12 focus:border-green-500/50
                             text-white placeholder-gray-500 text-sm
                             pl-9 pr-4 py-3 rounded-xl outline-none
                             transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2
                           bg-green-600 hover:bg-green-700 disabled:bg-green-800
                           text-white text-sm font-semibold
                           px-6 py-3 rounded-xl
                           transition-colors duration-200 shadow-md shrink-0"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Trust note */}
          <p className="text-gray-600 text-[0.7rem] mt-4">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </Parallax>
  );
};

export default Newsletter;
