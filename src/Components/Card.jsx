// Card.jsx
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Card = ({ card, isScratched, revealedImage, handleFlip }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || isScratched) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const initCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.fillStyle = "rgba(200, 200, 200, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    initCanvas();
  }, [isScratched]);

  const startScratching = (e) => {
    if (isScratched) return;
    isDrawing.current = true;
    scratch(e);
  };

  const scratch = (e) => {
    if (!isDrawing.current || isScratched) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    checkScratchCompletion();
  };

  const checkScratchCompletion = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }

    const totalPixels = canvas.width * canvas.height;
    if (transparentPixels / totalPixels > 0.3) {
      handleFlip();
    }
  };

  return (
    <motion.div
      className="relative aspect-square rounded-lg shadow-lg overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isScratched ? (
        <img 
          src={`/${revealedImage}`} 
          alt="card" 
          className="w-full h-full object-cover"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-gray-300"
          onMouseDown={startScratching}
          onMouseMove={scratch}
          onMouseUp={() => (isDrawing.current = false)}
          onMouseLeave={() => (isDrawing.current = false)}
        />
      )}
    </motion.div>
  );
};

export default Card;