// SPDX-License-Identifier: GPL-2.0 OR BSD-3-Clause
/* Copyright (c) 2026 Runawulf Authors */

#include "vmlinux.h"
#include <bpf/bpf_helpers.h>
#include "runawulf_bpf.h"

char LICENSE[] SEC("license") = "Dual BSD/GPL";

struct {
    __uint(type, BPF_MAP_TYPE_PERCPU_HASH);
    __uint(max_entries, 64);
    __type(key, __u32); // ifindex
    __type(value, struct net_stat_t);
} rw_net_stats_map SEC(".maps");

SEC("tc")
int handle_tc_stats(struct __sk_buff *skb) {
    __u32 ifindex = skb->ifindex;
    struct net_stat_t *stat;

    stat = bpf_map_lookup_elem(&rw_net_stats_map, &ifindex);
    if (stat) {
        __sync_fetch_and_add(&stat->rx_packets, 1);
        __sync_fetch_and_add(&stat->rx_bytes, skb->len);
    }

    return 0; // TC_ACT_OK
}
