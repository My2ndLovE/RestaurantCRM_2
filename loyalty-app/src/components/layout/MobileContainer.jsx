import React from 'react';

const MobileContainer = ({ children, className = '' }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className={`w-full max-w-md bg-brand-bg min-h-screen shadow-2xl relative overflow-hidden ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default MobileContainer;
