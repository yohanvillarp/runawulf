/**
 * @file runes.ts
 * @description Elder Futhark runes constants and helpers.
 */

export const ELDER_FUTHARK_RUNES = [
  'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ',
  'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ',
  'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'
];

export function getRandomRune(): string {
  const index = Math.floor(Math.random() * ELDER_FUTHARK_RUNES.length);
  return ELDER_FUTHARK_RUNES[index];
}
