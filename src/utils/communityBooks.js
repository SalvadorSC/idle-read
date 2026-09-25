import upgradesInformation from "../data/upgradesInfo.json";

export const COMMUNITY_BOOK_PREFIX = "community:";

export const KN_FIELDS = ["multiplicador", "technology", "nature", "culture"];

export const MAX_KN_MULTIPLIER_SUM = 2;

const builtinTitles = new Set(
  (upgradesInformation.upgradesInfo || [])
    .map((book) => (book.upgrade || "").trim().toLowerCase())
    .filter(Boolean)
);

export function communityBookKey(id) {
  return `${COMMUNITY_BOOK_PREFIX}${id}`;
}

export function parseCommunityBookKey(value) {
  if (typeof value !== "string" || !value.startsWith(COMMUNITY_BOOK_PREFIX)) {
    return null;
  }
  const id = value.slice(COMMUNITY_BOOK_PREFIX.length);
  return id ? id : null;
}

export function isBuiltinBookTitle(title) {
  if (typeof title !== "string") return false;
  const normalized = title.trim().toLowerCase();
  if (!normalized) return false;
  return builtinTitles.has(normalized);
}

export function sanitizeField(field) {
  return KN_FIELDS.includes(field) ? field : null;
}

/**
 * Accept only finite, non-negative multipliers whose total is in (0, 2].
 * Returns a fresh object or null when the set is not allowed.
 */
export function sanitizeKnMultipliers(raw) {
  if (!raw || typeof raw !== "object") return null;
  const keys = ["generalKn", "bioKn", "technoKn", "cultureKn"];
  const out = {};
  let sum = 0;
  for (const key of keys) {
    const n = typeof raw[key] === "number" ? raw[key] : Number(raw[key]);
    if (!Number.isFinite(n) || n < 0) return null;
    const rounded = Math.round(n * 10000) / 10000;
    out[key] = rounded;
    sum += rounded;
  }
  if (sum <= 0 || sum - MAX_KN_MULTIPLIER_SUM > 1e-6) return null;
  return out;
}

export function communityBookLabel(chosenBook, winners) {
  const id = parseCommunityBookKey(chosenBook);
  if (!id) return chosenBook;
  const winner = (winners || []).find((entry) => entry && String(entry.id) === String(id));
  return winner && winner.title ? winner.title : chosenBook;
}
