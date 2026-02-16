import React from "react";
import { Link } from "react-router-dom";

const LandingAbout = ({ aboutData = {}, loading = false, error = null }) => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  if (loading) {
    return (
      <section className="py-10 sm:py-16 bg-white" id="about">
        <div className="mx-auto sm:mx-20 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Skeleton Image Gallery */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                {/* First Image Skeleton */}
                <div className="md:col-span-6">
                  <div className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse"></div>
                </div>
                {/* Second Image Skeleton */}
                <div className="md:col-span-6">
                  <div className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse"></div>
                </div>
                {/* Third Image Skeleton */}
                <div className="col-span-full">
                  <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Skeleton Text Content */}
            <div className="lg:col-span-6">
              <div className="lg:pl-8">
                <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3 mb-6">
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-32 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 🟢 Actual Loaded Content
  return (
    <section className="py-10 sm:py-16 bg-white" id="about">
      <div className="mx-auto sm:mx-20 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Image Gallery Column */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              <div className="md:col-span-6">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                    src={`${STORAGE_URL}${aboutData?.image1}`}
                    alt={aboutData?.image1_alt || "About us image 1"}
                  />
                </div>
              </div>
              <div className="md:col-span-6">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                    src={`${STORAGE_URL}${aboutData?.image2}`}
                    alt={aboutData?.image2_alt || "About us image 2"}
                  />
                </div>
              </div>
              <div className="col-span-full">
                <div className="aspect-video overflow-hidden rounded-2xl">
                  <img
                    className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                    src={`${STORAGE_URL}${aboutData?.image3}`}
                    alt={aboutData?.image3_alt || "About us image 3"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-6">
            <div className="lg:pl-8 text-center md:text-start">
              <h2 className="text-3xl md:text-4xl font-bold text-[#ffba00] mb-6">
                About <span className="text-black">Us</span>
              </h2>
              <div
                className="text-gray-700 mb-6 blog-rich-text leading-relaxed line-clamp-6"
                dangerouslySetInnerHTML={{ __html: aboutData?.description }}
              />
              <Link
                to="/about"
                className="px-8 py-4 custom-btn font-medium rounded-full transition-all duration-300 hover:shadow-lg"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAbout;
