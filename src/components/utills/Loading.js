import React from 'react';

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                <p className="text-lg font-semibold text-gray-700">Authenticating, please wait...</p>
            </div>
        </div>

    );
};

export default Loading;