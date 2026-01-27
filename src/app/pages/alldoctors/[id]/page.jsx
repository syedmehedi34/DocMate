"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // app router
import Image from "next/image";
import { ChevronsRight, Phone } from "lucide-react";
import Link from "next/link";
import { FaHourglassStart, FaStreetView } from "react-icons/fa";
import { IoCall } from "react-icons/io5";

const DoctorDetailsAndAppointment = () => {
  const { id } = useParams(); // id = doctor._id from URL
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const currency = process.env.CURRENCY || "৳";

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/users/${id}`); // backend e single doctor fetch
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!doctor) return <p>Doctor not found</p>;

  console.log(doctor);

  return (
    <>
      <div
        className="relative h-96 text-black mb-16 md:mb-8"
        style={{
          backgroundImage: "url('/all-doc-header-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>

        {/* header */}
        <section className="h-full relative z-10 max-w-7xl mx-auto px-4 py-10">
          <div className="h-full flex flex-col justify-center text-[#003367]">
            <h1 className="text-[55px] font-bold mb-3">
              {doctor?.name} - <br />
              <span>Booking</span>
            </h1>

            <div className="flex items-center gap-2 text-[16px] mb-14">
              <Link href="/" className="hover:font-extrabold">
                <span className="text-[#93C249] font-bold">Home</span>
              </Link>
              <ChevronsRight className="w-5 h-5 text-[#93C249]" />

              <Link href="/alldoctors" className="hover:font-extrabold">
                <span className="text-[#93C249] font-bold">All Doctors</span>
              </Link>
              <ChevronsRight className="w-5 h-5 text-[#93C249]" />

              <span className="text-[#003367] font-semibold">
                {doctor?.name} - Booking
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* doctor profile card  */}
      <section className="w-11/12 mx-auto my-20 p-5 flex justify-between border">
        {/* left portion - photo + details  */}
        <div className="flex gap-5">
          <div className="">
            <Image
              src={doctor?.doctorImageUrl || "/placeholder-doctor.jpg"}
              alt={doctor?.name}
              height={100}
              width={250}
              className="object-cover border border-black rounded-2xl"
            />
          </div>
          {/* beside image content  */}
          <div className="border">
            <h1>{doctor?.name}</h1>
            <p>{doctor?.doctorCategory}</p>
            <p>
              {doctor?.educations[0]?.degree} -{" "}
              {doctor?.educations[0]?.institution}
            </p>
            <p className="flex items-center gap-1.5">
              <FaStreetView />
              <span>{doctor?.location}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <IoCall />
              <span>{doctor?.appointmentNumber}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {doctor?.specializations.map((spec, index) => (
                <p
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                >
                  {spec}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* right portion - social links and others info */}
        <div className="border">
          <p>
            <FaHourglassStart />
            <span>
              Joined us : {doctor?.joinedHospitals[0]} -{" "}
              {doctor?.joinedHospitals[1]}
            </span>
          </p>

          <p>
            Consultation Fee: {doctor?.consultationFee}
            {currency}
          </p>

          {/* social links buttons */}
          <div></div>

          <button>Appointment Available</button>
        </div>
      </section>
    </>
  );
};

export default DoctorDetailsAndAppointment;
