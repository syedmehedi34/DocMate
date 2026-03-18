import React from "react";
import { MoveRight, GraduationCap, Briefcase, Award } from "lucide-react";

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
      <Icon size={15} className="text-green-700" />
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
  </div>
);

const TimelineItem = ({ primary, secondary, meta }) => (
  <li className="relative pl-6">
    {/* dot */}
    <span
      className="absolute left-0 top-1.5 w-3 h-3 rounded-full
                     border-2 border-green-500 bg-green-50"
    />
    <p className="text-sm font-bold text-gray-900">{primary}</p>
    {secondary && <p className="text-sm text-gray-600 mt-0.5">{secondary}</p>}
    {meta && <p className="text-xs text-gray-400 mt-0.5">{meta}</p>}
  </li>
);

const DoctorDetailsOverview = ({ doctor }) => {
  return (
    <div className="mt-8 space-y-10">
      {/* ── About ── */}
      {doctor?.about && (
        <div className="bg-[#f8faf9] border border-gray-100 rounded-2xl p-6">
          <SectionTitle icon={Award} title="About" />
          <p className="text-sm text-gray-600 leading-relaxed">
            {doctor?.about}
          </p>
        </div>
      )}

      {/* ── Education + Work side by side ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education */}
        <div className="bg-[#f8faf9] border border-gray-100 rounded-2xl p-6">
          <SectionTitle icon={GraduationCap} title="Education" />
          <ul className="space-y-5 border-l-2 border-gray-200 pl-4">
            {doctor?.educations?.map((edu) => (
              <TimelineItem
                key={edu?._id}
                primary={edu?.institution}
                secondary={edu?.degree}
                meta={edu?.year}
              />
            ))}
          </ul>
        </div>

        {/* Work & Experience */}
        <div className="bg-[#f8faf9] border border-gray-100 rounded-2xl p-6">
          <SectionTitle icon={Briefcase} title="Work & Experience" />
          <ul className="space-y-5 border-l-2 border-gray-200 pl-4">
            {doctor?.worksAndExperiences?.map((exp) => (
              <TimelineItem
                key={exp?._id}
                primary={exp?.workedAt}
                secondary={exp?.position}
                meta={exp?.duration}
              />
            ))}
          </ul>
        </div>
      </div>

      {/* ── Specializations ── */}
      {doctor?.specializations?.length > 0 && (
        <div className="bg-[#f8faf9] border border-gray-100 rounded-2xl p-6">
          <SectionTitle icon={Award} title="Specializations" />
          <div className="flex flex-col gap-2">
            {doctor?.specializations?.map((spec, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-sm text-gray-700"
              >
                <MoveRight size={14} className="text-green-600 shrink-0" />
                {spec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetailsOverview;
