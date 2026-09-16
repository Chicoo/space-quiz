const test = require('node:test');
const assert = require('node:assert/strict');

const { BEST_SCORE_KEY, readBestScore, updateBestScore } = require('./best-score.js');

function createStorage(seed = {}) {
  const store = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    }
  };
}

test('readBestScore returns null when value does not exist', () => {
  const storage = createStorage();
  assert.equal(readBestScore(storage), null);
});

test('readBestScore returns null for invalid stored value', () => {
  const storage = createStorage({ [BEST_SCORE_KEY]: 'not-a-number' });
  assert.equal(readBestScore(storage), null);
});

test('updateBestScore stores first score as best', () => {
  const storage = createStorage();
  const result = updateBestScore(6, storage);

  assert.deepEqual(result, { bestScore: 6, isNewBest: true });
  assert.equal(readBestScore(storage), 6);
});

test('updateBestScore does not overwrite when score is lower', () => {
  const storage = createStorage({ [BEST_SCORE_KEY]: '8' });
  const result = updateBestScore(5, storage);

  assert.deepEqual(result, { bestScore: 8, isNewBest: false });
  assert.equal(readBestScore(storage), 8);
});

test('updateBestScore handles storage errors gracefully', () => {
  const storage = {
    getItem() {
      throw new Error('disabled');
    },
    setItem() {
      throw new Error('disabled');
    }
  };

  const result = updateBestScore(9, storage);
  assert.deepEqual(result, { bestScore: null, isNewBest: false });
});
