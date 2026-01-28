import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

const DoctorDetailsOverview = ({ doctor }) => {
  return (
    <>
      <div className="mt-10 space-y-8 font-medium">
        <div>
          <h3 className="text-xl font-bold text-[#003367] mb-3">About</h3>
          <p className="text-[#003367] leading-relaxed">{doctor?.about}</p>
        </div>
        {/* Education  */}
        <div>
          <h3 className="text-xl font-bold text-[#003367] mb-5">Education</h3>

          <div className="relative h-full pl-1.5 flex">
            {/* vertical line */}
            <div className="border border-gray-300 min-h-full mt-3"></div>

            <ul className="space-y-4">
              {doctor?.educations?.map((edu) => (
                <li key={edu?._id} className="relative">
                  {/* dot — SAME AS WORK */}
                  <span className="absolute -left-[7.5px] top-2 w-[13px] h-[13px] rounded-full border-2 border-[#7CAB33] bg-[#f3fee4]"></span>

                  <div className="ml-4 space-y-1">
                    <p className="text-lg font-semibold text-[#003367]">
                      {edu?.institution}
                    </p>

                    <p className="text-[#003367]">{edu?.degree}</p>

                    <p className="text-sm text-gray-500">{edu?.year}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Work & Experience */}
        <div>
          <h3 className="text-xl font-bold text-[#003367] mb-5">
            Work & Experience
          </h3>

          <div className="relative h-full pl-1.5 flex">
            <div className="border border-gray-300 min-h-full mt-3"></div>
            <ul className="space-y-4">
              {doctor?.worksAndExperiences?.map((edu) => (
                <li key={edu?._id} className="relative">
                  <span className="absolute -left-[7.5px] top-2 w-[13px] h-[13px] rounded-full border-2 border-[#7CAB33] bg-[#f3fee4]"></span>

                  <div className="ml-4 space-y-1">
                    <p className="text-lg font-semibold text-[#003367]">
                      {edu?.workedAt}
                    </p>

                    <p className="text-[#003367]">{edu?.position}</p>

                    <p className="text-sm text-gray-500">{edu?.duration}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specializations */}
        <div>
          <h3 className="text-xl font-bold text-[#003367] mb-3">
            Specializations
          </h3>
          <>
            <div className="flex flex-col gap-1">
              {doctor?.specializations?.map((spec, idx) => (
                <div
                  key={idx}
                  className="text-blue-950 flex items-center gap-3 pl-2"
                >
                  <FaLongArrowAltRight size={20} />
                  <p>{spec}</p>
                </div>
              ))}
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default DoctorDetailsOverview;
