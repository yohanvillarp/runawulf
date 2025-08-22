export const WEBSOCKET_MESSAGE_TYPES = {
  EXEC_SCRIPT: "exec-script",
  EXEC_RESULT: "exec-result",
  SCRIPT_RESULT: "script-result",
  SCRIPT_ERROR: "script-error",
  EXEC_ERROR: "exec-error",
  CHECK_PACKAGES: "check-packages",
  INSTALL_PACKAGE: "install-package",
} as const;

export type WebSocketMessageType = typeof WEBSOCKET_MESSAGE_TYPES[keyof typeof WEBSOCKET_MESSAGE_TYPES];
