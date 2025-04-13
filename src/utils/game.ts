// utils/game.ts

// Hàm xáo trộn từ (xáo trộn từng từ riêng lẻ)
export function shuffleWord(word: string): string {
  const words = word.split(' ');
  const shuffledWords = words.map((w) => {
    const arr = Array.from(w);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const shuffled = arr.join('');
    return shuffled === w ? shuffleWord(w) : shuffled;
  });
  return shuffledWords.join(' ');
}

// Hàm xác định độ khó dựa trên cấp độ
export function getDifficulty(level: number): 'easy' | 'medium' | 'hard' {
  if (level <= 7) return 'easy';
  if (level <= 14) return 'medium';
  return 'hard';
}

// Hàm lấy từ ngẫu nhiên
export function getRandomWord(words: typeof import('../data/words').words, level: number) {
  const difficulty = getDifficulty(level);
  const wordList = words[difficulty];
  const index = Math.floor(Math.random() * wordList.length);
  return wordList[index];
}

// Hàm đếm số âm tiết
export function countSyllables(word: string): number {
  const words = word.split(' ').filter((w) => w.length > 0);
  return words.length;
}