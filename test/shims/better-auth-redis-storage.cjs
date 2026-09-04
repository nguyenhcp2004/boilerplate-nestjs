var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/@better-auth+redis-storage@1.7.2_@better-auth+core@1.7.2_@better-auth+utils@0.4.2_@better-fet_njeiiibzy3xbqn5y57nrdamqtu/node_modules/@better-auth/redis-storage/dist/index.mjs
var dist_exports = {};
__export(dist_exports, {
  redisStorage: () => redisStorage
});
module.exports = __toCommonJS(dist_exports);
function redisStorage(config) {
  const { client, keyPrefix = "better-auth:" } = config;
  let supportsGetDel = true;
  const getAndDeleteScript = `
local value = redis.call("GET", KEYS[1])
if value ~= false then
  redis.call("DEL", KEYS[1])
end
return value
`;
  const incrementScript = `
local value = redis.call("INCR", KEYS[1])
if value == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
return value
`;
  const prefixKey = (key) => {
    return `${keyPrefix}${key}`;
  };
  const isUnknownCommandError = (error) => error instanceof Error && error.message.toLowerCase().includes("unknown command");
  const SCAN_COUNT = 100;
  const escapedPrefix = keyPrefix.replace(/[\\*?[\]]/g, "\\$&");
  async function* scanBatches() {
    let cursor = "0";
    do {
      const [nextCursor, batch] = await client.scan(cursor, "MATCH", `${escapedPrefix}*`, "COUNT", SCAN_COUNT);
      cursor = nextCursor;
      if (batch.length > 0) yield batch;
    } while (cursor !== "0");
  }
  return {
    async get(key) {
      return client.get(prefixKey(key));
    },
    async getAndDelete(key) {
      const prefixedKey = prefixKey(key);
      if (supportsGetDel) try {
        return await client.call("GETDEL", prefixedKey);
      } catch (error) {
        if (!isUnknownCommandError(error)) throw error;
        supportsGetDel = false;
      }
      return client.eval(getAndDeleteScript, 1, prefixedKey);
    },
    async increment(key, ttl) {
      if (!Number.isInteger(ttl) || ttl <= 0) throw new TypeError("Redis storage increment ttl must be a positive integer");
      const value = await client.eval(incrementScript, 1, prefixKey(key), ttl);
      return Number(value);
    },
    async set(key, value, ttl) {
      const prefixedKey = prefixKey(key);
      if (ttl !== void 0 && ttl > 0) await client.setex(prefixedKey, ttl, value);
      else await client.set(prefixedKey, value);
    },
    async delete(key) {
      await client.del(prefixKey(key));
    },
    /**
    * Lists the keys under the configured prefix, with the prefix stripped.
    *
    * Keys are enumerated with `SCAN`, a best-effort walk: it may report the
    * same key on more than one page, so the result is de-duplicated, and
    * keys added or removed while the scan runs may or may not appear. Order
    * is not guaranteed.
    */
    async listKeys() {
      const keys = /* @__PURE__ */ new Set();
      for await (const batch of scanBatches()) for (const key of batch) keys.add(key.slice(keyPrefix.length));
      return [...keys];
    },
    /**
    * Deletes keys under the configured prefix.
    *
    * **Not atomic.** Keys are enumerated with `SCAN` and deleted page by
    * page, so if Redis errors or the connection drops mid-iteration the
    * returned promise rejects *after* earlier pages have already been
    * deleted, leaving the store partially cleared. A rejection therefore
    * means "an unknown subset of keys may already be gone", not "nothing
    * changed", unlike a single blocking `DEL`, which either removes
    * everything or nothing.
    *
    * **Best-effort while the keyspace changes.** `SCAN` is a best-effort
    * enumeration: keys added or removed while the scan runs may or may not
    * be returned, and a key may be returned more than once. A resolved call
    * is therefore not proof the store is empty when other clients are
    * writing concurrently.
    *
    * `clear()` is safe to call again: it is idempotent, so callers that need
    * a fully empty store (e.g. revoking every session or rate-limit counter)
    * should retry until it resolves. An already-empty store is a no-op.
    */
    async clear() {
      for await (const batch of scanBatches()) await client.del(...batch);
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  redisStorage
});
