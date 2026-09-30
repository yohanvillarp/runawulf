/* SPDX-License-Identifier: (LGPL-2.1 OR BSD-2-Clause) */
/* Runawulf eBPF Tracing Header */
#ifndef __BPF_TRACING_H__
#define __BPF_TRACING_H__

struct pt_regs;

#define BPF_KPROBE(name, args...) \
name(struct pt_regs *ctx, ##args)

#endif /* __BPF_TRACING_H__ */
