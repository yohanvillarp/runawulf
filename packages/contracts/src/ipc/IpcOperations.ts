/**
 * @file IpcOperations.ts
 * @description Enumeration of closed, domain-specific IPC operations allowed by the helper.
 */

export const IpcOperations = {
  // Firewall operations strictly within `table inet runawulf`
  FIREWALL_ADD_BLOCK: 'firewall.addBlock',
  FIREWALL_REMOVE_BLOCK: 'firewall.removeBlock',
  FIREWALL_LIST_BLOCKS: 'firewall.listBlocks',
  FIREWALL_PREPARE_RULESET: 'firewall.prepareRuleset',
  FIREWALL_COMMIT_RULESET: 'firewall.commitRuleset',
  FIREWALL_ROLLBACK_RULESET: 'firewall.rollbackRuleset',

  // Systemd operations strictly against pre-approved units
  SERVICE_RESTART: 'service.restart',
  SERVICE_STATUS: 'service.status',
  SERVICE_STOP: 'service.stop',
  SERVICE_START: 'service.start',

  // Cryptographic audit operations
  AUDIT_SIGN_ENTRY: 'audit.signEntry',
  AUDIT_ANCHOR_JOURNAL: 'audit.anchorJournal',
} as const;

export type IpcOperation = typeof IpcOperations[keyof typeof IpcOperations];
