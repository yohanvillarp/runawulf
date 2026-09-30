# ==============================================================================
# Runawulf — Local Control Plane for Linux
# Root Makefile for build orchestration, eBPF compilation, and system operations
# ==============================================================================

SHELL := /usr/bin/env bash
PREFIX ?= /usr/local
SYSCONFDIR ?= /etc
SYSTEMD_SYSTEM_DIR ?= /etc/systemd/system
LIBDIR ?= /usr/lib/runawulf

NODE ?= node
NPM ?= npm

.DEFAULT_GOAL := help

## help: Display this list of available Makefile targets
.PHONY: help
help:
	@echo "Runawulf — Build & Operations Orchestrator"
	@echo "Usage: make <target>"
	@echo ""
	@echo "Available Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

## install-deps: Install workspace dependencies across the monorepo
.PHONY: install-deps
install-deps:
	@echo "==> Installing npm workspace dependencies..."
	$(NPM) install

## build: Build all TypeScript contracts, applications, and web UI
.PHONY: build
build:
	@echo "==> Building npm workspaces..."
	$(NPM) run build

## bpf: Compile kernel eBPF C programs into CO-RE objects
.PHONY: bpf
bpf:
	@echo "==> Building eBPF probes in bpf/..."
	$(MAKE) -C bpf all

## bpf-clean: Clean compiled eBPF object artifacts
.PHONY: bpf-clean
bpf-clean:
	@echo "==> Cleaning eBPF artifacts..."
	$(MAKE) -C bpf clean

## lint: Run ESLint and file length guardrails
.PHONY: lint
lint:
	@echo "==> Running linters & file length verification..."
	$(NPM) run lint
	$(NPM) run lint:lengths

## typecheck: Verify TypeScript types across all workspaces
.PHONY: typecheck
typecheck:
	@echo "==> Typechecking TypeScript packages..."
	$(NPM) run typecheck

## test: Execute test suites across all workspaces
.PHONY: test
test:
	@echo "==> Running test suites..."
	$(NPM) run test

## package-deb: Build native Debian/Ubuntu (.deb) package via nFPM
.PHONY: package-deb
package-deb: build
	@echo "==> Packaging .deb distribution with nFPM..."
	@which nfpm > /dev/null 2>&1 || (echo "ERROR: nfpm not found in PATH. Install from https://nfpm.goreleaser.com/" && exit 1)
	nfpm package --config packaging/nfpm.yaml --packager deb --target dist/

## package-rpm: Build native RedHat/Fedora (.rpm) package via nFPM
.PHONY: package-rpm
package-rpm: build
	@echo "==> Packaging .rpm distribution with nFPM..."
	@which nfpm > /dev/null 2>&1 || (echo "ERROR: nfpm not found in PATH. Install from https://nfpm.goreleaser.com/" && exit 1)
	nfpm package --config packaging/nfpm.yaml --packager rpm --target dist/

## install: Install Runawulf systemd units and default configs to host (requires root)
.PHONY: install
install:
	@echo "==> Installing Runawulf system configuration..."
	install -d -m 0750 $(DESTDIR)$(SYSCONFDIR)/runawulf
	install -d -m 0750 $(DESTDIR)/var/lib/runawulf
	install -d -m 0755 $(DESTDIR)$(LIBDIR)
	install -d -m 0755 $(DESTDIR)$(SYSTEMD_SYSTEM_DIR)
	install -m 0644 config/runawulf.default.yaml $(DESTDIR)$(SYSCONFDIR)/runawulf/runawulf.yaml
	install -m 0644 config/privileged-policy.default.yaml $(DESTDIR)$(SYSCONFDIR)/runawulf/privileged-policy.yaml
	install -m 0644 systemd/runawulf-helper.socket $(DESTDIR)$(SYSTEMD_SYSTEM_DIR)/
	install -m 0644 systemd/runawulf-helper.service $(DESTDIR)$(SYSTEMD_SYSTEM_DIR)/
	install -m 0644 systemd/runawulfd.service $(DESTDIR)$(SYSTEMD_SYSTEM_DIR)/
	install -m 0644 systemd/runawulf-sensor.service $(DESTDIR)$(SYSTEMD_SYSTEM_DIR)/
	install -m 0644 systemd/runawulf-ai.service $(DESTDIR)$(SYSTEMD_SYSTEM_DIR)/
	@echo "==> Reloading systemd daemon..."
	systemctl daemon-reload || true
	@echo "Installation complete. Enable with: systemctl enable --now runawulf-helper.socket runawulfd"

## uninstall: Remove Runawulf systemd units and installed binaries
.PHONY: uninstall
uninstall:
	@echo "==> Disabling and removing Runawulf units..."
	systemctl disable --now runawulf-ai.service runawulf-sensor.service runawulfd.service runawulf-helper.service runawulf-helper.socket || true
	rm -f $(DESTDIR)$(SYSTEMD_SYSTEM_DIR)/runawulf*
	systemctl daemon-reload || true
	@echo "Uninstall complete. Note: /etc/runawulf and /var/lib/runawulf were preserved."

## dev: Start the full stack in development mode
.PHONY: dev
dev:
	@echo "==> Starting Runawulf development services..."
	$(NPM) run dev --workspaces --if-present

## dev-mock: Run with mock IPC helper and synthetic eBPF stream (for Windows/macOS)
.PHONY: dev-mock
dev-mock:
	@echo "==> Starting Runawulf Mock Simulator..."
	$(NODE) --experimental-strip-types tools/simulator/index.ts

## clean: Clean dist folders and node_modules caches
.PHONY: clean
clean: bpf-clean
	@echo "==> Cleaning project build artifacts..."
	rm -rf dist/
	$(NPM) run clean
