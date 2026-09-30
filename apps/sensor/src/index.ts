/**
 * @file index.ts
 * @description Main entrypoint for @runawulf/sensor (eBPF Sensor Plane Bridge).
 */

export * from './loader/index.js';
export * from './consumers/index.js';
export * from './metrics/index.js';

export const SENSOR_PLANE_VERSION = '2.0.0-alpha.1';
