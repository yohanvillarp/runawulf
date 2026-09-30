/**
 * @file index.ts
 * @description Public API for posture-transition feature under FSD.
 */

export { PostureTransitionOverlay } from './ui/PostureTransitionOverlay.js';
export { usePostureTransition } from './model/usePostureTransition.js';
export type { TransitionPhase, TransitionState } from './model/types.js';
