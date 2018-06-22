import lruCache from 'lru-cache';

const options = {
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24,
};

const cache = lruCache(options);

export default cache;
