import React from 'react'
import { aboutImg } from '../../assets';

const LandingAbout = () => {
  return (
    <section className="py-16 bg-white" id='about'>
                <div className="mx-auto sm:mx-20  px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* First Column (6 columns on large screens) */}
                        <div className="lg:col-span-6">
    
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* First div - full width on small, 6 columns on medium+ */}
                                <div className="md:col-span-6">
                                    <img className='rounded-2xl' src={aboutImg} alt="" />
                                </div>
                                {/* Second div - full width on small, 6 columns on medium+ */}
                                <div className="md:col-span-6">
                                    <img className='rounded-2xl' src={aboutImg} alt="" />
                                </div>
                                {/* Third div - full width on all screens */}
                                <div className="col-span-full">
                                    <img className='rounded-2xl' src={aboutImg} alt="" />
                                </div>
                            </div>
                        </div>
    
                        {/* Second Column (6 columns on large screens) - Image container */}
                        <div className="lg:col-span-6">
                            <div className="">
                                <h2 className="text-3xl md:text-4xl font-bold text-[#ffba00] mb-6">
                                    About <span className='text-black'>Us</span> 
                                </h2>
                                <p className="text-gray-700 mb-6">
                                    Gavin Publishers is an international scientific peer reviewed clinical and medical journal publishers.
                                </p>
                                <p className="text-gray-700 mb-6">
                                    We are best open access journal article publishers of research, review, mini review, case report,
                                    case series, editorial, short communication, opinion, perspective, rapid communication,
                                    commentary, and brief report peer reviewed articles.
                                </p>
                                <p className="text-gray-700 mb-6">
                                    All our journals are Double Blind Peer Reviewed Journals and our website have more than
                                    10 Million readers, all papers publishing in our Journals are globally accepted.
                                    Our conferences have more.
                                </p>
                                <button className="px-8 py-4 bg-[#ffba00] text-white font-medium cursor-pointer rounded-full hover:bg-black transition-all duration-300">
                                    Read More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
  )
}

export default LandingAbout
