import { MockHelperServer } from "./mock-helper.ts";
import { MockEbpfStream } from "./mock-ebpf.ts";

/**
 * Runawulf Mock Simulator CLI Entry Point
 * Orchestrates local mock helper IPC socket and synthetic eBPF telemetry.
 */
async function main() {
  console.log("================================================================");
  console.log("🐺 RUNAWULF SIMULATOR — Development Environment Active");
  console.log("================================================================");

  const helperServer = new MockHelperServer();
  await helperServer.start();
  console.log(`[IPC] Mock Helper Socket listening at: ${helperServer.getSocketPath()}`);

  const ebpfStream = new MockEbpfStream();
  ebpfStream.on("securityAlert", (alert) => {
    console.log(`[eBPF ALERT] [${alert.severity}] ${alert.type} from ${alert.sourceIp}:${alert.targetPort}`);
  });

  ebpfStream.on("kernelMetrics", (m) => {
    // Suppress high-frequency logging unless debugging
  });

  ebpfStream.start();
  console.log("[eBPF] Synthetic telemetry stream started (interval: 3s).");
  console.log("Press Ctrl+C to terminate simulator.");

  const shutdown = async () => {
    console.log("\n[Simulator] Shutting down cleanly...");
    ebpfStream.stop();
    await helperServer.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal error in Runawulf Simulator:", err);
  process.exit(1);
});
