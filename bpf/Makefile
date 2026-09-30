# Runawulf eBPF CO-RE Build Makefile
CLANG ?= clang
ARCH ?= $(shell uname -m | sed 's/x86_64/x86/' | sed 's/aarch64/arm64/')

BPF_CFLAGS ?= -g -O2 -target bpf -D__TARGET_ARCH_$(ARCH) \
              -Iinclude -I/usr/include/$(shell uname -m)-linux-gnu \
              -Wall -Werror

SRC_DIR := src
OUT_DIR := dist
SRCS := $(wildcard $(SRC_DIR)/*.bpf.c)
OBJS := $(patsubst $(SRC_DIR)/%.bpf.c,$(OUT_DIR)/%.bpf.o,$(SRCS))

.PHONY: all clean

all: $(OBJS)

$(OUT_DIR):
	mkdir -p $(OUT_DIR)

$(OUT_DIR)/%.bpf.o: $(SRC_DIR)/%.bpf.c | $(OUT_DIR)
	$(CLANG) $(BPF_CFLAGS) -c $< -o $@

clean:
	rm -rf $(OUT_DIR)
