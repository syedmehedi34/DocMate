"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import { Activity } from "lucide-react";
import { MdLabelImportant } from "react-icons/md";

const updates = [
  "Heart Surgery in Bangladesh – Advanced cardiac care with top surgeons and world-class hospitals.",
  "Neurosurgery in Bangladesh – Cutting-edge brain and spine treatments by expert neurosurgeons.",
  "Orthopedic Surgery in Bangladesh – Expert care for joint, bone treatments with top surgeons.",
  "Cancer Treatment in Bangladesh – Advanced oncology care with top specialists and cutting-edge technology.",
  "Organ Transplant in Bangladesh – Life-saving transplants with top specialists and world-class facilities.",
  "Spine Surgery in Bangladesh – Advanced treatment for spinal disorders with expert surgeons.",
];

export default function Updates() {
  return (
    <div className="mx-3 mb-4 flex items-stretch rounded-xl overflow-hidden border border-green-100 shadow-sm bg-white">
      {/* Left label */}
      <div className="flex items-center gap-2 bg-green-700 px-4 py-2.5 shrink-0">
        <Activity size={14} className="text-green-200" />
        <span className="text-white text-[0.72rem] font-semibold tracking-widest uppercase whitespace-nowrap">
          Medical News
        </span>
      </div>

      {/* Thin divider accent */}
      <div className="w-0.75 bg-green-400 shrink-0" />

      {/* Marquee */}
      <div className="flex-1 flex items-center overflow-hidden bg-white">
        <Marquee
          autoFill={true}
          pauseOnHover={true}
          speed={45}
          gradient={false}
        >
          {updates.map((text, i) => (
            <Link
              key={i}
              href="#"
              className="flex items-center gap-1.5 mx-8 text-[0.8rem] font-medium text-gray-600 hover:text-green-700 transition-colors duration-200 whitespace-nowrap group"
            >
              <MdLabelImportant className="text-green-500 text-base shrink-0 group-hover:text-green-700 transition-colors duration-200" />
              {text}
            </Link>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
