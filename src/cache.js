import { LRUCache } from 'lru-cache';

const options = {
  max: 10000,
  ttl: 1000 * 60 * 60 * 24,
};

let cache = global.cache;
if (!cache) {
  cache = global.cache = new LRUCache(options);
}

export default cache;
