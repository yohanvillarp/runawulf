/**
 * @file HelperClient.ts
 * @description Unix Domain Socket client connecting to runawulf-helper.
 */

import type { IpcRequestEnvelope, IpcResponseEnvelope } from '@runawulf/contracts';

export class HelperClient {
  public async send(_request: IpcRequestEnvelope): Promise<IpcResponseEnvelope> {
    throw new Error('Not implemented');
  }
}
