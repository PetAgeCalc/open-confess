import { Confession } from '../types';

// Purane hardcoded static dataset ko completely bypass kar diya gaya hai
// taaki koi bhi stale "3 hours ago / 5 hours ago" post feed par na aaye.
// Saare dynamic posts ab strictly src/lib/activitySimulator.ts se manage honge.
export const seedConfessions: Confession[] = [];

// Sanity export for tests/debugging (preserving original structure to prevent build errors)
export const seedAuthorStats = {
  total: 0,
  named: 0,
  anonymous: 0,
};
