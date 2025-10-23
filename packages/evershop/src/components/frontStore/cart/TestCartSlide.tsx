/**
 * Test Cart Slide Component
 * 
 * Instructions:
 * 1. Import this component in a test page
 * 2. Click the buttons to test cart drawer
 * 3. Verify animations work correctly
 */

import React, { useState } from 'react';

export function TestCartSlide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Cart Slide Animation</h1>
      
      <div className="space-y-4">
        <button
          onClick={handleOpen}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Open Cart Drawer
        </button>

        <button
          onClick={handleClose}
          className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700"
        >
          Close Cart Drawer
        </button>

        <div className="text-sm text-gray-600">
          <p>isOpen: {isOpen ? 'true' : 'false'}</p>
          <p>isAnimating: {isAnimating ? 'true' : 'false'}</p>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
              isAnimating ? 'opacity-50' : 'opacity-0'
            }`}
            onClick={handleClose}
            aria-label="Close cart overlay"
          />

          {/* Cart Drawer */}
          <div
            className={`fixed top-0 bottom-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              isAnimating ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Test Cart Drawer</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  If you can see this drawer sliding from right to left, the animation is working!
                </p>
                
                <div className="bg-green-100 p-4 rounded-md">
                  <p className="text-green-800 font-semibold">✓ Animation Working</p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
                >
                  Close Cart
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
