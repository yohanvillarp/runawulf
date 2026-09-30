import net from "node:net";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

/**
 * Mock Privileged Helper Socket Server
 * Emulates /run/runawulf/helper.sock for local development on Windows and macOS.
 */
export class MockHelperServer {
  private server: net.Server | null = null;
  private socketPath: string;

  constructor(customPath?: string) {
    if (customPath) {
      this.socketPath = customPath;
    } else if (os.platform() === "win32") {
      this.socketPath = "\\\\.\\pipe\\runawulf-helper-mock";
    } else {
      this.socketPath = path.join(os.tmpdir(), "runawulf-helper-mock.sock");
    }
  }

  public getSocketPath(): string {
    return this.socketPath;
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (os.platform() !== "win32" && fs.existsSync(this.socketPath)) {
        try {
          fs.unlinkSync(this.socketPath);
        } catch {
          // Ignore
        }
      }

      this.server = net.createServer((socket) => {
        let buffer = "";

        socket.on("data", (chunk) => {
          buffer += chunk.toString("utf-8");
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const request = JSON.parse(line);
              const response = this.handleIpcRequest(request);
              socket.write(JSON.stringify(response) + "\n");
            } catch (err) {
              socket.write(
                JSON.stringify({
                  id: "err",
                  success: false,
                  error: { code: "INVALID_JSON", message: String(err) },
                  timestamp: Date.now(),
                }) + "\n",
              );
            }
          }
        });
      });

      this.server.on("error", (err) => reject(err));
      this.server.listen(this.socketPath, () => {
        resolve();
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          if (os.platform() !== "win32" && fs.existsSync(this.socketPath)) {
            try {
              fs.unlinkSync(this.socketPath);
            } catch {
              // Ignore
            }
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private handleIpcRequest(req: { id: string; operation: string; payload?: unknown }) {
    switch (req.operation) {
      case "NFT_LIST_RULES":
        return {
          id: req.id,
          success: true,
          data: {
            table: "inet runawulf",
            rules: [
              { id: "rule-1", chain: "input", action: "drop", src: "192.168.1.100", comment: "Simulated Block" },
              { id: "rule-2", chain: "forward", action: "accept", comment: "Default Gateway" },
            ],
          },
          timestamp: Date.now(),
        };

      case "NFT_APPLY_TRANSACTION":
        return {
          id: req.id,
          success: true,
          data: {
            transactionId: `mock-tx-${Date.now()}`,
            appliedAt: new Date().toISOString(),
            status: "COMMITTED",
          },
          timestamp: Date.now(),
        };

      case "SYSTEM_GET_METRICS":
        return {
          id: req.id,
          success: true,
          data: {
            cpuUsagePercent: 14.2,
            memoryBytesUsed: 512 * 1024 * 1024,
            uptimeSeconds: 86400,
            activeSockets: 42,
          },
          timestamp: Date.now(),
        };

      default:
        return {
          id: req.id,
          success: true,
          data: { echoedOperation: req.operation, status: "MOCK_SUCCESS" },
          timestamp: Date.now(),
        };
    }
  }
}
