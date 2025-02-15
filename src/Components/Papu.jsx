import React, { useState, useEffect, useCallback } from "react";
import Card from "./Card";
import AllImages from "./AllImages";
import Swal from "sweetalert2";
import "./Papu.css";

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [betPlaced, setBetPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeGame = useCallback(() => {
    setCards(Array.from({ length: 36 }, (_, index) => ({
      id: index,
      scratched: false,
      revealedImage: null
    })));
    setTimer(15);
    setIsTimerActive(true);
    setSelectedImages([]);
    setBetPlaced(false);
    setHighlightedImages([]);
    setWinningPointOfUser([]);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const showPremiumPopup = (config) => {
    return Swal.fire({
      ...config,
      customClass: {
        popup: `${config.gradient} p-1 rounded-2xl shadow-2xl`,
        container: 'backdrop-blur-sm',
        title: 'text-white',
        htmlContainer: 'text-white'
      },
      background: 'transparent',
      showConfirmButton: false,
      timer: 2000
    });
  };

  const handlePlay = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const totalBet = betAmount * selectedImages.length;
    
    if (!betPlaced) {
      if (selectedImages.length > 0 && balance < totalBet) {
        await showPremiumPopup({
          title: '<div class="text-4xl">⚠️</div>',
          html: `<div class="space-y-2 text-center text-white">
            <div class="text-xl font-bold">Insufficient Balance!</div>
            <div class="text-sm opacity-75">Need ₹${totalBet - balance} more</div>
          </div>`,
          gradient: 'bg-gradient-to-br from-red-600 via-rose-500 to-pink-600'
        });
        setIsProcessing(false);
        return;
      }
      
      await showPremiumPopup({
        html: `<div class="space-y-4 text-center text-white">
          <div class="animate-bounce text-4xl">🎰</div>
          <div class="text-xl font-bold">₹${totalBet} Bet Placed!</div>
          <div class="text-sm opacity-75">Good Luck! 🍀</div>
        </div>`,
        gradient: 'bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-500'
      });

      if (selectedImages.length > 0) {
        setBalance(prev => prev - totalBet);
      }
      setBetPlaced(true);
    }

    const nextCard = cards.find(card => !card.scratched);
    if (!nextCard) {
      await showPremiumPopup({
        title: '<div class="text-4xl">🏁</div>',
        html: `<div class="space-y-2 text-center text-white">
          <div class="text-xl font-bold">Game Over!</div>
          <div class="text-sm opacity-75">Final Balance: ₹${balance}</div>
        </div>`,
        gradient: 'bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500'
      });
      initializeGame();
      setIsProcessing(false);
      return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    setCards(prev => prev.map(c => 
      c.id === nextCard.id ? {...c, scratched: true, revealedImage: randomImage} : c
    ));

    setTimeout(async () => {
      const isMatch = selectedImages.includes(randomImage);
      let winnings = 0;
      
      if (isMatch) {
        winnings = betAmount * 10;
        setBalance(prev => prev + winnings);
        setHighlightedImages(prev => [...new Set([...prev, randomImage])]);
        setWinningPointOfUser(prev => [...prev, 10]);
      }

      await showPremiumPopup({
        html: `<div class="space-y-4 text-center text-white">
          <div class="text-4xl">${isMatch ? '🎉' : '😢'}</div>
          <div class="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <img src="/${randomImage}" class="h-20 mx-auto rounded-lg"/>
          </div>
          <div class="text-xl font-bold">${isMatch ? 'You Won!' : 'Try Again!'}</div>
          <div class="text-sm">${isMatch ? `₹${winnings} Added!` : 'Better luck next time!'}</div>
          ${isMatch ? `<div class="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 rounded-full text-xs">
            +10 Points
          </div>` : ''}
        </div>`,
        gradient: isMatch ? 
          'bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-500' :
          'bg-gradient-to-br from-red-600 via-rose-500 to-pink-500'
      });

      setTimer(15);
      setIsTimerActive(true);
      setSelectedImages([]);
      setBetPlaced(false);
      setIsProcessing(false);
    }, 1000);
  }, [isProcessing, selectedImages, betPlaced, balance, betAmount, cards, initializeGame]);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && !isProcessing) {
      setIsTimerActive(false);
      handlePlay();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, isProcessing, handlePlay]);

  const toggleImageSelection = (image) => {
    if (!isTimerActive || isProcessing) return;
    setSelectedImages(prev => {
      if (prev.includes(image)) {
        return prev.filter(img => img !== image);
      } else {
        return [...prev, image];
      }
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-900 to-emerald-900 p-4">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 mb-8 animate-pulse">
      Pappu Game
      </h1>

      {/* Game Board */}
      <div className="w-full max-w-lg bg-gradient-to-br from-gray-800 to-gray-900 p-1 rounded-2xl shadow-2xl mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
          <div className="grid grid-cols-6 gap-2">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                isScratched={card.scratched}
                revealedImage={card.revealedImage}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 p-1 rounded-2xl shadow-2xl">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 space-y-6">
          {/* Balance & Timer */}
          <div className="flex justify-between items-center">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-bold">
              <h4>Balance</h4>
              ₹{balance}
            </div>
            <div className="flex flex-col items-center  gap-2">
              <h4  className="text-blue-400">Bet Amount</h4>
              <select
                className="bg-gradient-to-br from-gray-700 to-gray-800 px-4 py-2 rounded-lg text-blue-400 font-semibold border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={betAmount}
                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                disabled={!isTimerActive || isProcessing}
              >
                <option value={10}>₹10</option>
                <option value={15}>₹15</option>
                <option value={20}>₹20</option>
                <option value={50}>₹50</option>
              </select>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 font-bold">
              <h4>Timer </h4>
              {timer}s
            </div>
          </div>

          {/* Status Indicator */}
          <div className="text-center">
            <div className={`text-sm font-semibold ${
              isTimerActive ? 
                'text-green-400 animate-pulse' : 
                'text-rose-400'
            }`}>
              {isProcessing ? 'Processing...' : 
               isTimerActive ? 'Select Images!' : 
               'Round Ending...'}
            </div>
          </div>
        </div>
      </div>

      {/* Images Selection */}
      <AllImages
        allWinningImages={allWinningImages}
        highlightedImages={highlightedImages}
        selectedImages={selectedImages}
        betAmount={betAmount}
        onImageClick={toggleImageSelection}
        isTimerActive={isTimerActive && !isProcessing}
      />
    </div>
  );
};

export default Papu;