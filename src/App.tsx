import React, { useState, useCallback, useEffect } from 'react';
import { Trophy, Heart, Lightbulb, AlertCircle } from 'lucide-react';
import { words } from './data/words';
import { shuffleWord, getRandomWord, countSyllables } from './utils/game';
import { Timer } from './components/Timer';

function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [input, setInput] = useState('');
  const [currentWord, setCurrentWord] = useState(getRandomWord(words, level));
  const [scrambledWord, setScrambledWord] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [resetTimer, setResetTimer] = useState(false);
  const [advanceLevelTrigger, setAdvanceLevelTrigger] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const startNewGame = useCallback(() => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setShowHint(false);
    setGameActive(true);
    setMessage(null);
    const newWord = getRandomWord(words, 1);
    setCurrentWord(newWord);
    setScrambledWord(shuffleWord(newWord.word));
    setInput('');
    setResetTimer((prev) => !prev);
  }, []);

  const nextLevel = useCallback(() => {
    if (level >= 20) {
      setMessage({ text: 'Chúc mừng! Bạn đã hoàn thành trò chơi! 🎉', type: 'success' });
      setGameActive(false);
      return;
    }
    const newLevel = level + 1;
    setLevel(newLevel);
    const newWord = getRandomWord(words, newLevel);
    setCurrentWord(newWord);
    setScrambledWord(shuffleWord(newWord.word));
    setInput('');
    setShowHint(false);
    setMessage(null);
    setResetTimer((prev) => !prev);
  }, [level]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase() === currentWord.word.toLowerCase()) {
      setScore(score + 10);
      setMessage({ text: 'Chính xác! +10 điểm', type: 'success' });
      setAdvanceLevelTrigger((prev) => prev + 1);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setMessage({
          text: `Game Over! Đáp án là: ${currentWord.word}`,
          type: 'error',
        });
        setGameActive(false);
      } else {
        setMessage({ text: `Sai! Còn ${newLives} lần thử.`, type: 'error' });
      }
      setInput('');
    }
  };

  // Tự động ẩn thông báo "Chính xác! +10 điểm" sau 1 giây
  useEffect(() => {
    if (message?.type === 'success' && message?.text === 'Chính xác! +10 điểm') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Xử lý chuyển màn khi advanceLevelTrigger thay đổi
  useEffect(() => {
    if (advanceLevelTrigger > 0) {
      const timer = setTimeout(() => {
        nextLevel();
        setAdvanceLevelTrigger(0);
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [advanceLevelTrigger, nextLevel]);

  const handleTimeout = () => {
    setMessage({
      text: `Hết giờ! Đáp án là: ${currentWord.word}`,
      type: 'error',
    });
    setGameActive(false);
  };

  // Hàm xử lý khi nhấn nút "Bắt đầu"
  const handleStartGame = () => {
    setGameStarted(true);
    startNewGame();
  };

  // Tính số âm tiết mặc định
  const syllableCount = gameStarted ? countSyllables(currentWord.word) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient chuyển động */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 opacity-50 animate-gradient-shift"></div>

      {/* Hiệu ứng particle (hạt trôi nổi) */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-20 animate-particle"
          style={{
            width: `${Math.random() * 8 + 5}px`,
            height: `${Math.random() * 8 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 5}s`,
          }}
        ></div>
      ))}

      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative z-10 animate-container-bounce">
        {!gameStarted ? (
          <div className="text-center relative">
            {/* Tiêu đề với hiệu ứng bounce từng ký tự */}
            <h2 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {Array.from("Ai Sẽ Là Vua Tiếng Việt Nhỉ?").map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce-char"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {char}
                </span>
              ))}
            </h2>

            {/* Dòng mô tả với hiệu ứng sparkle */}
            <div className="relative">
              <p className="text-gray-600 mb-6 animate-fade-in-delayed">
                Sẵn sàng thử thách trí tuệ của bạn chưa? Nhấn để bắt đầu!
              </p>
              {/* Hiệu ứng sparkle xung quanh dòng mô tả */}
              <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-300 rounded-full opacity-50 animate-sparkle"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-300 rounded-full opacity-50 animate-sparkle-delayed"></div>
            </div>

            {/* Nút "Bắt đầu" với hiệu ứng rotate, pulse, và glow khi hover */}
            <button
              onClick={handleStartGame}
              className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 animate-pulse-shadow animate-slight-rotate group"
            >
              Bắt đầu
              {/* Hiệu ứng glow khi hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-glow"></div>
            </button>

            {/* Hiệu ứng bong bóng trôi nổi (tăng số lượng và thêm đổi màu) */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-30 animate-float animate-color-shift"
                style={{
                  width: `${Math.random() * 40 + 20}px`,
                  height: `${Math.random() * 40 + 20}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 5 + 5}s`,
                }}
              ></div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-bold">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-lg font-bold">{lives}</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Màn {level}/20</h2>
              <Timer
                duration={30}
                onTimeout={handleTimeout}
                isActive={gameActive}
                reset={resetTimer}
              />
            </div>

            <div className="text-center mb-8">
              <div className="flex justify-center gap-1 flex-wrap mb-4">
                {Array.from(scrambledWord).map((char, index) => (
                  <div
                    key={index}
                    className={`bg-blue-100 text-blue-800 font-bold text-lg rounded-md px-2 py-1 shadow-sm ${
                      char === ' ' ? 'bg-transparent shadow-none' : ''
                    }`}
                  >
                    {char}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600 italic mb-2">
                Gợi ý mặc định: {syllableCount === 1 ? 'Từ này' : 'Cụm này'} có {syllableCount} âm tiết
              </div>
              {showHint && (
                <div className="text-sm text-gray-600 italic">
                  Gợi ý: {currentWord.hint}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập từ đúng..."
                className="flex-1 px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                disabled={!gameActive}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                disabled={!gameActive || !input.trim()} // Vô hiệu hóa nếu không có input hoặc game không active
              >
                Gửi
              </button>
            </form>

            {message && (
              <div
                className={`mb-6 p-3 rounded-lg text-center ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-4">
              {!gameActive && (
                <button
                  onClick={startNewGame}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Chơi lại
                </button>
              )}
              {gameActive && !showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  <Lightbulb className="w-5 h-5" />
                  Gợi ý
                </button>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Gõ tiếng Việt có dấu
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;