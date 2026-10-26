// Single place to change public-facing business details.
export const APP_NAME = 'CodeLoop';
export const CONTACT_EMAIL = 'worknest63@gmail.com'; // TODO: replace with your own support/domain email
export const LEGAL_LAST_UPDATED = 'October 2026';

// LAUNCH SWITCH: while true, every Premium feature is unlocked for everyone
// (no problem limit, full analytics, Showcase, custom revision schedules).
// When you are ready to charge, set this to false — all Premium gates and the
// Free/Premium comparison come back automatically. (The database/edge-function
// side has its own checks, see notes — flip those too.)
export const ALL_FEATURES_FREE = true;

// Freemium plan settings
export const FREE_PROBLEM_LIMIT = 50;
export const PREMIUM_PRICE_INR = 99; // per month, for payers in India — change here, it updates everywhere
export const PREMIUM_PRICE_USD = 2; // per month, for payers outside India (kept above a straight conversion so card fees don't eat it)
