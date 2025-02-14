// Papu.jsx
import React, { useState, useEffect } from "react";
import Card from "./Card";
import AllImages from "./AllImages";
import Swal from "sweetalert2";

const images = [
  "butterfly.jpg", "cow.jpg", "football.jpg", "spin.jpg", "flower.webp",
  "diya.webp", "bucket.jpg", "kite.webp", "rat.webp",
  "umberlla.jpg", "parrot.webp", "sun.webp"
];

const allWinningImages = [
  { image: "butterfly.jpg", winningPoints: 10 },
  { image: "cow.jpg", winningPoints: 10 },
  { image: "football.jpg", winningPoints: 10 },
  { image: "spin.jpg", winningPoints: 10 },
  { image: "kite.webp", winningPoints: 10 },
  { image: "rat.webp", winningPoints: 10 },
  { image: "umberlla.jpg", winningPoints: 10 },
  { image: "diya.webp", winningPoints: 10 },
  { image: "flower.webp", winningPoints: 10 },
  { image: "bucket.jpg", winningPoints: 10 },
  { image: "parrot.webp", winningPoints: 10 },
  { image: "sun.webp", winningPoints: 10 }
];

const Papu = () => {
  const [winningPointOfUser, setWinningPointOfUser] = useState([]);
  const [highlightedImages, setHighlightedImages] = useState([]);
  const [cards, setCards] = useState([]);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(100);
  const [isScratching, setIsScratching] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [betPlaced, setBetPlaced] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      if (selectedImages.length > 0) {
        Swal.fire("Bet Accepted", "Your bet has been placed!", "success");
      }
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, selectedImages.length]);

  const initializeGame = () => {
    setCards(Array.from({ length: 36 }, (_, index) => ({
      id: index,
      scratched: false,
      revealedImage: null
    })));
    setTimer(15);
    setIsTimerActive(true);
    setSelectedImages([]);
    setBetPlaced(false);
    setCurrentCardIndex(0);
    setHighlightedImages([]);
    setWinningPointOfUser([]);
  };

  const handleFlip = (cardId) => {
    if (isScratching || !isTimerActive) return;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setCards(prev => prev.map(c => 
      c.id === cardId ? {...c, scratched: true, revealedImage: randomImage} : c
    ));
  };

  const toggleImageSelection = (image) => {
    if (!isTimerActive) return;
    setSelectedImages(prev => {
      if (prev.includes(image)) {
        return prev.filter(img => img !== image);
      } else {
        return [...prev, image];
      }
    });
  };

  const handlePlay = async () => {
    if (isScratching || !selectedImages.length || isTimerActive) return;
    
    const totalBet = betAmount * selectedImages.length;
    
    if (!betPlaced) {
      if (balance < totalBet) {
        Swal.fire("Insufficient Balance", "Add more funds!", "error");
        return;
      }
      setBalance(prev => prev - totalBet);
      setBetPlaced(true);
    }

    setIsScratching(true);

    const allScratched = cards.every(c => c.scratched);
    if (allScratched) {
      Swal.fire("Game Over", "All cards have been revealed!", "info")
        .then(() => {
          initializeGame();
          setIsTimerActive(true);
        });
      setIsScratching(false);
      return;
    }

    let nextIndex = -1;
    for (let i = 0; i < cards.length; i++) {
      const idx = (currentCardIndex + i) % cards.length;
      if (!cards[idx].scratched) {
        nextIndex = idx;
        break;
      }
    }

    if (nextIndex === -1) {
      Swal.fire("Game Over", "All cards have been revealed!", "info")
        .then(() => {
          initializeGame();
          setIsTimerActive(true);
        });
      setIsScratching(false);
      return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    setCards(prev => prev.map(c => 
      c.id === nextIndex ? {...c, scratched: true, revealedImage: randomImage} : c
    ));

    setCurrentCardIndex((nextIndex + 1) % cards.length);

    const isMatch = selectedImages.includes(randomImage);
    let totalWinnings = 0;
    if (isMatch) {
      totalWinnings = betAmount * 10;
      setBalance(prev => prev + totalWinnings);
      setWinningPointOfUser(prev => [...prev, 10]);
      setHighlightedImages(prev => [...new Set([...prev, randomImage])]);
    }

    Swal.fire({
      title: isMatch ? "🎉 You Win!" : "❌ Try Again!",
      text: isMatch ? `Won ₹${totalWinnings}!` : "No matching image found!",
      imageUrl: `/${randomImage}`,
      imageHeight: 100,
      imageAlt: 'Revealed Image',
    }).then(() => {
      setIsTimerActive(true);
      setTimer(15);
      setSelectedImages([]);
      setBetPlaced(false);
    });

    setIsScratching(false);
  };

  const totalPoints = winningPointOfUser.reduce((acc, val) => acc + val, 0);

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-900 p-4">
      <h1 className="text-3xl font-bold text-yellow-300 mb-4">
        PAPPU Playing Features
      </h1>

      <div className="w-full max-w-sm bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-6 gap-2 md:gap-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isScratched={card.scratched}
              revealedImage={card.revealedImage}
              handleFlip={() => handleFlip(card.id)}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md bg-gray-900 p-4 mt-4 rounded-lg shadow-lg text-center flex flex-col items-center gap-4">
        <div className="flex justify-around w-full">
          <div className="text-white text-lg font-bold">Balance: ₹{balance}</div>
          <div>
            <label className="text-white mr-2">Bet Amount:</label>
            <select
              className="px-4 bg-white border rounded text-black"
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value))}
            >
              <option value={10}>₹10</option>
              <option value={15}>₹15</option>
              <option value={20}>₹20</option>
              <option value={50}>₹50</option>
            </select>
          </div>
          <div className="text-white text-lg font-bold">
            Time Left: {timer}s
          </div>
        </div>
        <button 
          onClick={handlePlay}
          disabled={isScratching || selectedImages.length === 0 || isTimerActive}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScratching ? "Revealing..." : "Play"}
        </button>
      </div>

      <AllImages
        allWinningImages={allWinningImages}
        highlightedImages={highlightedImages}
        selectedImages={selectedImages}
        betAmount={betAmount}
        onImageClick={toggleImageSelection}
        isTimerActive={isTimerActive}
      />
    </div>
  );
};

export default Papu;