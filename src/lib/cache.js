import lruCache from 'lru-cache';

const options = {
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24,
};

let cache = global.cache;
if (!cache) {
  cache = global.cache = new lruCache(options);
}

export default cache;
