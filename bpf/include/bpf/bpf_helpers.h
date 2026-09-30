/* SPDX-License-Identifier: (LGPL-2.1 OR BSD-2-Clause) */
/* Runawulf eBPF Helpers Header */
#ifndef __BPF_HELPERS_H__
#define __BPF_HELPERS_H__

#include "../vmlinux.h"

#define SEC(name) __attribute__((section(name), used))

#define __uint(name, val) int (*name)[val]
#define __type(name, val) typeof(val) *name

/* Standard BPF helper function prototypes */
static void *(*bpf_map_lookup_elem)(void *map, const void *key) = (void *) 1;
static void *(*bpf_ringbuf_reserve)(void *ringbuf, __u64 size, __u64 flags) = (void *) 131;
static void (*bpf_ringbuf_submit)(void *data, __u64 flags) = (void *) 132;
static __u64 (*bpf_get_current_pid_tgid)(void) = (void *) 14;
static __u64 (*bpf_get_current_uid_gid)(void) = (void *) 15;
static long (*bpf_get_current_comm)(void *buf, __u32 size_of_buf) = (void *) 16;

#endif /* __BPF_HELPERS_H__ */
