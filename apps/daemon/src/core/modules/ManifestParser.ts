/**
 * @file ManifestParser.ts
 * @description Validates and parses declarative module manifests with anti-SSRF protections.
 */

import { DeclarativeModuleManifestSchema, type DeclarativeModuleManifest } from '@runawulf/contracts';

export class ManifestParser {
  public parse(rawContent: unknown): DeclarativeModuleManifest {
    return DeclarativeModuleManifestSchema.parse(rawContent);
  }
}
