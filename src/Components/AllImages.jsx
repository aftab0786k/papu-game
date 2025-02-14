// AllImages.jsx
import React from "react";
import Swal from "sweetalert2";

const AllImages = ({ allWinningImages = [], highlightedImages = [], selectedImages = [], betAmount = 10, onImageClick, isTimerActive }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 border-2 border-white mt-4 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex gap-2 flex-wrap">
        {allWinningImages.map(({ image }, index) => (
          <div
            key={index}
            className={`border-4 rounded cursor-pointer relative ${
              highlightedImages.includes(image) ? "border-yellow-500" : "border-transparent"
            } ${selectedImages.includes(image) ? "border-blue-500" : ""}`}
            onClick={() => {
              if (isTimerActive) {
                onImageClick(image);
              } else {
                // Swal.fire("Disabled", "Cannot select images after timer has ended.", "error");
              }
            }}
            style={{
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedImages.includes(image) && (
              <div 
                className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded"
                style={{ zIndex: 2 }}
              >
                ₹{betAmount}
              </div>
            )}
            <img
              src={`/${image}`}
              alt="Winning Card"
              className="w-full h-full object-cover rounded"
              style={{ 
                maxWidth: "100%", 
                maxHeight: "100%",
                filter: !isTimerActive ? "grayscale(100%)" : "none",
                opacity: !isTimerActive ? 0.8 : 1,
                cursor: !isTimerActive ? "not-allowed" : "pointer",
                
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllImages;