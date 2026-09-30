/* SPDX-License-Identifier: (LGPL-2.1 OR BSD-2-Clause) */
/* Runawulf eBPF Endian Conversion Header */
#ifndef __BPF_ENDIAN_H__
#define __BPF_ENDIAN_H__

#define bpf_htons(x) __builtin_bswap16(x)
#define bpf_ntohs(x) __builtin_bswap16(x)
#define bpf_htonl(x) __builtin_bswap32(x)
#define bpf_ntohl(x) __builtin_bswap32(x)

#endif /* __BPF_ENDIAN_H__ */
