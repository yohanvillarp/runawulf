/**
 * @file PeerCredentials.ts
 * @description Extracts and verifies kernel-level process credentials (SO_PEERCRED)
 * over Unix Domain Sockets to authenticate the connecting process.
 */

import type { Socket } from 'node:net';

export interface PeerCredentials {
  pid: number;
  uid: number;
  gid: number;
}

export class PeerCredentialsVerifier {
  /**
   * Reads SO_PEERCRED from the connected socket.
   * On Linux systems, this queries the kernel directly.
   *
   * @param socket The connected client Unix socket.
   * @returns The extracted process credentials.
   */
  public static getCredentials(socket: Socket): PeerCredentials | null {
    // In production on Linux, SO_PEERCRED is retrieved via getsockopt or native addon.
    // Skeleton implementation providing the interface contract:
    const rawCredentials = (socket as unknown as { _handle?: { getpeercred?: () => PeerCredentials } })
      ._handle?.getpeercred?.();

    if (rawCredentials) {
      return rawCredentials;
    }

    return null;
  }

  /**
   * Enforces that the connecting process possesses the exact expected unprivileged UID.
   *
   * @param credentials The credentials returned by the kernel.
   * @param expectedUid The UID of the 'runawulf' system user.
   * @returns True if authenticated, false otherwise.
   */
  public static verifyUid(credentials: PeerCredentials | null, expectedUid: number): boolean {
    if (!credentials) return false;
    return credentials.uid === expectedUid;
  }
}
