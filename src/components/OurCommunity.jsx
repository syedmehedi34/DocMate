"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

const OurCommunity = () => {
  // Image data array to keep code clean
  const images = [
    {
      src: "https://i.ibb.co.com/cK3xXQS4/two.png",
      alt: "Marathon Achiever 1",
    },
    {
      src: "https://i.ibb.co.com/NdBtxRjy/three.png",
      alt: "Marathon Achiever 2",
    },
    {
      src: "https://i.ibb.co.com/0pmZP6Nm/ten.jpg",
      alt: "Marathon Achiever 3",
    },
    {
      src: "https://i.ibb.co.com/VWLm75vm/six.png",
      alt: "Marathon Achiever 4",
    },
    {
      src: "https://i.ibb.co.com/dwkC100s/seven.png",
      alt: "Marathon Achiever 5",
    },
    {
      src: "https://i.ibb.co.com/JRSDSWkq/one.jpg",
      alt: "Marathon Achiever 6",
    },
    {
      src: "https://i.ibb.co.com/v6pVWBvK/nine.jpg",
      alt: "Marathon Achiever 7",
    },
    {
      src: "https://i.ibb.co.com/fGCqgf8H/five.png",
      alt: "Marathon Achiever 8",
    },
    {
      src: "https://i.ibb.co.com/N64VtvyN/eight.jpg",
      alt: "Marathon Achiever 9",
    },
    {
      src: "https://i.ibb.co.com/x8cvsHWQ/four.jpg",
      alt: "Marathon Achiever 10",
    },
  ];

  return (
    <div className="max-w-screen-xl md:mx-auto my-16 mx-4">
      {/* Header */}
      <h1 className="text-center text-2xl md:text-4xl font-bold text-[#34495E] mb-12">
        Our Community
      </h1>

      {/* Marquee Content */}
      <div className="flex items-center overflow-hidden">
        <Marquee className="cursor-pointer">
          {images.map((img, index) => (
            <div
              key={index}
              className="h-16 md:h-28 w-32 md:w-40 mr-5 flex-shrink-0 relative"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain rounded-lg shadow-lg"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default OurCommunity;
