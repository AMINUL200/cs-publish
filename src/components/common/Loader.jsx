import React from 'react'

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
                {/* Main spinning element */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-300 animate-spin-slow"></div>

                {/* Secondary element for depth */}
                <div className="absolute inset-1 rounded-full border-4 border-transparent border-b-purple-500 border-l-purple-300 animate-spin-slow-reverse"></div>

                {/* Pulsing dot in center */}
                <div className="absolute inset-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse-slow"></div>
            </div>
        </div>
    )
}

export default Loader
