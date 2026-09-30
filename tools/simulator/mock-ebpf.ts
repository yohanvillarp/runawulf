import { EventEmitter } from "node:events";

export interface MockSecurityAlert {
  id: string;
  type: "PORT_SCAN" | "UNAUTHORIZED_EXEC" | "SYN_FLOOD" | "DNS_EXFILTRATION";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sourceIp: string;
  targetPort: number;
  processName?: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface MockKernelMetrics {
  packetsProcessed: number;
  packetsDropped: number;
  activeEBPFProbes: number;
  ringBufferDropCount: number;
  timestamp: number;
}

/**
 * Synthetic eBPF Telemetry Stream Generator
 * Simulates kernel probe events and RingBuffer telemetry for frontend & daemon testing.
 */
export class MockEbpfStream extends EventEmitter {
  private timer: NodeJS.Timeout | null = null;
  private metricsTimer: NodeJS.Timeout | null = null;
  private totalPackets = 1000000;
  private totalDrops = 42;

  public start(intervalMs = 3000): void {
    if (this.timer) return;

    this.timer = setInterval(() => {
      const alert = this.generateRandomAlert();
      this.emit("securityAlert", alert);
    }, intervalMs);

    this.metricsTimer = setInterval(() => {
      this.totalPackets += Math.floor(Math.random() * 500) + 100;
      if (Math.random() > 0.8) {
        this.totalDrops += 1;
      }

      const metrics: MockKernelMetrics = {
        packetsProcessed: this.totalPackets,
        packetsDropped: this.totalDrops,
        activeEBPFProbes: 4,
        ringBufferDropCount: 0,
        timestamp: Date.now(),
      };
      this.emit("kernelMetrics", metrics);
    }, 1000);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
      this.metricsTimer = null;
    }
  }

  private generateRandomAlert(): MockSecurityAlert {
    const types: MockSecurityAlert["type"][] = [
      "PORT_SCAN",
      "UNAUTHORIZED_EXEC",
      "SYN_FLOOD",
      "DNS_EXFILTRATION",
    ];
    const severities: MockSecurityAlert["severity"][] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const ips = ["192.168.1.105", "10.0.0.12", "198.51.100.42", "203.0.113.19"];
    const processes = ["curl", "nc", "python3", "miner", "masscan"];

    const chosenType = types[Math.floor(Math.random() * types.length)];
    const chosenSeverity = severities[Math.floor(Math.random() * severities.length)];

    return {
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: chosenType,
      severity: chosenSeverity,
      sourceIp: ips[Math.floor(Math.random() * ips.length)],
      targetPort: Math.floor(Math.random() * 65535),
      processName: processes[Math.floor(Math.random() * processes.length)],
      timestamp: new Date().toISOString(),
      metadata: {
        simulated: true,
        interface: "eth0",
        ebpfHook: "rw_xdp_filter",
      },
    };
  }
}
