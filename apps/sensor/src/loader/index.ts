/**
 * @file loader/index.ts
 * @description eBPF pinned object manager for /sys/fs/bpf/runawulf/.
 */

export const BPF_PIN_PATH = '/sys/fs/bpf/runawulf';

export interface BpfPinMapDescriptor {
  name: string;
  pinPath: string;
  type: 'ringbuf' | 'hash' | 'percpu_hash' | 'lpm_trie';
}
