"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import DoctorDetailsPageHeader from "./DoctorDetailsPageHeader";
import ProfileCard from "./ProfileCard";
import DoctorDetailsOverview from "./DoctorDetailsOverview";
import Bookings from "./Bookings";
// import "react-tabs/style/react-tabs.css";

const DoctorDetailsAndAppointment = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const currency = process.env.CURRENCY || "৳";

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        setDoctor(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  console.log(doctor);
  if (loading) return <p className="text-center my-20">Loading...</p>;
  if (!doctor) return <p className="text-center my-20">Doctor not found</p>;

  return (
    <>
      {/* ================= HEADER ================= */}
      <DoctorDetailsPageHeader doctor={doctor} />

      {/* ================= Profile Card ================= */}
      <ProfileCard doctor={doctor} currency={currency} />

      {/* ================= TABS SECTION ================= */}
      <section className="max-w-6xl mx-auto my-16 bg-white rounded-2xl border  border-gray-200 px-6 py-8">
        <Tabs>
          {/* TAB HEADER */}
          <TabList className="flex justify-center gap-16 border-b border-gray-200">
            <Tab
              className="pb-4 text-lg font-extrabold text-[#003367]  cursor-pointer outline-none transition-all duration-150 w-48 text-center"
              selectedClassName="text-lime-600 text-emerald-600 border-b-2"
            >
              Overview
            </Tab>

            <Tab
              className="pb-4 text-lg font-extrabold text-[#003367]  cursor-pointer outline-none transition-all duration-150 w-48 text-center"
              selectedClassName="text-lime-600 border-b-2"
            >
              Booking
            </Tab>
          </TabList>

          {/* ================= OVERVIEW ================= */}
          <TabPanel>
            <DoctorDetailsOverview doctor={doctor} />
          </TabPanel>

          {/* ================= BOOKING ================= */}
          <TabPanel>
            <Bookings doctor={doctor} />
          </TabPanel>
        </Tabs>
      </section>
    </>
  );
};

export default DoctorDetailsAndAppointment;
