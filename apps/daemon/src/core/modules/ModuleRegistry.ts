/**
 * @file ModuleRegistry.ts
 * @description Catalog and lifecycle manager for active declarative modules.
 */

export class ModuleRegistry {
  public register(_manifest: unknown): void {}
  public unregister(_moduleId: string): void {}
}
