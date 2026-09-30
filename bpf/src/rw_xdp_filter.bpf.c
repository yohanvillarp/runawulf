// SPDX-License-Identifier: GPL-2.0 OR BSD-3-Clause
/* Copyright (c) 2026 Runawulf Authors */

#include "vmlinux.h"
#include <bpf/bpf_helpers.h>
#include <bpf/bpf_endian.h>
#include "runawulf_bpf.h"

char LICENSE[] SEC("license") = "Dual BSD/GPL";

struct bpf_lpm_trie_key {
    __u32 prefixlen;
    __u32 data;
};

struct {
    __uint(type, BPF_MAP_TYPE_LPM_TRIE);
    __uint(max_entries, 65536);
    __type(key, struct bpf_lpm_trie_key);
    __type(value, __u32); // action: 1 = DROP
    __uint(map_flags, BPF_F_NO_PREALLOC);
} rw_xdp_denylist SEC(".maps");

SEC("xdp")
int xdp_filter_handler(struct xdp_md *ctx) {
    void *data_end = (void *)(long)ctx->data_end;
    void *data = (void *)(long)ctx->data;

    struct ethhdr *eth = data;
    if ((void *)(eth + 1) > data_end)
        return XDP_PASS;

    if (eth->h_proto != bpf_htons(ETH_P_IP))
        return XDP_PASS;

    struct iphdr *iph = (void *)(eth + 1);
    if ((void *)(iph + 1) > data_end)
        return XDP_PASS;

    struct bpf_lpm_trie_key key;
    key.prefixlen = 32;
    key.data = iph->saddr;

    __u32 *action = bpf_map_lookup_elem(&rw_xdp_denylist, &key);
    if (action && *action == 1) {
        return XDP_DROP;
    }

    return XDP_PASS;
}
