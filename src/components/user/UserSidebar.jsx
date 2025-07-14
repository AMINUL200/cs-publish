import React from 'react'
import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { recentPost4 } from '../../assets';

const UserSidebar = () => {
    return (
        <>
            <div className='bg-gray-200 border p-4'>
                <h4 className='text-center font-semibold mb-1'>CURRENT ISSUE</h4>
                <img src={recentPost4} alt="" className='mb-2 w-[100%]' />
                <Link
                    className='block text-center text-orange-400 cursor-pointer'
                >
                    {"Volume(1), Issue(1)"}
                </Link>
            </div>
            {/* Journal overview */}
            <Menu as="div" className="  mt-4">
                <Menu.Button className="w-full flex justify-between items-center px-3 py-2 text-left bg-gray-200  rounded-md hover:text-orange-400 font-medium  transition">
                    Journal Overview
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                </Menu.Button>

                <Menu.Items className="mt-2 space-y-1 border-none">
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/1"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Overview 1
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/2"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                OverView 2
                            </Link>
                        )}
                    </Menu.Item>

                </Menu.Items>
            </Menu>

            {/* Authors */}
            <Menu as="div" className="  mt-4">
                <Menu.Button className="w-full flex justify-between items-center px-3 py-2 text-left bg-gray-200  rounded-md hover:text-orange-400 font-medium  transition">
                    For Authors
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                </Menu.Button>

                <Menu.Items className="mt-2 space-y-1 border-none">
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/1"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Authors 1
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/2"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Authors 2
                            </Link>
                        )}
                    </Menu.Item>

                </Menu.Items>
            </Menu>

            {/* Reviewers Dropdown */}
            <Menu as="div" className=" mt-4">
                <Menu.Button className="w-full flex justify-between items-center px-3 py-2 text-left bg-gray-200  rounded-md hover:text-orange-400 font-medium  transition">
                    For Reviewers
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                </Menu.Button>

                <Menu.Items className="mt-2 space-y-1 border-none">
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/1"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Reviewers 1
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/2"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Reviewers 2
                            </Link>
                        )}
                    </Menu.Item>

                </Menu.Items>
            </Menu>


            {/* Editors */}
            <Menu as="div" className=" mt-4">
                <Menu.Button className="w-full flex justify-between items-center px-3 py-2 text-left bg-gray-200  rounded-md hover:text-orange-400 font-medium  transition">
                    For Editors
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                </Menu.Button>

                <Menu.Items className="mt-2 space-y-1">
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/1"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Journal 1
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/2"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Journal 2
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/3"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Journal 3
                            </Link>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>

            {/* Our Journals Dropdown */}
            <Menu as="div" className="  mt-4">
                <Menu.Button className="w-full flex justify-between items-center px-3 py-2 text-left bg-gray-200  rounded-md hover:text-orange-400 font-medium  transition">
                    Our Journals
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                </Menu.Button>

                <Menu.Items className="mt-2 space-y-1 border-none">
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/1"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Journal 1
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/2"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Journal 2
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/3"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Journal 3
                            </Link>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>

            <div className='flex flex-col gap-4 text-center mt-4'>
                <Link
                    className='bg-[#293c4f] py-4 hover:bg-orange-400 cursor-pointer text-white rounded-2xl transition-all duration-300'
                >
                    SUBMIT MANUSCRIPT
                </Link>
                <Link
                    className='bg-orange-400 py-4 hover:bg-[#293c4f] cursor-pointer text-white rounded-2xl transition-all duration-300'
                >
                    SUBMIT MANUSCRIPT
                </Link>
            </div>
            {/* Archives */}
            <Menu as="div" className="  mt-4">
                <Menu.Button className="w-full flex justify-between items-center px-3 py-2 text-left bg-gray-200  rounded-md hover:text-orange-400 font-medium  transition">
                    Archives
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                </Menu.Button>

                <Menu.Items className="mt-2 space-y-1 ">
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/1"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Archive 1
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/journal/2"
                                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-gray-300 text-orange-600' : 'text-orange-400'
                                    }`}
                            >
                                Archive 2
                            </Link>
                        )}
                    </Menu.Item>

                </Menu.Items>
            </Menu>

        </>
    )
}

export default UserSidebar
