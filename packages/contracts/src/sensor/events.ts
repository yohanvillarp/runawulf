import { z } from 'zod';

export const ProcessExecEventSchema = z.object({
  pid: z.number().int().positive(),
  ppid: z.number().int().nonnegative(),
  uid: z.number().int().nonnegative(),
  gid: z.number().int().nonnegative(),
  comm: z.string(),
  filename: z.string(),
  timestamp: z.string(),
});

export type ProcessExecEvent = z.infer<typeof ProcessExecEventSchema>;

export const SocketConnectEventSchema = z.object({
  pid: z.number().int().positive(),
  uid: z.number().int().nonnegative(),
  family: z.enum(['AF_INET', 'AF_INET6']),
  destIp: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, { message: 'Invalid IP address' }),
  destPort: z.number().int().min(1).max(65535),
  comm: z.string(),
  timestamp: z.string(),
});

export type SocketConnectEvent = z.infer<typeof SocketConnectEventSchema>;
