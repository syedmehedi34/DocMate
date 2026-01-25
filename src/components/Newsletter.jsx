"use client";

import Image from "next/image";
import { Parallax } from "react-parallax";

const Newsletter = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log(e.target.email.value);

    // reset value
    e.target.email.value = "";
  };

  return (
    <Parallax
      blur={{ min: -50, max: 50 }}
      bgImage="https://i.ibb.co/qYkBsgdW/three.jpg"
      bgImageAlt="background image"
      strength={-200}
    >
      <div className="hero-overlay h-[250px] md:h-[300px] bg-opacity-70 bg-cover bg-center bg-no-repeat backdrop-blur-xs text-white flex flex-col items-center justify-center">
        <div className="relative max-w-7xl mx-auto py-8 px-3 md:py-16 md:px-6 text-center">
          <Image
            src="/assets/docmate.png"
            alt="logo"
            width={170}
            height={56}
            className="mx-auto"
          />
          <p className="my-1 text-xs md:text-base max-w-3xl mx-auto text-center">
            Your trusted consultancy for expert medical advice and healthcare
            solutions.
          </p>

          <form onSubmit={handleSubscribe} className="join mt-4">
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="input input-bordered join-item text-black font-semibold"
            />
            <button
              type="submit"
              className="btn shadow-none bg-teal-500 border-none hover:bg-teal-700 join-item"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </Parallax>
  );
};

export default Newsletter;
