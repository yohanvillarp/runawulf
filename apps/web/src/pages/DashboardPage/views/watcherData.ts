/**
 * @file watcherData.ts
 * @description Types and mock event telemetry for the Watcher view forensic console.
 */

export interface MockEveEvent {
  id: string;
  timestamp: string;
  severity: 1 | 2 | 3;
  srcIp: string;
  destIp: string;
  signature: string;
  category: string;
  action: 'AUDITED' | 'FLAGGED';
}

export const MOCK_EVENTS: MockEveEvent[] = [
  {
    id: 'eve-01',
    timestamp: '20:46:12.841',
    severity: 1,
    srcIp: '198.51.100.89:54210',
    destIp: '10.0.0.4:22',
    signature: 'ET SCAN Potential SSH Scan OUTBOUND',
    category: 'Attempted Information Leak',
    action: 'FLAGGED',
  },
  {
    id: 'eve-02',
    timestamp: '20:45:58.102',
    severity: 2,
    srcIp: '203.0.113.14:44321',
    destIp: '10.0.0.4:4000',
    signature: 'ET WEB_SERVER Possible SQL Injection in URI',
    category: 'Web Application Attack',
    action: 'FLAGGED',
  },
  {
    id: 'eve-03',
    timestamp: '20:45:40.553',
    severity: 3,
    srcIp: '192.0.2.77:50123',
    destIp: '10.0.0.4:80',
    signature: 'SURICATA HTTP Request anomalous user-agent (Go-http-client)',
    category: 'Generic Protocol Command Decode',
    action: 'AUDITED',
  },
  {
    id: 'eve-04',
    timestamp: '20:45:19.914',
    severity: 3,
    srcIp: '198.51.100.12:61002',
    destIp: '10.0.0.4:443',
    signature: 'ET INFO TLS SNI observed without valid SAN match',
    category: 'Misc activity',
    action: 'AUDITED',
  },
  {
    id: 'eve-05',
    timestamp: '20:44:50.218',
    severity: 1,
    srcIp: '203.0.113.205:58920',
    destIp: '10.0.0.4:22',
    signature: 'ET SCAN Rapid SSH Authentication Failures',
    category: 'Attempted Information Leak',
    action: 'FLAGGED',
  },
  {
    id: 'eve-06',
    timestamp: '20:44:11.002',
    severity: 2,
    srcIp: '198.51.100.201:49912',
    destIp: '10.0.0.4:4000',
    signature: 'ET EXPLOIT Suspicious Path Traversal Attempt (/etc/passwd)',
    category: 'Attempted Administrator Privilege Gain',
    action: 'FLAGGED',
  },
];
