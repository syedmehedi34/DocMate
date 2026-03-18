"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import DoctorDetailsPageHeader from "./DoctorDetailsPageHeader";
import ProfileCard from "./ProfileCard";
import DoctorDetailsOverview from "./DoctorDetailsOverview";
import Bookings from "./Bookings";

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading doctor profile...</p>
        </div>
      </div>
    );

  if (!doctor)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-gray-500">Doctor not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Header */}
      <DoctorDetailsPageHeader doctor={doctor} />

      {/* Profile Card */}
      <ProfileCard doctor={doctor} currency={currency} />

      {/* Tabs section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Tabs>
            {/* Tab header */}
            <TabList className="flex border-b border-gray-100 px-6">
              {["Overview", "Book Appointment"].map((label) => (
                <Tab
                  key={label}
                  className="relative px-6 py-4 text-sm font-semibold text-gray-400
                             cursor-pointer outline-none select-none transition-colors duration-200
                             hover:text-gray-700"
                  selectedClassName="!text-green-700 after:absolute after:bottom-0 after:left-0
                                     after:right-0 after:h-0.5 after:bg-green-600 after:rounded-full"
                >
                  {label}
                </Tab>
              ))}
            </TabList>

            {/* Overview */}
            <TabPanel>
              <div className="p-6">
                <DoctorDetailsOverview doctor={doctor} />
              </div>
            </TabPanel>

            {/* Booking */}
            <TabPanel>
              <div className="p-6">
                <Bookings doctor={doctor} currency={currency} />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default DoctorDetailsAndAppointment;
