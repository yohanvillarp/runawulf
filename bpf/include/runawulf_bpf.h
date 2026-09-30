/* SPDX-License-Identifier: MIT */
/* Copyright (c) 2026 Runawulf Authors */

#ifndef __RUNAWULF_BPF_H__
#define __RUNAWULF_BPF_H__

#define TASK_COMM_LEN 16
#define MAX_PATH_LEN 256

/**
 * Event emitted when a new process is executed on the host.
 */
struct exec_event_t {
    __u32 pid;
    __u32 ppid;
    __u32 uid;
    __u32 gid;
    char comm[TASK_COMM_LEN];
    char filename[MAX_PATH_LEN];
};

/**
 * Event emitted when an outbound TCP socket connect is initiated.
 */
struct connect_event_t {
    __u32 pid;
    __u32 uid;
    __u16 family;
    __u16 dport;
    __u32 daddr_v4;
    __u8  daddr_v6[16];
    char comm[TASK_COMM_LEN];
};

/**
 * Net stats counters per interface.
 */
struct net_stat_t {
    __u64 rx_packets;
    __u64 rx_bytes;
    __u64 tx_packets;
    __u64 tx_bytes;
    __u64 dropped_packets;
};

#endif /* __RUNAWULF_BPF_H__ */
