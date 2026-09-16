const BEST_SCORE_KEY = 'spaceQuizBestScore';

function getStorage(storageOverride) {
  if (storageOverride !== undefined) {
    return storageOverride;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  return null;
}

function readBestScore(storageOverride) {
  const storage = getStorage(storageOverride);
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(BEST_SCORE_KEY);
    if (raw === null) {
      return null;
    }

    const parsed = Number.parseInt(raw, 10);
    if (!Number.isInteger(parsed) || parsed < 0) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function updateBestScore(score, storageOverride) {
  const storage = getStorage(storageOverride);
  const bestScore = readBestScore(storage);

  if (!storage) {
    return { bestScore: null, isNewBest: false };
  }

  if (!Number.isInteger(score) || score < 0) {
    return { bestScore, isNewBest: false };
  }

  if (bestScore === null || score > bestScore) {
    try {
      storage.setItem(BEST_SCORE_KEY, String(score));
      return { bestScore: score, isNewBest: true };
    } catch {
      return { bestScore, isNewBest: false };
    }
  }

  return { bestScore, isNewBest: false };
}

const api = { BEST_SCORE_KEY, readBestScore, updateBestScore };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}

if (typeof window !== 'undefined') {
  window.bestScoreUtils = api;
}
