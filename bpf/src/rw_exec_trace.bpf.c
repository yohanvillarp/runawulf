// SPDX-License-Identifier: GPL-2.0 OR BSD-3-Clause
/* Copyright (c) 2026 Runawulf Authors */

#include "vmlinux.h"
#include <bpf/bpf_helpers.h>
#include <bpf/bpf_tracing.h>
#include <bpf/bpf_core_read.h>
#include "runawulf_bpf.h"

char LICENSE[] SEC("license") = "Dual BSD/GPL";

struct {
    __uint(type, BPF_MAP_TYPE_RINGBUF);
    __uint(max_entries, 256 * 1024); // 256KB ringbuf
} rw_exec_ringbuf SEC(".maps");

SEC("tp/sched/sched_process_exec")
int handle_exec(struct trace_event_raw_sched_process_exec *ctx) {
    struct exec_event_t *event;

    event = bpf_ringbuf_reserve(&rw_exec_ringbuf, sizeof(*event), 0);
    if (!event) {
        return 0; // Drop recorded on buffer saturation
    }

    event->pid = bpf_get_current_pid_tgid() >> 32;
    event->uid = bpf_get_current_uid_gid();
    bpf_get_current_comm(&event->comm, sizeof(event->comm));

    bpf_ringbuf_submit(event, 0);
    return 0;
}
