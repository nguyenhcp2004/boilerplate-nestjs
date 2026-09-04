var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/@thallesp+nestjs-better-auth@2.7.0_@nestjs+common@11.2.3_class-transformer@0.5.1_class-valida_uryg5xjjedp4t5fryusoghtgem/node_modules/@thallesp/nestjs-better-auth/dist/index.mjs
var dist_exports = {};
__export(dist_exports, {
  AFTER_DATABASE_HOOK_KEY: () => AFTER_DATABASE_HOOK_KEY,
  AFTER_HOOK_KEY: () => AFTER_HOOK_KEY,
  AUTH_MODULE_OPTIONS_KEY: () => AUTH_MODULE_OPTIONS_KEY,
  AfterCreate: () => AfterCreate,
  AfterDelete: () => AfterDelete,
  AfterHook: () => AfterHook,
  AfterUpdate: () => AfterUpdate,
  AllowAnonymous: () => AllowAnonymous,
  AuthGuard: () => AuthGuard,
  AuthModule: () => AuthModule,
  AuthService: () => AuthService,
  BEFORE_DATABASE_HOOK_KEY: () => BEFORE_DATABASE_HOOK_KEY,
  BEFORE_HOOK_KEY: () => BEFORE_HOOK_KEY,
  BeforeCreate: () => BeforeCreate,
  BeforeDelete: () => BeforeDelete,
  BeforeHook: () => BeforeHook,
  BeforeUpdate: () => BeforeUpdate,
  DATABASE_HOOK_KEY: () => DATABASE_HOOK_KEY,
  DatabaseHook: () => DatabaseHook,
  HOOK_KEY: () => HOOK_KEY,
  Hook: () => Hook,
  MemberHasPermission: () => MemberHasPermission,
  Optional: () => Optional,
  OptionalAuth: () => OptionalAuth,
  OrgRoles: () => OrgRoles,
  Public: () => Public,
  RequireActiveOrg: () => RequireActiveOrg,
  Roles: () => Roles,
  Session: () => Session,
  UserHasPermission: () => UserHasPermission
});
module.exports = __toCommonJS(dist_exports);
var import_common = require("@nestjs/common");
var import_core = require("@nestjs/core");

// node_modules/.pnpm/set-cookie-parser@3.1.2/node_modules/set-cookie-parser/lib/set-cookie.js
var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false,
  split: "auto"
  // auto = split strings but not arrays
};
function isForbiddenKey(key) {
  return typeof key !== "string" || key in {};
}
function createNullObj() {
  return /* @__PURE__ */ Object.create(null);
}
function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValuePairStr = parts.shift();
  if (!nameValuePairStr) {
    return null;
  }
  var parsed = parseNameValuePair(nameValuePairStr);
  var name = parsed.name;
  var value = parsed.value;
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  if (isForbiddenKey(name)) {
    return null;
  }
  try {
    value = options.decodeValues ? decodeURIComponent(value) : value;
  } catch (e) {
    console.error(
      "set-cookie-parser: failed to decode cookie value. Set options.decodeValues=false to disable decoding.",
      e
    );
  }
  var cookie = createNullObj();
  cookie.name = name;
  cookie.value = value;
  parts.forEach(function(part) {
    var sides = part.split("=");
    var key = sides.shift().trim().toLowerCase();
    if (isForbiddenKey(key)) {
      return;
    }
    var value2 = sides.join("=").trim();
    if (key === "expires") {
      cookie.expires = new Date(value2);
    } else if (key === "max-age") {
      var n = parseInt(value2, 10);
      if (!Number.isNaN(n)) cookie.maxAge = n;
    } else if (key === "secure") {
      cookie.secure = true;
    } else if (key === "httponly") {
      cookie.httpOnly = true;
    } else if (key === "samesite") {
      cookie.sameSite = value2;
    } else if (key === "partitioned") {
      cookie.partitioned = true;
    } else if (key) {
      cookie[key] = value2;
    }
  });
  return cookie;
}
function parseNameValuePair(nameValuePairStr) {
  var name = "";
  var value = "";
  var nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}
function parseSetCookie(input, options) {
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  if (!input) {
    if (!options.map) {
      return [];
    } else {
      return createNullObj();
    }
  }
  if (input.headers) {
    if (typeof input.headers.getSetCookie === "function") {
      input = input.headers.getSetCookie();
    } else if (input.headers["set-cookie"]) {
      input = input.headers["set-cookie"];
    } else {
      var sch = input.headers[Object.keys(input.headers).find(function(key) {
        return key.toLowerCase() === "set-cookie";
      })];
      if (!sch && input.headers.cookie && !options.silent) {
        console.warn(
          "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
        );
      }
      input = sch;
    }
  }
  var split = options.split;
  var isArray = Array.isArray(input);
  if (split === "auto") {
    split = !isArray;
  }
  if (!isArray) {
    input = [input];
  }
  input = input.filter(isNonEmptyString);
  if (split) {
    input = input.map(splitCookiesString).flat();
  }
  if (!options.map) {
    return input.map(function(str) {
      return parseString(str, options);
    }).filter(Boolean);
  } else {
    var cookies = createNullObj();
    return input.reduce(function(cookies2, str) {
      var cookie = parseString(str, options);
      if (cookie && !isForbiddenKey(cookie.name)) {
        cookies2[cookie.name] = cookie;
      }
      return cookies2;
    }, cookies);
  }
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
parseSetCookie.parseSetCookie = parseSetCookie;
parseSetCookie.parse = parseSetCookie;
parseSetCookie.parseString = parseString;
parseSetCookie.splitCookiesString = splitCookiesString;

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/adapters/node/request.mjs
var getFirstHeaderValue = (header) => {
  if (Array.isArray(header)) return header[0];
  return header;
};
var hasFormUrlEncodedContentType = (headers) => {
  const contentType = getFirstHeaderValue(headers["content-type"]);
  if (!contentType) return false;
  return contentType.toLowerCase().startsWith("application/x-www-form-urlencoded");
};
var isPlainObject = (value) => {
  if (typeof value !== "object" || value === null) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};
var appendFormValue = (params, key, value) => {
  if (value === void 0) return;
  if (Array.isArray(value)) {
    for (const item of value) appendFormValue(params, key, item);
    return;
  }
  if (value === null) {
    params.append(key, "");
    return;
  }
  if (isPlainObject(value)) {
    params.append(key, JSON.stringify(value));
    return;
  }
  params.append(key, `${value}`);
};
var toFormUrlEncodedBody = (body) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(body)) appendFormValue(params, key, value);
  return params.toString();
};
var canReadRawBody = (request) => {
  return !request.destroyed && request.readableEnded !== true && request.readable;
};
var serializeParsedBody = (parsedBody, isFormUrlEncoded) => {
  if (typeof parsedBody === "string") return parsedBody;
  if (parsedBody instanceof URLSearchParams) return parsedBody.toString();
  if (isFormUrlEncoded && isPlainObject(parsedBody)) return toFormUrlEncodedBody(parsedBody);
  return JSON.stringify(parsedBody);
};
function get_raw_body(req, body_size_limit) {
  const h = req.headers;
  if (!h["content-type"]) return null;
  const content_length = Number(h["content-length"]);
  if (req.httpVersionMajor === 1 && isNaN(content_length) && h["transfer-encoding"] == null || content_length === 0) return null;
  let length = content_length;
  if (body_size_limit) {
    if (!length) length = body_size_limit;
    else if (length > body_size_limit) throw Error(`Received content-length of ${length}, but only accept up to ${body_size_limit} bytes.`);
  }
  if (req.destroyed) {
    const readable = new ReadableStream();
    readable.cancel();
    return readable;
  }
  let size = 0;
  let cancelled = false;
  return new ReadableStream({
    start(controller) {
      req.on("error", (error) => {
        cancelled = true;
        controller.error(error);
      });
      req.on("end", () => {
        if (cancelled) return;
        controller.close();
      });
      req.on("data", (chunk) => {
        if (cancelled) return;
        size += chunk.length;
        if (size > length) {
          cancelled = true;
          controller.error(/* @__PURE__ */ new Error(`request body size exceeded ${content_length ? "'content-length'" : "BODY_SIZE_LIMIT"} of ${length}`));
          return;
        }
        controller.enqueue(chunk);
        if (controller.desiredSize === null || controller.desiredSize <= 0) req.pause();
      });
    },
    pull() {
      req.resume();
    },
    cancel(reason) {
      cancelled = true;
      req.destroy(reason);
    }
  });
}
function constructRelativeUrl(req) {
  const baseUrl = req.baseUrl;
  const originalUrl = req.originalUrl;
  if (!baseUrl || !originalUrl) return baseUrl ? baseUrl + req.url : req.url;
  if (baseUrl + req.url === originalUrl) return baseUrl + req.url;
  return originalUrl.split("?")[0].at(-1) === "/" ? baseUrl + req.url : baseUrl;
}
function getRequest({ request, base, bodySizeLimit }) {
  const maybeConsumedReq = request;
  const isFormUrlEncoded = hasFormUrlEncodedContentType(request.headers);
  let body = void 0;
  const method = request.method;
  if (method !== "GET" && method !== "HEAD") {
    if (canReadRawBody(request)) body = get_raw_body(request, bodySizeLimit);
    else if (maybeConsumedReq.body !== void 0) {
      const parsedBody = maybeConsumedReq.body;
      const bodyContent = serializeParsedBody(parsedBody, isFormUrlEncoded);
      body = new ReadableStream({ start(controller) {
        controller.enqueue(new TextEncoder().encode(bodyContent));
        controller.close();
      } });
    }
  }
  return new Request(base + constructRelativeUrl(request), {
    duplex: "half",
    method: request.method,
    body,
    headers: request.headers
  });
}
async function setResponse(res, response) {
  for (const [key, value] of response.headers) try {
    res.setHeader(key, key === "set-cookie" ? splitCookiesString(response.headers.get(key)) : value);
  } catch (error) {
    res.getHeaderNames().forEach((name) => res.removeHeader(name));
    res.writeHead(500).end(String(error));
    return;
  }
  res.statusCode = response.status;
  res.writeHead(response.status);
  if (!response.body) {
    res.end();
    return;
  }
  if (response.body.locked) {
    res.end("Fatal error: Response body is locked. This can happen when the response was already read (for example through 'response.json()' or 'response.text()').");
    return;
  }
  const reader = response.body.getReader();
  if (res.destroyed) {
    reader.cancel();
    return;
  }
  const cancel = (error) => {
    res.off("close", cancel);
    res.off("error", cancel);
    reader.cancel(error).catch(() => {
    });
    if (error) res.destroy(error);
  };
  res.on("close", cancel);
  res.on("error", cancel);
  next();
  async function next() {
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!res.write(value)) if (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT) continue;
        else {
          res.once("drain", next);
          return;
        }
      }
      res.end();
    } catch (error) {
      cancel(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/node.mjs
function toNodeHandler(handler) {
  return async (req, res) => {
    return setResponse(res, await handler(getRequest({
      base: `${req.headers["x-forwarded-proto"] || (req.socket.encrypted ? "https" : "http")}://${req.headers[":authority"] || req.headers.host}`,
      request: req
    })));
  };
}

// node_modules/.pnpm/better-auth@1.7.2_pg@8.15.5_vue@3.5.13_typescript@5.9.3_/node_modules/better-auth/dist/integrations/node.mjs
var toNodeHandler2 = (auth) => {
  return "handler" in auth ? toNodeHandler(auth.handler) : toNodeHandler(auth);
};
function fromNodeHeaders(nodeHeaders) {
  const webHeaders = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) if (value !== void 0) if (Array.isArray(value)) value.forEach((v) => webHeaders.append(key, v));
  else webHeaders.set(key, value);
  return webHeaders;
}

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/error.mjs
function isErrorStackTraceLimitWritable() {
  const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  if (desc === void 0) return Object.isExtensible(Error);
  return Object.prototype.hasOwnProperty.call(desc, "writable") ? desc.writable : desc.set !== void 0;
}
function hideInternalStackFrames(stack) {
  const lines = stack.split("\n    at ");
  if (lines.length <= 1) return stack;
  lines.splice(1, 1);
  return lines.join("\n    at ");
}
function makeErrorForHideStackFrame(Base, clazz) {
  class HideStackFramesError extends Base {
    #hiddenStack;
    constructor(...args) {
      if (isErrorStackTraceLimitWritable()) {
        const limit = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        super(...args);
        Error.stackTraceLimit = limit;
      } else super(...args);
      const stack = (/* @__PURE__ */ new Error()).stack;
      if (stack) this.#hiddenStack = hideInternalStackFrames(stack.replace(/^Error/, this.name));
    }
    get errorStack() {
      return this.#hiddenStack;
    }
  }
  Object.defineProperty(HideStackFramesError.prototype, "constructor", {
    get() {
      return clazz;
    },
    enumerable: false,
    configurable: true
  });
  return HideStackFramesError;
}
var statusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  "I'M_A_TEAPOT": 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
var InternalAPIError = class extends Error {
  status;
  body;
  headers;
  statusCode;
  constructor(status = "INTERNAL_SERVER_ERROR", body = void 0, headers = {}, statusCode = typeof status === "number" ? status : statusCodes[status]) {
    super(body?.message, body?.cause ? { cause: body.cause } : void 0);
    this.status = status;
    this.body = body;
    this.headers = headers;
    this.statusCode = statusCode;
    this.name = "APIError";
    this.status = status;
    this.headers = headers;
    this.statusCode = statusCode;
    this.body = body;
  }
};
var ValidationError = class extends InternalAPIError {
  message;
  issues;
  constructor(message, issues) {
    super(400, {
      message,
      code: "VALIDATION_ERROR"
    });
    this.message = message;
    this.issues = issues;
    this.issues = issues;
  }
};
var BetterCallError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "BetterCallError";
  }
};
var kAPIErrorHeaderSymbol = Symbol.for("better-call:api-error-headers");
var APIError = makeErrorForHideStackFrame(InternalAPIError, Error);

// node_modules/.pnpm/@better-auth+core@1.7.2_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call@1.4.0__up5s5gwwz76rpygc6g3ppb6mca/node_modules/@better-auth/core/dist/error/index.mjs
var APIError2 = class APIError3 extends APIError {
  constructor(...args) {
    super(...args);
  }
  static fromStatus(status, body) {
    return new APIError3(status, body);
  }
  static from(status, error) {
    return new APIError3(status, {
      message: error.message,
      code: error.code
    });
  }
};

// node_modules/.pnpm/@better-auth+utils@0.5.0/node_modules/@better-auth/utils/dist/index.mjs
function getWebcryptoSubtle() {
  const cr = typeof globalThis !== "undefined" && globalThis.crypto;
  if (cr && typeof cr.subtle === "object" && cr.subtle != null) return cr.subtle;
  throw new Error("crypto.subtle must be defined");
}

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/crypto.mjs
var algorithm = {
  name: "HMAC",
  hash: "SHA-256"
};
var getCryptoKey = async (secret) => {
  const secretBuf = typeof secret === "string" ? new TextEncoder().encode(secret) : secret;
  return await getWebcryptoSubtle().importKey("raw", secretBuf, algorithm, false, ["sign", "verify"]);
};
var verifySignature = async (base64Signature, value, secret) => {
  try {
    const signatureBinStr = atob(base64Signature);
    const signature = new Uint8Array(signatureBinStr.length);
    for (let i = 0, len = signatureBinStr.length; i < len; i++) signature[i] = signatureBinStr.charCodeAt(i);
    return await getWebcryptoSubtle().verify(algorithm, secret, signature, new TextEncoder().encode(value));
  } catch {
    return false;
  }
};
var makeSignature = async (value, secret) => {
  const key = await getCryptoKey(secret);
  const signature = await getWebcryptoSubtle().sign(algorithm.name, key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};
var signCookieValue = async (value, secret) => {
  const signature = await makeSignature(value, secret);
  value = `${value}.${signature}`;
  value = encodeURIComponent(value);
  return value;
};

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/utils.mjs
function isAPIError(error) {
  return error instanceof APIError || error?.name === "APIError";
}
function tryDecode(str) {
  try {
    return str.includes("%") ? decodeURIComponent(str) : str;
  } catch {
    return str;
  }
}
async function tryCatch(promise) {
  try {
    return {
      data: await promise,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error
    };
  }
}
function isRequest(obj) {
  return obj instanceof Request || Object.prototype.toString.call(obj) === "[object Request]";
}

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/cookies.mjs
var getCookieKey = (key, prefix) => {
  let finalKey = key;
  if (prefix) if (prefix === "secure") finalKey = "__Secure-" + key;
  else if (prefix === "host") finalKey = "__Host-" + key;
  else return;
  return finalKey;
};
function parseCookies(str) {
  if (typeof str !== "string") throw new TypeError("argument str must be a string");
  const cookies = /* @__PURE__ */ new Map();
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) break;
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) endIdx = str.length;
    else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (!cookies.has(key)) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) val = val.slice(1, -1);
      cookies.set(key, tryDecode(val));
    }
    index = endIdx + 1;
  }
  return cookies;
}
var _serialize = (key, value, opt = {}) => {
  let cookie;
  if (opt?.prefix === "secure") cookie = `${`__Secure-${key}`}=${value}`;
  else if (opt?.prefix === "host") cookie = `${`__Host-${key}`}=${value}`;
  else cookie = `${key}=${value}`;
  if (key.startsWith("__Secure-") && !opt.secure) opt.secure = true;
  if (key.startsWith("__Host-")) {
    if (!opt.secure) opt.secure = true;
    if (opt.path !== "/") opt.path = "/";
    if (opt.domain) opt.domain = void 0;
  }
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    if (opt.maxAge > 3456e4) throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");
    cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
  }
  if (opt.domain && opt.prefix !== "host") cookie += `; Domain=${opt.domain}`;
  if (opt.path) cookie += `; Path=${opt.path}`;
  if (opt.expires) {
    if (opt.expires.getTime() - Date.now() > 3456e7) throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) cookie += "; HttpOnly";
  if (opt.secure) cookie += "; Secure";
  if (opt.sameSite) cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
  if (opt.partitioned) {
    if (!opt.secure) opt.secure = true;
    cookie += "; Partitioned";
  }
  return cookie;
};
var serializeCookie = (key, value, opt) => {
  value = encodeURIComponent(value);
  return _serialize(key, value, opt);
};
var serializeSignedCookie = async (key, value, secret, opt) => {
  value = await signCookieValue(value, secret);
  return _serialize(key, value, opt);
};

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/validator.mjs
async function runValidation(options, context = {}) {
  const request = {
    body: context.body,
    query: context.query
  };
  if (options.body) {
    const result = await options.body["~standard"].validate(context.body);
    if (result.issues) return {
      data: null,
      error: fromError(result.issues, "body")
    };
    request.body = result.value;
  }
  if (options.query) {
    const result = await options.query["~standard"].validate(context.query);
    if (result.issues) return {
      data: null,
      error: fromError(result.issues, "query")
    };
    request.query = result.value;
  }
  if (options.requireHeaders && !context.headers) return {
    data: null,
    error: {
      message: "Headers is required",
      issues: []
    }
  };
  if (options.requireRequest && !context.request) return {
    data: null,
    error: {
      message: "Request is required",
      issues: []
    }
  };
  return {
    data: request,
    error: null
  };
}
function fromError(error, validating) {
  return {
    message: error.map((e) => {
      return `[${e.path?.length ? `${validating}.` + e.path.map((x) => typeof x === "object" ? x.key : x).join(".") : validating}] ${e.message}`;
    }).join("; "),
    issues: error
  };
}

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/context.mjs
var createInternalContext = async (context, { options, path }) => {
  const headers = new Headers();
  let responseStatus = void 0;
  const { data, error } = await runValidation(options, context);
  if (error) throw new ValidationError(error.message, error.issues);
  const requestHeaders = "headers" in context ? context.headers instanceof Headers ? context.headers : new Headers(context.headers) : "request" in context && isRequest(context.request) ? context.request.headers : null;
  const requestCookies = requestHeaders?.get("cookie");
  const parsedCookies = requestCookies ? parseCookies(requestCookies) : void 0;
  const internalContext = {
    ...context,
    body: data.body,
    query: data.query,
    path: context.path || path || "virtual:",
    context: "context" in context && context.context ? context.context : {},
    returned: void 0,
    headers: context?.headers,
    request: context?.request,
    params: "params" in context ? context.params : void 0,
    method: context.method ?? (Array.isArray(options.method) ? options.method[0] : options.method === "*" ? "GET" : options.method),
    setHeader: (key, value) => {
      headers.set(key, value);
    },
    getHeader: (key) => {
      if (!requestHeaders) return null;
      return requestHeaders.get(key);
    },
    getCookie: (key, prefix) => {
      const finalKey = getCookieKey(key, prefix);
      if (!finalKey) return null;
      return parsedCookies?.get(finalKey) || null;
    },
    getSignedCookie: async (key, secret, prefix) => {
      const finalKey = getCookieKey(key, prefix);
      if (!finalKey) return null;
      const value = parsedCookies?.get(finalKey);
      if (!value) return null;
      const signatureStartPos = value.lastIndexOf(".");
      if (signatureStartPos < 1) return null;
      const signedValue = value.substring(0, signatureStartPos);
      const signature = value.substring(signatureStartPos + 1);
      if (signature.length !== 44 || !signature.endsWith("=")) return null;
      return await verifySignature(signature, signedValue, await getCryptoKey(secret)) ? signedValue : false;
    },
    setCookie: (key, value, options2) => {
      const cookie = serializeCookie(key, value, options2);
      headers.append("set-cookie", cookie);
      return cookie;
    },
    setSignedCookie: async (key, value, secret, options2) => {
      const cookie = await serializeSignedCookie(key, value, secret, options2);
      headers.append("set-cookie", cookie);
      return cookie;
    },
    redirect: (url) => {
      headers.set("location", url);
      return new APIError("FOUND", void 0, headers);
    },
    error: (status, body, headers2) => {
      return new APIError(status, body, headers2);
    },
    setStatus: (status) => {
      responseStatus = status;
    },
    json: (json, routerResponse) => {
      if (!context.asResponse) return json;
      return {
        body: routerResponse?.body || json,
        routerResponse,
        _flag: "json"
      };
    },
    responseHeaders: headers,
    get responseStatus() {
      return responseStatus;
    }
  };
  for (const middleware of options.use || []) {
    const response = await middleware({
      ...internalContext,
      returnHeaders: true,
      asResponse: false
    });
    if (response.response) Object.assign(internalContext.context, response.response);
    if (response.headers) response.headers.forEach((value, key) => {
      internalContext.responseHeaders.set(key, value);
    });
  }
  return internalContext;
};

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/to-response.mjs
function isJSONSerializable(value) {
  if (value === void 0) return false;
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) return true;
  if (t !== "object") return false;
  if (Array.isArray(value)) return true;
  if (value.buffer) return false;
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
function safeStringify(obj) {
  const parents = /* @__PURE__ */ new WeakMap();
  const ids = /* @__PURE__ */ new WeakMap();
  let id = 0;
  const isAncestor = (value, holder) => {
    let curr = holder;
    while (curr) {
      if (curr === value) return true;
      curr = parents.get(curr);
    }
    return false;
  };
  return JSON.stringify(obj, function(_key, value) {
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "object" && value !== null) {
      if (isAncestor(value, this)) return `[Circular ref-${ids.get(value)}]`;
      parents.set(value, this);
      if (!ids.has(value)) ids.set(value, id++);
    }
    return value;
  });
}
function isJSONResponse(value) {
  if (!value || typeof value !== "object") return false;
  return "_flag" in value && value._flag === "json";
}
var REQUEST_ONLY_HEADERS = /* @__PURE__ */ new Set([
  "host",
  "user-agent",
  "referer",
  "from",
  "expect",
  "authorization",
  "proxy-authorization",
  "cookie",
  "origin",
  "accept-charset",
  "accept-encoding",
  "accept-language",
  "if-match",
  "if-none-match",
  "if-modified-since",
  "if-unmodified-since",
  "if-range",
  "range",
  "max-forwards",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "te",
  "upgrade",
  "trailer",
  "proxy-connection",
  "content-length"
]);
function stripRequestOnlyHeaders(headers) {
  for (const name of REQUEST_ONLY_HEADERS) headers.delete(name);
}
function copyHeaders(target, source) {
  if (!source) return;
  for (const [key, value] of new Headers(source).entries()) if (key.toLowerCase() === "set-cookie") target.append(key, value);
  else target.set(key, value);
}
function toResponse(data, init) {
  if (data instanceof Response) {
    if (init?.headers) {
      const safeHeaders = new Headers(init.headers);
      stripRequestOnlyHeaders(safeHeaders);
      copyHeaders(data.headers, safeHeaders);
    }
    return data;
  }
  if (isJSONResponse(data)) {
    const body2 = data.body;
    const routerResponse = data.routerResponse;
    if (routerResponse instanceof Response) return routerResponse;
    const headers2 = new Headers();
    copyHeaders(headers2, routerResponse?.headers);
    copyHeaders(headers2, data.headers);
    if (init?.headers) {
      const safeHeaders = new Headers(init.headers);
      stripRequestOnlyHeaders(safeHeaders);
      copyHeaders(headers2, safeHeaders);
    }
    headers2.set("Content-Type", "application/json");
    return new Response(JSON.stringify(body2), {
      ...routerResponse,
      headers: headers2,
      status: data.status ?? init?.status ?? routerResponse?.status,
      statusText: init?.statusText ?? routerResponse?.statusText
    });
  }
  if (isAPIError(data)) return toResponse(data.body, {
    status: init?.status ?? data.statusCode,
    statusText: data.status.toString(),
    headers: init?.headers || data.headers
  });
  let body = data;
  const headers = new Headers(init?.headers);
  stripRequestOnlyHeaders(headers);
  if (!data) {
    if (data === null) body = JSON.stringify(null);
    headers.set("content-type", "application/json");
  } else if (typeof data === "string") {
    body = data;
    headers.set("Content-Type", "text/plain");
  } else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
    body = data;
    headers.set("Content-Type", "application/octet-stream");
  } else if (data instanceof Blob) {
    body = data;
    headers.set("Content-Type", data.type || "application/octet-stream");
  } else if (data instanceof FormData) body = data;
  else if (data instanceof URLSearchParams) {
    body = data;
    headers.set("Content-Type", "application/x-www-form-urlencoded");
  } else if (data instanceof ReadableStream) {
    body = data;
    headers.set("Content-Type", "application/octet-stream");
  } else if (isJSONSerializable(data)) {
    body = safeStringify(data);
    headers.set("Content-Type", "application/json");
  }
  return new Response(body, {
    ...init,
    headers
  });
}

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/endpoint.mjs
function createEndpoint(pathOrOptions, handlerOrOptions, handlerOrNever) {
  const path = typeof pathOrOptions === "string" ? pathOrOptions : void 0;
  const options = typeof handlerOrOptions === "object" ? handlerOrOptions : pathOrOptions;
  const handler = typeof handlerOrOptions === "function" ? handlerOrOptions : handlerOrNever;
  if ((options.method === "GET" || options.method === "HEAD") && options.body) throw new BetterCallError("Body is not allowed with GET or HEAD methods");
  if (path && /\/{2,}/.test(path)) throw new BetterCallError("Path cannot contain consecutive slashes");
  const internalHandler = async (...inputCtx) => {
    const context = inputCtx[0] || {};
    const { data: internalContext, error: validationError } = await tryCatch(createInternalContext(context, {
      options,
      path
    }));
    if (validationError) {
      if (!(validationError instanceof ValidationError)) throw validationError;
      if (options.onValidationError) await options.onValidationError({
        message: validationError.message,
        issues: validationError.issues
      });
      throw new APIError(400, {
        message: validationError.message,
        code: "VALIDATION_ERROR"
      });
    }
    const response = await handler(internalContext).catch(async (e) => {
      if (isAPIError(e)) {
        const onAPIError = options.onAPIError;
        if (onAPIError) await onAPIError(e);
        if (context.asResponse) return e;
      }
      throw e;
    });
    const headers = internalContext.responseHeaders;
    const status = internalContext.responseStatus;
    return context.asResponse ? toResponse(response, {
      headers,
      status
    }) : context.returnHeaders ? context.returnStatus ? {
      headers,
      response,
      status
    } : {
      headers,
      response
    } : context.returnStatus ? {
      response,
      status
    } : response;
  };
  internalHandler.options = options;
  internalHandler.path = path;
  return internalHandler;
}
function combineMiddleware(local, configured) {
  return [...local ?? [], ...configured ?? []];
}
createEndpoint.create = (opts) => {
  function createConfiguredEndpoint(...args) {
    if (args.length === 3) {
      const [path, options2, handler2] = args;
      return createEndpoint(path, {
        ...options2,
        use: combineMiddleware(options2.use, opts?.use)
      }, handler2);
    }
    const [options, handler] = args;
    return createEndpoint({
      ...options,
      use: combineMiddleware(options.use, opts?.use)
    }, handler);
  }
  return createConfiguredEndpoint;
};

// node_modules/.pnpm/better-call@1.4.0_zod@4.5.2/node_modules/better-call/dist/middleware.mjs
function createMiddleware(optionsOrHandler, handler) {
  const internalHandler = async (inputCtx) => {
    const context = inputCtx;
    const _handler = typeof optionsOrHandler === "function" ? optionsOrHandler : handler;
    const internalContext = await createInternalContext(context, {
      options: typeof optionsOrHandler === "function" ? {} : optionsOrHandler,
      path: "/"
    });
    if (!_handler) throw new Error("handler must be defined");
    try {
      const response = await _handler(internalContext);
      const headers = internalContext.responseHeaders;
      return context.returnHeaders ? {
        headers,
        response
      } : response;
    } catch (e) {
      if (isAPIError(e)) Object.defineProperty(e, kAPIErrorHeaderSymbol, {
        enumerable: false,
        configurable: true,
        get() {
          return internalContext.responseHeaders;
        }
      });
      throw e;
    }
  };
  internalHandler.options = typeof optionsOrHandler === "function" ? {} : optionsOrHandler;
  return internalHandler;
}
createMiddleware.create = (opts) => {
  function fn(optionsOrHandler, handler) {
    if (typeof optionsOrHandler === "function") return createMiddleware({ use: opts?.use }, optionsOrHandler);
    if (!handler) throw new Error("Middleware handler is required");
    return createMiddleware({
      ...optionsOrHandler,
      method: "*",
      use: [...opts?.use || [], ...optionsOrHandler.use || []]
    }, handler);
  }
  return fn;
};

// node_modules/.pnpm/@better-auth+core@1.7.2_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call@1.4.0__up5s5gwwz76rpygc6g3ppb6mca/node_modules/@better-auth/core/dist/utils/is-api-error.mjs
function isAPIError2(error) {
  return error instanceof APIError || error instanceof APIError2 || error?.name === "APIError";
}

// node_modules/.pnpm/@better-auth+core@1.7.2_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call@1.4.0__up5s5gwwz76rpygc6g3ppb6mca/node_modules/@better-auth/core/dist/context/global.mjs
var symbol = Symbol.for("better-auth:global");
var bind = null;
var __context = {};
var __betterAuthVersion = "1.7.2";
function __getBetterAuthGlobal() {
  if (!globalThis[symbol]) {
    globalThis[symbol] = {
      version: __betterAuthVersion,
      epoch: 1,
      context: __context
    };
    bind = globalThis[symbol];
  }
  bind = globalThis[symbol];
  if (bind.version !== __betterAuthVersion) {
    bind.version = __betterAuthVersion;
    bind.epoch++;
  }
  return globalThis[symbol];
}

// node_modules/.pnpm/@better-auth+core@1.7.2_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call@1.4.0__up5s5gwwz76rpygc6g3ppb6mca/node_modules/@better-auth/core/dist/async_hooks/index.mjs
var AsyncLocalStoragePromise = import(
  /* @vite-ignore */
  /* webpackIgnore: true */
  "node:async_hooks"
).then((mod) => mod.AsyncLocalStorage).catch((err) => {
  if ("AsyncLocalStorage" in globalThis) return globalThis.AsyncLocalStorage;
  if (typeof window !== "undefined") return null;
  console.warn("[better-auth] Warning: AsyncLocalStorage is not available in this environment. Some features may not work as expected.");
  console.warn("[better-auth] Please read more about this warning at https://better-auth.com/docs/installation#mount-handler");
  console.warn("[better-auth] If you are using Cloudflare Workers, please see: https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag");
  throw err;
});
async function getAsyncLocalStorage() {
  const mod = await AsyncLocalStoragePromise;
  if (mod === null) throw new Error("getAsyncLocalStorage is only available in server code");
  else return mod;
}

// node_modules/.pnpm/@better-auth+core@1.7.2_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call@1.4.0__up5s5gwwz76rpygc6g3ppb6mca/node_modules/@better-auth/core/dist/context/endpoint-context.mjs
var getExistingEndpointContextStorage = () => {
  return __getBetterAuthGlobal().context.endpointContextAsyncStorage;
};
var getOrCreateEndpointContextStorage = async () => {
  const existing = getExistingEndpointContextStorage();
  if (existing) return existing;
  const AsyncLocalStorage = await getAsyncLocalStorage();
  const globalContext = __getBetterAuthGlobal().context;
  return globalContext.endpointContextAsyncStorage ??= new AsyncLocalStorage();
};
async function runWithEndpointContext(authEndpointContext, fn) {
  return (await getOrCreateEndpointContextStorage()).run(authEndpointContext, fn);
}

// node_modules/.pnpm/@better-auth+core@1.7.2_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_better-call@1.4.0__up5s5gwwz76rpygc6g3ppb6mca/node_modules/@better-auth/core/dist/api/index.mjs
var NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  Pragma: "no-cache"
};
function attachResponseHeadersToAPIError(responseHeaders, e) {
  if (!isAPIError2(e) || !responseHeaders) return;
  Object.defineProperty(e, kAPIErrorHeaderSymbol, {
    enumerable: false,
    configurable: true,
    value: responseHeaders,
    writable: false
  });
}
var optionsMiddleware = createMiddleware(async () => {
  return {};
});
var createAuthMiddleware = createMiddleware.create({ use: [optionsMiddleware, createMiddleware(async () => {
  return {};
})] });
var createEndpointWithAuthContext = createEndpoint.create({ use: [optionsMiddleware] });
function wrapEndpointHandler(handler, options) {
  const noStore = options.metadata?.noStore === true;
  return async (context) => {
    if (noStore) for (const [name, value] of Object.entries(NO_STORE_HEADERS)) context.setHeader(name, value);
    try {
      return await runWithEndpointContext(context, () => handler(context));
    } catch (error) {
      attachResponseHeadersToAPIError(context.responseHeaders, error);
      throw error;
    }
  };
}
function createAuthEndpoint(...args) {
  if (args.length === 3) {
    const [path, options2, handler2] = args;
    return createEndpointWithAuthContext(path, options2, wrapEndpointHandler(handler2, options2));
  }
  const [options, handler] = args;
  return createEndpointWithAuthContext(options, wrapEndpointHandler(handler, options));
}
function withServerOnly(options) {
  return {
    ...options,
    metadata: {
      ...options.metadata,
      SERVER_ONLY: true
    }
  };
}
createAuthEndpoint.serverOnly = (options, handler) => createAuthEndpoint(withServerOnly(options), handler);

// node_modules/.pnpm/@thallesp+nestjs-better-auth@2.7.0_@nestjs+common@11.2.3_class-transformer@0.5.1_class-valida_uryg5xjjedp4t5fryusoghtgem/node_modules/@thallesp/nestjs-better-auth/dist/index.mjs
var import_node_module = require("node:module");
var import_shared_utils = require("@nestjs/common/utils/shared.utils.js");
var import_utils8 = require("@nestjs/core/middleware/utils.js");
var BEFORE_HOOK_KEY = Symbol("BEFORE_HOOK");
var AFTER_HOOK_KEY = Symbol("AFTER_HOOK");
var HOOK_KEY = Symbol("HOOK");
var AUTH_MODULE_OPTIONS_KEY = Symbol("AUTH_MODULE_OPTIONS");
var DATABASE_HOOK_KEY = Symbol("DATABASE_HOOK");
var BEFORE_DATABASE_HOOK_KEY = Symbol(
  "BEFORE_DATABASE_HOOK"
);
var AFTER_DATABASE_HOOK_KEY = Symbol("AFTER_DATABASE_HOOK");
var GqlExecutionContext;
async function getGqlExecutionContext() {
  if (!GqlExecutionContext) {
    GqlExecutionContext = (await import("@nestjs/graphql")).GqlExecutionContext;
  }
  return GqlExecutionContext;
}
async function getRequestFromContext(context) {
  const contextType = context.getType();
  if (contextType === "graphql") {
    return (await getGqlExecutionContext()).create(context).getContext().req;
  }
  if (contextType === "ws") {
    return context.switchToWs().getClient();
  }
  return context.switchToHttp().getRequest();
}
var AllowAnonymous = () => (0, import_common.SetMetadata)("PUBLIC", true);
var OptionalAuth = () => (0, import_common.SetMetadata)("OPTIONAL", true);
var RequireActiveOrg = () => (0, import_common.SetMetadata)("REQUIRE_ACTIVE_ORG", true);
var Roles = (roles) => (0, import_common.SetMetadata)("ROLES", roles);
var OrgRoles = (roles) => (0, import_common.applyDecorators)(RequireActiveOrg(), (0, import_common.SetMetadata)("ORG_ROLES", roles));
var UserHasPermission = (options) => {
  if (!options.permission && !options.permissions) {
    throw new Error(
      "UserHasPermission: Either 'permission' or 'permissions' must be provided"
    );
  }
  return (0, import_common.SetMetadata)("USER_HAS_PERMISSION", options);
};
var MemberHasPermission = (options) => {
  if (!options.permissions) {
    throw new Error("MemberHasPermission: 'permissions' must be provided");
  }
  return (0, import_common.SetMetadata)("MEMBER_HAS_PERMISSION", options);
};
var Public = AllowAnonymous;
var Optional = OptionalAuth;
var Session = (0, import_common.createParamDecorator)(
  async (_data, context) => {
    const request = await getRequestFromContext(context);
    return request.session;
  }
);
var BeforeHook = (path) => (0, import_common.SetMetadata)(BEFORE_HOOK_KEY, path);
var AfterHook = (path) => (0, import_common.SetMetadata)(AFTER_HOOK_KEY, path);
var Hook = () => (0, import_common.SetMetadata)(HOOK_KEY, true);
var DatabaseHook = () => (0, import_common.SetMetadata)(DATABASE_HOOK_KEY, true);
var BeforeCreate = (model) => (0, import_common.SetMetadata)(BEFORE_DATABASE_HOOK_KEY, { model, operation: "create" });
var AfterCreate = (model) => (0, import_common.SetMetadata)(AFTER_DATABASE_HOOK_KEY, { model, operation: "create" });
var BeforeUpdate = (model) => (0, import_common.SetMetadata)(BEFORE_DATABASE_HOOK_KEY, { model, operation: "update" });
var AfterUpdate = (model) => (0, import_common.SetMetadata)(AFTER_DATABASE_HOOK_KEY, { model, operation: "update" });
var BeforeDelete = (model) => (0, import_common.SetMetadata)(BEFORE_DATABASE_HOOK_KEY, { model, operation: "delete" });
var AfterDelete = (model) => (0, import_common.SetMetadata)(AFTER_DATABASE_HOOK_KEY, { model, operation: "delete" });
var MODULE_OPTIONS_TOKEN = Symbol("AUTH_MODULE_OPTIONS");
var { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } = new import_common.ConfigurableModuleBuilder({
  optionsInjectionToken: MODULE_OPTIONS_TOKEN
}).setClassMethodName("forRoot").setExtras(
  {
    isGlobal: true,
    disableGlobalAuthGuard: false,
    disableControllers: false
  },
  (def, extras) => {
    return {
      ...def,
      exports: [MODULE_OPTIONS_TOKEN],
      global: extras.isGlobal
    };
  }
).build();
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = decorator(result) || result;
  return result;
};
var __decorateParam$2 = (index, decorator) => (target, key) => decorator(target, key, index);
var AuthService = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns the API endpoints provided by the auth instance
   */
  get api() {
    return this.options.auth.api;
  }
  /**
   * Returns the complete auth instance
   * Access this for plugin-specific functionality
   */
  get instance() {
    return this.options.auth;
  }
};
AuthService = __decorateClass$2([
  __decorateParam$2(0, (0, import_common.Inject)(MODULE_OPTIONS_TOKEN))
], AuthService);
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = decorator(result) || result;
  return result;
};
var __decorateParam$1 = (index, decorator) => (target, key) => decorator(target, key, index);
var WsException;
async function getWsException() {
  if (!WsException) {
    try {
      WsException = (await import("@nestjs/websockets")).WsException;
    } catch (_error) {
      throw new Error(
        "@nestjs/websockets is required for WebSocket support. Please install it: npm install @nestjs/websockets @nestjs/platform-socket.io"
      );
    }
  }
  return WsException;
}
var AuthContextErrorMap = {
  http: {
    UNAUTHORIZED: async (args) => {
      if (args) return new import_common.UnauthorizedException(args);
      return new import_common.UnauthorizedException();
    },
    FORBIDDEN: async (args) => {
      if (args) return new import_common.ForbiddenException(args);
      return new import_common.ForbiddenException("Insufficient permissions");
    }
  },
  graphql: {
    UNAUTHORIZED: async (args) => {
      if (args) return new import_common.UnauthorizedException(args);
      return new import_common.UnauthorizedException();
    },
    FORBIDDEN: async (args) => {
      if (args) return new import_common.ForbiddenException(args);
      return new import_common.ForbiddenException("Insufficient permissions");
    }
  },
  ws: {
    UNAUTHORIZED: async (args) => {
      const WsExceptionClass = await getWsException();
      return new WsExceptionClass(args ?? "UNAUTHORIZED");
    },
    FORBIDDEN: async (args) => {
      const WsExceptionClass = await getWsException();
      return new WsExceptionClass(args ?? "FORBIDDEN");
    }
  },
  rpc: {
    UNAUTHORIZED: async () => new Error("UNAUTHORIZED"),
    FORBIDDEN: async () => new Error("FORBIDDEN")
  }
};
var AuthGuard = class {
  constructor(reflector, options) {
    this.reflector = reflector;
    this.options = options;
  }
  /**
   * Validates if the current request is authenticated
   * Attaches session and user information to the request object
   * Supports HTTP, GraphQL and WebSocket execution contexts
   * @param context - The execution context of the current request
   * @returns True if the request is authorized to proceed, throws an error otherwise
   */
  async canActivate(context) {
    const request = await getRequestFromContext(context);
    const session = await this.options.auth.api.getSession({
      headers: fromNodeHeaders(
        request.headers || request?.handshake?.headers || []
      )
    });
    request.session = session;
    request.user = session?.user ?? null;
    const isPublic = this.reflector.getAllAndOverride("PUBLIC", [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) return true;
    const isOptional = this.reflector.getAllAndOverride("OPTIONAL", [
      context.getHandler(),
      context.getClass()
    ]);
    if (!session && isOptional) return true;
    const ctxType = context.getType();
    if (!session) throw await AuthContextErrorMap[ctxType].UNAUTHORIZED();
    const headers = fromNodeHeaders(
      request.headers || request?.handshake?.headers || []
    );
    const requireActiveOrg = this.reflector.getAllAndOverride(
      "REQUIRE_ACTIVE_ORG",
      [context.getHandler(), context.getClass()]
    );
    if (requireActiveOrg && !session.session?.activeOrganizationId) {
      throw await AuthContextErrorMap[ctxType].FORBIDDEN({
        message: "Active organization is required"
      });
    }
    const requiredRoles = this.reflector.getAllAndOverride("ROLES", [
      context.getHandler(),
      context.getClass()
    ]);
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = this.checkUserRole(session, requiredRoles);
      if (!hasRole) throw await AuthContextErrorMap[ctxType].FORBIDDEN();
    }
    const requiredOrgRoles = this.reflector.getAllAndOverride(
      "ORG_ROLES",
      [context.getHandler(), context.getClass()]
    );
    if (requiredOrgRoles && requiredOrgRoles.length > 0) {
      const hasOrgRole = await this.checkOrgRole(
        session,
        headers,
        requiredOrgRoles
      );
      if (!hasOrgRole) throw await AuthContextErrorMap[ctxType].FORBIDDEN();
    }
    const permissionCheck = this.reflector.getAllAndOverride("USER_HAS_PERMISSION", [context.getHandler(), context.getClass()]);
    if (permissionCheck) {
      const hasPermission = await this.checkUserPermission(
        session,
        headers,
        permissionCheck
      );
      if (!hasPermission) throw await AuthContextErrorMap[ctxType].FORBIDDEN();
    }
    const memberPermissionCheck = this.reflector.getAllAndOverride("MEMBER_HAS_PERMISSION", [context.getHandler(), context.getClass()]);
    if (memberPermissionCheck) {
      const hasMemberPermission = await this.checkMemberPermission(
        session,
        headers,
        memberPermissionCheck
      );
      if (!hasMemberPermission)
        throw await AuthContextErrorMap[ctxType].FORBIDDEN();
    }
    return true;
  }
  /**
   * Checks if a role value matches any of the required roles
   * Handles both array and comma-separated string role formats
   * @param role - The role value to check (string, array, or undefined)
   * @param requiredRoles - Array of roles that grant access
   * @returns True if the role matches any required role
   */
  matchesRequiredRole(role, requiredRoles) {
    if (!role) return false;
    if (Array.isArray(role)) {
      return role.some((r) => requiredRoles.includes(r));
    }
    if (typeof role === "string") {
      return role.split(",").some((r) => requiredRoles.includes(r.trim()));
    }
    return false;
  }
  /**
   * Fetches the user's role within an organization from the member table
   * Uses Better Auth's organization plugin API if available
   * @param headers - The request headers containing session cookies
   * @returns The member's role in the organization, or undefined if not found
   */
  async getMemberRoleInOrganization(headers) {
    const authApi = this.options.auth.api;
    if (typeof authApi.getActiveMemberRole === "function") {
      const result = await authApi.getActiveMemberRole({ headers });
      return result?.role;
    }
    if (typeof authApi.getActiveMember === "function") {
      const member = await authApi.getActiveMember({ headers });
      return member?.role;
    }
    return void 0;
  }
  /**
   * Checks if the user has any of the required roles in user.role only.
   * Used by @Roles() decorator for system-level role checks (admin plugin).
   * @param session - The user's session
   * @param requiredRoles - Array of roles that grant access
   * @returns True if user.role matches any required role
   */
  checkUserRole(session, requiredRoles) {
    return this.matchesRequiredRole(session.user.role, requiredRoles);
  }
  /**
   * Checks if the user has any of the required roles in their organization.
   * Used by @OrgRoles() decorator for organization-level role checks.
   * Requires an active organization in the session.
   * @param session - The user's session
   * @param headers - The request headers for API calls
   * @param requiredRoles - Array of roles that grant access
   * @returns True if org member role matches any required role
   */
  async checkOrgRole(session, headers, requiredRoles) {
    const activeOrgId = session.session?.activeOrganizationId;
    if (!activeOrgId) {
      return false;
    }
    try {
      const memberRole = await this.getMemberRoleInOrganization(headers);
      return this.matchesRequiredRole(memberRole, requiredRoles);
    } catch (error) {
      console.error("Organization plugin error:", error);
      return false;
    }
  }
  /**
   * Checks if the user has the required permissions.
   * Used by @UserHasPermission() decorator for permission-based access control.
   * Calls Better Auth's userHasPermission API to verify permissions.
   * @param session - The user's session
   * @param headers - The request headers for API calls
   * @param permissionCheck - The permission check options
   * @returns True if user has the required permissions
   */
  async checkUserPermission(session, headers, permissionCheck) {
    try {
      const authApi = this.options.auth.api;
      if (typeof authApi.userHasPermission !== "function") {
        console.error(
          "userHasPermission API not available. Make sure access control is configured in Better Auth."
        );
        return false;
      }
      const body = {};
      if (permissionCheck.userId) {
        body.userId = permissionCheck.userId;
      } else if (session.user.id) {
        body.userId = session.user.id;
      }
      if (permissionCheck.role) {
        body.role = permissionCheck.role;
      }
      if (permissionCheck.permission) {
        body.permissions = permissionCheck.permission;
      } else if (permissionCheck.permissions) {
        body.permissions = permissionCheck.permissions;
      }
      const result = await authApi.userHasPermission({
        body,
        headers
      });
      if (result?.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Permission check error:", error);
      console.error(
        "Permission check body:",
        JSON.stringify(permissionCheck, null, 2)
      );
      return false;
    }
  }
  /**
   * Checks if the organization member has the required permissions.
   * Used by @MemberHasPermission() decorator for organization member permission-based access control.
   * Calls Better Auth's organization plugin hasPermission API to verify permissions.
   * Requires an active organization in the session.
   * @param session - The user's session
   * @param headers - The request headers for API calls
   * @param permissionCheck - The permission check options
   * @returns True if member has the required permissions
   */
  async checkMemberPermission(session, headers, permissionCheck) {
    const activeOrgId = session.session?.activeOrganizationId;
    if (!activeOrgId) {
      return false;
    }
    try {
      const authApi = this.options.auth.api;
      if (typeof authApi.hasPermission !== "function") {
        console.error(
          "hasPermission API not available. Make sure organization plugin with access control is configured in Better Auth."
        );
        return false;
      }
      const body = {
        permissions: permissionCheck.permissions
      };
      const result = await authApi.hasPermission({
        body,
        headers
      });
      if (result?.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Member permission check error:", error);
      console.error(
        "Member permission check body:",
        JSON.stringify(permissionCheck, null, 2)
      );
      return false;
    }
  }
};
AuthGuard = __decorateClass$1([
  (0, import_common.Injectable)(),
  __decorateParam$1(0, (0, import_common.Inject)(import_core.Reflector)),
  __decorateParam$1(1, (0, import_common.Inject)(MODULE_OPTIONS_TOKEN))
], AuthGuard);
var BYTE_UNITS = {
  b: 1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30
};
var require$2 = (0, import_node_module.createRequire)("file:///test/shims/thallesp-nestjs-better-auth.cjs");
var cachedQsParse;
function resolveFastifyParserType(type, fallback) {
  if (type === void 0) {
    return fallback;
  }
  if (typeof type === "function") {
    throw new Error(
      "Function-based bodyParser type matchers are not supported with the Fastify adapter."
    );
  }
  return type;
}
function resolveFastifyBodyLimit(limit) {
  if (limit === void 0) {
    return void 0;
  }
  if (typeof limit === "number") {
    return limit;
  }
  const SIZE_REGEX = new RegExp(
    `^(\\d+(?:\\.\\d+)?)\\s*(${Object.keys(BYTE_UNITS).join("|")})?$`,
    "i"
  );
  const match = SIZE_REGEX.exec(limit.trim().toLowerCase());
  if (!match) {
    throw new Error(
      `Unsupported Fastify body parser limit '${limit}'. Use a number of bytes or a string like '2mb', '0.5gb', etc.`
    );
  }
  const value = Number.parseFloat(match[1]);
  const unit = match[2] ?? "b";
  const bytes = Math.floor(value * BYTE_UNITS[unit]);
  if (!Number.isSafeInteger(bytes)) {
    throw new RangeError(
      `Resolved body limit exceeds safe integer range. Received: '${limit}'`
    );
  }
  return bytes;
}
function parseFastifyJsonBody(body, options) {
  const rawBody = body.toString("utf8");
  const trimmedBody = rawBody.trim();
  if (trimmedBody.length === 0) {
    return {};
  }
  if (options.strict !== false) {
    const firstCharacter = trimmedBody[0];
    if (firstCharacter !== "{" && firstCharacter !== "[") {
      throw new SyntaxError("Invalid JSON payload");
    }
  }
  return JSON.parse(rawBody, options.reviver);
}
function parseSimpleFormBody(body, parameterLimit) {
  const params = new URLSearchParams(body);
  const result = {};
  let count = 0;
  for (const [key, value] of params.entries()) {
    count += 1;
    if (parameterLimit !== void 0 && count > parameterLimit) {
      break;
    }
    const currentValue = result[key];
    if (currentValue === void 0) {
      result[key] = value;
      continue;
    }
    result[key] = Array.isArray(currentValue) ? [...currentValue, value] : [currentValue, value];
  }
  return result;
}
function parseFastifyUrlencodedBody(body, options) {
  const encoding = options.defaultCharset === "iso-8859-1" ? "latin1" : "utf8";
  const rawBody = body.toString(encoding);
  if (options.extended === false) {
    return parseSimpleFormBody(rawBody, options.parameterLimit);
  }
  const parseQs = getQsParse();
  return parseQs(rawBody, {
    charset: options.defaultCharset === "iso-8859-1" ? "iso-8859-1" : "utf-8",
    charsetSentinel: options.charsetSentinel,
    depth: options.depth,
    interpretNumericEntities: options.interpretNumericEntities,
    parameterLimit: options.parameterLimit
  });
}
function getQsParse() {
  if (cachedQsParse !== void 0) {
    return cachedQsParse;
  }
  try {
    cachedQsParse = require$2("qs").parse;
  } catch (error) {
    const moduleError = error;
    if (moduleError.code === "MODULE_NOT_FOUND") {
      cachedQsParse = null;
    } else {
      throw error;
    }
  }
  if (!cachedQsParse) {
    throw new Error(
      "Fastify bodyParser.urlencoded with extended: true requires the optional peer dependency 'qs'. Install 'qs' in your application to enable nested URL-encoded parsing."
    );
  }
  return cachedQsParse;
}
function registerFastifyBodyParser(useBodyParser, {
  type,
  fallbackType,
  rawBody,
  limit,
  parse
}) {
  useBodyParser?.(
    resolveFastifyParserType(type, fallbackType),
    rawBody,
    {
      bodyLimit: resolveFastifyBodyLimit(limit)
    },
    (_req, body, done) => {
      parse(body, done);
    }
  );
}
function configureFastifyBodyParser(httpAdapter, bodyParserOptions) {
  const fastifyInstance = httpAdapter.getInstance();
  const useBodyParser = httpAdapter.useBodyParser?.bind(httpAdapter);
  fastifyInstance.removeContentTypeParser?.([
    "application/json",
    "application/x-www-form-urlencoded"
  ]);
  registerFastifyBodyParser(useBodyParser, {
    type: bodyParserOptions.json.type,
    fallbackType: "application/json",
    rawBody: bodyParserOptions.json.rawBody,
    limit: bodyParserOptions.json.limit,
    parse: (body, done) => {
      if (!bodyParserOptions.json.enabled) {
        done(null, void 0);
        return;
      }
      try {
        done(null, parseFastifyJsonBody(body, bodyParserOptions.json));
      } catch (error) {
        done(error);
      }
    }
  });
  registerFastifyBodyParser(useBodyParser, {
    type: bodyParserOptions.urlencoded.type,
    fallbackType: "application/x-www-form-urlencoded",
    rawBody: bodyParserOptions.json.rawBody,
    limit: bodyParserOptions.urlencoded.limit,
    parse: (body, done) => {
      if (!bodyParserOptions.urlencoded.enabled) {
        done(null, void 0);
        return;
      }
      try {
        done(
          null,
          parseFastifyUrlencodedBody(body, bodyParserOptions.urlencoded)
        );
      } catch (error) {
        done(error);
      }
    }
  });
}
var require$1 = (0, import_node_module.createRequire)("file:///test/shims/thallesp-nestjs-better-auth.cjs");
var rawBodyParser = (req, _res, buffer) => {
  if (Buffer.isBuffer(buffer)) {
    req.rawBody = buffer;
  }
  return true;
};
function getExpressBodyParser() {
  return require$1("express");
}
function resolveBodyParserOptions(options = {}) {
  const bodyParserEnabledByDefault = !options.disableBodyParser;
  const jsonOptions = options.bodyParser?.json;
  const urlencodedOptions = options.bodyParser?.urlencoded;
  const rawBody = options.bodyParser?.rawBody ?? options.enableRawBodyParser ?? false;
  const {
    enabled: jsonEnabled = bodyParserEnabledByDefault,
    ...jsonParserOptions
  } = jsonOptions ?? {};
  const {
    enabled: urlencodedEnabled = bodyParserEnabledByDefault,
    extended = true,
    ...urlencodedParserOptions
  } = urlencodedOptions ?? {};
  return {
    json: {
      enabled: jsonEnabled,
      rawBody,
      ...jsonParserOptions
    },
    urlencoded: {
      enabled: urlencodedEnabled,
      extended,
      ...urlencodedParserOptions
    }
  };
}
function getRequestPath(req) {
  return req.originalUrl ?? req.url ?? req.baseUrl ?? req.raw?.url ?? "";
}
function getNodeRequest(req) {
  return req.raw ?? req;
}
function getNodeResponse(res) {
  return res.raw ?? res;
}
function matchesBasePath(req, basePath) {
  const requestPath = getRequestPath(req);
  return requestPath === basePath || requestPath.startsWith(`${basePath}/`);
}
function SkipBodyParsingMiddleware(options = {}) {
  const { basePath = "/api/auth", bodyParser = resolveBodyParserOptions() } = options;
  const express = getExpressBodyParser();
  const {
    enabled: jsonEnabled,
    rawBody,
    ...jsonParserOptions
  } = bodyParser.json;
  const { enabled: urlencodedEnabled, ...urlencodedParserOptions } = bodyParser.urlencoded;
  const expressJsonParserOptions = rawBody ? { ...jsonParserOptions, verify: rawBodyParser } : jsonParserOptions;
  const jsonParser = jsonEnabled ? express.json(expressJsonParserOptions) : null;
  const urlencodedParser = urlencodedEnabled ? express.urlencoded(urlencodedParserOptions) : null;
  return (req, res, next) => {
    if (matchesBasePath(req, basePath)) {
      next();
      return;
    }
    const nodeReq = getNodeRequest(req);
    const nodeRes = getNodeResponse(res);
    const runUrlencodedParser = (err) => {
      if (err) {
        next(err);
        return;
      }
      if (!urlencodedParser) {
        next();
        return;
      }
      urlencodedParser(nodeReq, nodeRes, next);
    };
    if (!jsonParser) {
      runUrlencodedParser();
      return;
    }
    jsonParser(nodeReq, nodeRes, runUrlencodedParser);
  };
}
function getHeaderValue(header) {
  if (Array.isArray(header)) {
    return header.join(", ");
  }
  return header;
}
function appendVaryHeader(res, value) {
  const currentHeader = res.getHeader("Vary");
  const currentValue = typeof currentHeader === "number" ? String(currentHeader) : Array.isArray(currentHeader) ? currentHeader.join(", ") : currentHeader;
  const varyValues = new Set(
    currentValue?.split(",").map((item) => item.trim()).filter(Boolean) ?? []
  );
  varyValues.add(value);
  res.setHeader("Vary", Array.from(varyValues).join(", "));
}
function escapeRegex(pattern) {
  return pattern.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}
function matchesOriginPattern(origin, pattern) {
  if (pattern === "*") return true;
  const regex = new RegExp(
    `^${pattern.split("*").map(escapeRegex).join(".*")}$`
  );
  return regex.test(origin);
}
function isAllowedOrigin(origin, trustedOrigins) {
  return trustedOrigins.some(
    (trustedOrigin) => matchesOriginPattern(origin, trustedOrigin)
  );
}
function handleFastifyTrustedOriginsCors(req, res, options) {
  const nodeReq = getNodeRequest(req);
  const nodeRes = getNodeResponse(res);
  const origin = getHeaderValue(nodeReq.headers.origin);
  if (!origin || !isAllowedOrigin(origin, options.trustedOrigins)) {
    return false;
  }
  nodeRes.setHeader("Access-Control-Allow-Origin", origin);
  nodeRes.setHeader("Access-Control-Allow-Credentials", "true");
  appendVaryHeader(nodeRes, "Origin");
  if (nodeReq.method?.toUpperCase() !== "OPTIONS") {
    return false;
  }
  const requestMethod = getHeaderValue(
    nodeReq.headers["access-control-request-method"]
  );
  const requestHeaders = getHeaderValue(
    nodeReq.headers["access-control-request-headers"]
  );
  nodeRes.setHeader(
    "Access-Control-Allow-Methods",
    requestMethod ?? "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  if (requestHeaders) {
    nodeRes.setHeader("Access-Control-Allow-Headers", requestHeaders);
    appendVaryHeader(nodeRes, "Access-Control-Request-Headers");
  }
  nodeRes.statusCode = 204;
  nodeRes.setHeader("Content-Length", "0");
  nodeRes.end();
  return true;
}
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = decorator(result) || result;
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var HOOKS = [
  { metadataKey: BEFORE_HOOK_KEY, hookType: "before" },
  { metadataKey: AFTER_HOOK_KEY, hookType: "after" }
];
var DATABASE_HOOKS = [
  { metadataKey: BEFORE_DATABASE_HOOK_KEY, hookType: "before" },
  { metadataKey: AFTER_DATABASE_HOOK_KEY, hookType: "after" }
];
var AuthModule = class extends ConfigurableModuleClass {
  constructor(applicationConfig, discoveryService, metadataScanner, adapter, options) {
    super();
    this.applicationConfig = applicationConfig;
    this.discoveryService = discoveryService;
    this.metadataScanner = metadataScanner;
    this.adapter = adapter;
    this.options = options;
    this.basePath = (0, import_shared_utils.normalizePath)(
      this.options.auth.options.basePath ?? "/api/auth"
    );
    const globalPrefixOptions = this.applicationConfig.getGlobalPrefixOptions();
    this.applicationConfig.setGlobalPrefixOptions({
      exclude: [
        ...globalPrefixOptions.exclude ?? [],
        ...(0, import_utils8.mapToExcludeRoute)([this.basePath, `${this.basePath}/*path`])
      ]
    });
  }
  logger = new import_common.Logger(AuthModule.name);
  basePath;
  onModuleInit() {
    const hookProviders = this.discoveryService.getProviders().filter(
      ({ metatype }) => metatype && Reflect.getMetadata(HOOK_KEY, metatype)
    );
    const hasHookProviders = hookProviders.length > 0;
    const hooksConfigured = typeof this.options.auth?.options?.hooks === "object";
    if (hasHookProviders && !hooksConfigured)
      throw new Error(
        "Detected @Hook providers but Better Auth 'hooks' are not configured. Add 'hooks: {}' to your betterAuth(...) options."
      );
    if (hooksConfigured) {
      for (const provider of hookProviders) {
        const providerPrototype = Object.getPrototypeOf(provider.instance);
        const methods = this.metadataScanner.getAllMethodNames(providerPrototype);
        for (const method of methods) {
          const providerMethod = providerPrototype[method];
          this.setupHooks(providerMethod, provider.instance);
        }
      }
    }
    const databaseHookProviders = this.discoveryService.getProviders().filter(
      ({ metatype }) => metatype && Reflect.getMetadata(DATABASE_HOOK_KEY, metatype)
    );
    const hasDatabaseHookProviders = databaseHookProviders.length > 0;
    const databaseHooksConfigured = typeof this.options.auth?.options?.databaseHooks === "object";
    if (hasDatabaseHookProviders && !databaseHooksConfigured)
      throw new Error(
        "Detected @DatabaseHook providers but Better Auth 'databaseHooks' is not configured. Add an empty 'databaseHooks: {}' object to your betterAuth(...) options."
      );
    if (!hasDatabaseHookProviders) return;
    for (const provider of databaseHookProviders) {
      const providerPrototype = Object.getPrototypeOf(provider.instance);
      const methods = this.metadataScanner.getAllMethodNames(providerPrototype);
      for (const method of methods) {
        const providerMethod = providerPrototype[method];
        this.setupDatabaseHooks(providerMethod, provider.instance);
      }
    }
  }
  configure(consumer) {
    const adapterType = this.adapter.httpAdapter.getType();
    const trustedOrigins = this.options.auth.options.trustedOrigins;
    const bodyParserOptions = resolveBodyParserOptions(this.options);
    const isNotFunctionBased = trustedOrigins && Array.isArray(trustedOrigins);
    if (!this.options.disableTrustedOriginsCors && isNotFunctionBased) {
      if (adapterType !== "fastify") {
        this.adapter.httpAdapter.enableCors({
          origin: trustedOrigins,
          methods: ["GET", "POST", "PUT", "DELETE"],
          credentials: true
        });
      }
    } else if (trustedOrigins && !this.options.disableTrustedOriginsCors && !isNotFunctionBased)
      throw new Error(
        "Function-based trustedOrigins not supported in NestJS. Use string array or disable CORS with disableTrustedOriginsCors: true."
      );
    if ("disableBodyParser" in this.options) {
      this.logger.warn(
        "`disableBodyParser` is deprecated. Use `bodyParser.json.enabled` and `bodyParser.urlencoded.enabled` instead."
      );
    }
    if ("enableRawBodyParser" in this.options) {
      this.logger.warn(
        "`enableRawBodyParser` is deprecated. Use `bodyParser.rawBody` instead."
      );
    }
    if (adapterType !== "fastify") {
      consumer.apply(
        SkipBodyParsingMiddleware({
          basePath: this.basePath,
          bodyParser: bodyParserOptions
        })
      ).forRoutes("*path");
    }
    if (adapterType === "fastify") {
      configureFastifyBodyParser(this.adapter.httpAdapter, bodyParserOptions);
    }
    const handler = toNodeHandler2(this.options.auth);
    const authHandler = (req, res, next) => {
      if (!matchesBasePath(req, this.basePath)) {
        next();
        return;
      }
      if (adapterType === "fastify" && !this.options.disableTrustedOriginsCors && isNotFunctionBased && handleFastifyTrustedOriginsCors(req, res, {
        trustedOrigins
      })) {
        return;
      }
      const nodeReq = getNodeRequest(req);
      const nodeRes = getNodeResponse(res);
      if (this.options.middleware) {
        return this.options.middleware(
          req,
          res,
          () => handler(nodeReq, nodeRes)
        );
      }
      return handler(nodeReq, nodeRes);
    };
    this.adapter.httpAdapter.use(
      (req, res, next) => authHandler(req, res, next)
    );
    this.logger.log(`AuthModule initialized BetterAuth on '${this.basePath}'`);
  }
  setupHooks(providerMethod, providerClass) {
    if (!this.options.auth.options.hooks) return;
    for (const { metadataKey, hookType } of HOOKS) {
      const hasHook = Reflect.hasMetadata(metadataKey, providerMethod);
      if (!hasHook) continue;
      const hookPath = Reflect.getMetadata(metadataKey, providerMethod);
      const originalHook = this.options.auth.options.hooks[hookType];
      this.options.auth.options.hooks[hookType] = createAuthMiddleware(
        async (ctx) => {
          if (originalHook) {
            await originalHook(ctx);
          }
          if (hookPath && hookPath !== ctx.path) return;
          await providerMethod.apply(providerClass, [ctx]);
        }
      );
    }
  }
  setupDatabaseHooks(providerMethod, providerClass) {
    if (!this.options.auth.options.databaseHooks) return;
    for (const { metadataKey, hookType } of DATABASE_HOOKS) {
      if (!Reflect.hasMetadata(metadataKey, providerMethod)) continue;
      const { model, operation } = Reflect.getMetadata(
        metadataKey,
        providerMethod
      );
      const databaseHooks = this.options.auth.options.databaseHooks;
      databaseHooks[model] ??= {};
      databaseHooks[model][operation] ??= {};
      const originalHook = databaseHooks[model][operation][hookType];
      databaseHooks[model][operation][hookType] = async (...args) => {
        if (originalHook) {
          await originalHook(...args);
        }
        return providerMethod.apply(providerClass, args);
      };
    }
  }
  static forRootAsync(options) {
    const forRootAsyncResult = super.forRootAsync(options);
    const { module: module2 } = forRootAsyncResult;
    return {
      ...forRootAsyncResult,
      module: options.disableControllers ? AuthModuleWithoutControllers : module2,
      controllers: options.disableControllers ? [] : forRootAsyncResult.controllers,
      providers: [
        ...forRootAsyncResult.providers ?? [],
        ...!options.disableGlobalAuthGuard ? [
          {
            provide: import_core.APP_GUARD,
            useClass: AuthGuard
          }
        ] : []
      ]
    };
  }
  static forRoot(arg1, arg2) {
    const normalizedOptions = typeof arg1 === "object" && arg1 !== null && "auth" in arg1 ? arg1 : { ...arg2 ?? {}, auth: arg1 };
    const forRootResult = super.forRoot(normalizedOptions);
    const { module: module2 } = forRootResult;
    return {
      ...forRootResult,
      module: normalizedOptions.disableControllers ? AuthModuleWithoutControllers : module2,
      controllers: normalizedOptions.disableControllers ? [] : forRootResult.controllers,
      providers: [
        ...forRootResult.providers ?? [],
        ...!normalizedOptions.disableGlobalAuthGuard ? [
          {
            provide: import_core.APP_GUARD,
            useClass: AuthGuard
          }
        ] : []
      ]
    };
  }
};
AuthModule = __decorateClass([
  (0, import_common.Module)({
    imports: [import_core.DiscoveryModule],
    providers: [AuthService],
    exports: [AuthService]
  }),
  __decorateParam(0, (0, import_common.Inject)(import_core.ApplicationConfig)),
  __decorateParam(1, (0, import_common.Inject)(import_core.DiscoveryService)),
  __decorateParam(2, (0, import_common.Inject)(import_core.MetadataScanner)),
  __decorateParam(3, (0, import_common.Inject)(import_core.HttpAdapterHost)),
  __decorateParam(4, (0, import_common.Inject)(MODULE_OPTIONS_TOKEN))
], AuthModule);
var AuthModuleWithoutControllers = class extends AuthModule {
  configure() {
    return;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AFTER_DATABASE_HOOK_KEY,
  AFTER_HOOK_KEY,
  AUTH_MODULE_OPTIONS_KEY,
  AfterCreate,
  AfterDelete,
  AfterHook,
  AfterUpdate,
  AllowAnonymous,
  AuthGuard,
  AuthModule,
  AuthService,
  BEFORE_DATABASE_HOOK_KEY,
  BEFORE_HOOK_KEY,
  BeforeCreate,
  BeforeDelete,
  BeforeHook,
  BeforeUpdate,
  DATABASE_HOOK_KEY,
  DatabaseHook,
  HOOK_KEY,
  Hook,
  MemberHasPermission,
  Optional,
  OptionalAuth,
  OrgRoles,
  Public,
  RequireActiveOrg,
  Roles,
  Session,
  UserHasPermission
});
