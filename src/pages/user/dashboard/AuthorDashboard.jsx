import React from 'react';

import {  submitManuscript } from '../../../assets';
import { Link } from 'react-router-dom';

import UserSidebar from '../../../components/user/UserSidebar';

const AuthorDashboard = () => {
    // Mock data - replace with your actual data
    const stats = {
        underReview: 0,
        rejected: 0,
        galleyProof: 0,
        accepted: 1,
        published: 0
    };

    return (
        <>
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-gray-800">Author Dashboard</h1>
            </div>
            <div className="flex min-h-screen  gap-4 flex-col lg:flex-row">

               

                {/* Main Content */}
                <div className="flex-1 p-8 border bg-gray-50">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Welcome to Online Manuscript Submission System</h1>
                        <div className='w-40 h-1 bg-amber-600 mx-auto mb-2 rounded '></div>
                        <p className="text-gray-600 mb-4">
                            In order to streamline manuscript submissions and serve you better, we utilize online manuscript submission system.
                            Every submitted manuscript is assigned a unique ID, which you can use to track the progress and responses online.
                            For your reference we provide complete archives and history of all your submissions.
                            A valid email address and mobile contact number are required to submit a manuscript.
                        </p>
                        <div className="border-t border-gray-200 my-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Submit Manuscript Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <Link
                            to='/confirmation/new-paper'
                                className='flex justify-around items-center gap-4 cursor-pointer'
                            >
                                <div className=''>
                                    <img src={submitManuscript} alt="" />

                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    Submitted Manuscripts
                                </h2>
                            </Link>
                        </div>

                        {/* View Manuscripts Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <Link
                                className='flex justify-around items-center gap-4 cursor-pointer'
                            >
                                <div className=''>
                                    <img src={submitManuscript} alt="" />

                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    View Submitted Manuscripts ({stats.underReview + stats.accepted + stats.published})
                                </h2>
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <Link
                                className='flex justify-around items-center gap-4 cursor-pointer'
                            >
                                <div className=''>
                                    <img src={submitManuscript} alt="" />

                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    View Under Reviewing Manuscripts ({stats.underReview + stats.accepted + stats.published})
                                </h2>
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <Link
                                className='flex justify-around items-center gap-4 cursor-pointer'
                            >
                                <div className=''>
                                    <img src={submitManuscript} alt="" />

                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    View Under Revision Manuscripts ({stats.underReview + stats.accepted + stats.published})
                                </h2>
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <Link
                                className='flex justify-around items-center gap-4 cursor-pointer'
                            >
                                <div className=''>
                                    <img src={submitManuscript} alt="" />

                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    View Rejected Manuscripts ({stats.underReview + stats.accepted + stats.published})
                                </h2>
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <Link
                                className='flex justify-around items-center gap-4 cursor-pointer'
                            >
                                <div className=''>
                                    <img src={submitManuscript} alt="" />

                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    View Under Accepted Manuscripts ({stats.underReview + stats.accepted + stats.published})
                                </h2>
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <Link
                                className='flex justify-around items-center gap-4 cursor-pointer'
                            >
                                <div className=''>
                                    <img src={submitManuscript} alt="" />

                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    View Gallery Proof Manuscripts ({stats.underReview + stats.accepted + stats.published})
                                </h2>
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <Link
                                className='flex justify-around items-center gap-4 cursor-pointer'
                            >
                                <div className=''>
                                    <img src={submitManuscript} alt="" />

                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    View Published  Manuscripts ({stats.underReview + stats.accepted + stats.published})
                                </h2>
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <Link
                                className='flex justify-around items-center gap-4 cursor-pointer'
                            >
                                <div className=''>
                                    <img src={submitManuscript} alt="" />

                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    Check Manuscripts ({stats.underReview + stats.accepted + stats.published})
                                </h2>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthorDashboard;