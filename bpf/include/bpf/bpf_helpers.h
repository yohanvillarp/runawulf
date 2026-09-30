/* SPDX-License-Identifier: (LGPL-2.1 OR BSD-2-Clause) */
/* Runawulf eBPF Helpers Header */
#ifndef __BPF_HELPERS_H__
#define __BPF_HELPERS_H__

#include "../vmlinux.h"

#define SEC(name) __attribute__((section(name), used))

#define __uint(name, val) int (*name)[val]
#define __type(name, val) typeof(val) *name

/* Function pointer typedefs with explicit cast to eliminate clang init_conversion_failed */
typedef void *(*bpf_map_lookup_elem_fn)(void *map, const void *key);
typedef void *(*bpf_ringbuf_reserve_fn)(void *ringbuf, __u64 size, __u64 flags);
typedef void (*bpf_ringbuf_submit_fn)(void *data, __u64 flags);
typedef __u64 (*bpf_get_current_pid_tgid_fn)(void);
typedef __u64 (*bpf_get_current_uid_gid_fn)(void);
typedef long (*bpf_get_current_comm_fn)(void *buf, __u32 size_of_buf);

static bpf_map_lookup_elem_fn bpf_map_lookup_elem = (bpf_map_lookup_elem_fn) 1;
static bpf_ringbuf_reserve_fn bpf_ringbuf_reserve = (bpf_ringbuf_reserve_fn) 131;
static bpf_ringbuf_submit_fn bpf_ringbuf_submit = (bpf_ringbuf_submit_fn) 132;
static bpf_get_current_pid_tgid_fn bpf_get_current_pid_tgid = (bpf_get_current_pid_tgid_fn) 14;
static bpf_get_current_uid_gid_fn bpf_get_current_uid_gid = (bpf_get_current_uid_gid_fn) 15;
static bpf_get_current_comm_fn bpf_get_current_comm = (bpf_get_current_comm_fn) 16;

#endif /* __BPF_HELPERS_H__ */
