import React from 'react';

const Spin = () => {
    return (
        <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <span className="mt-2 text-gray-700 text-sm block">Loading...</span>
        </div>
    );
};

export default Spin;