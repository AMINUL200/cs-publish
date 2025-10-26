import React from "react";
import { Link } from "react-router-dom";

const LandingAbout = ({ aboutData = {}, loading = false, error = null }) => {
    // console.log(aboutData);
    
  return (
    <section className="py-16 bg-white" id="about">
      <div className="mx-auto sm:mx-20 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Image Gallery Column */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              {/* First Image */}
              <div className="md:col-span-6">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img 
                    className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                    src={aboutData?.image1} 
                    alt={aboutData?.image1_alt || "About us image 1"} 
                  />
                </div>
              </div>
              
              {/* Second Image */}
              <div className="md:col-span-6">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img 
                    className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                    src={aboutData?.image2} 
                    alt={aboutData?.image2_alt || "About us image 2"} 
                  />
                </div>
              </div>
              
              {/* Third Image - Full Width */}
              <div className="col-span-full">
                <div className="aspect-video overflow-hidden rounded-2xl">
                  <img 
                    className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                    src={aboutData?.image3} 
                    alt={aboutData?.image3_alt || "About us image 3"} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-6">
            <div className="lg:pl-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#ffba00] mb-6">
                About <span className="text-black">Us</span>
              </h2>
              <div 
                className="text-gray-700 mb-6 blog-rich-text leading-relaxed line-clamp-6 " 
                dangerouslySetInnerHTML={{__html: aboutData?.description}} 
              />
              
              <Link to="/about" className="px-8 py-4 bg-[#ffba00] text-white font-medium rounded-full hover:bg-black transition-all duration-300 hover:shadow-lg">
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