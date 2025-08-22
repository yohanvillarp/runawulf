import { Request, Response } from "express";
import path from "path";
import { execFile } from "child_process";

export const createThing = (req: Request, res: Response) => {
  try {
    const { thing, params } = req.body;

    if (!thing || typeof thing !== "string") {
      return res.status(400).json({ error: "Debe especificar un 'thing' válido" });
    }

    const args: string[] = Array.isArray(params)
      ? params.map((p) => String(p))
      : [];

    const scriptPath = path.join(__dirname, "../../scripts/create", `create_${thing}.sh`);

    execFile("sudo", [scriptPath, ...args], (error, stdout, stderr) => {
      const output = stdout.trim();

      if (error && output !== "DUPLICADA") {
        console.error(`Error ejecutando script ${thing}:`, stderr || error.message);
        return res.status(500).json({ error: stderr || error.message });
      }

      if (output === "DUPLICADA") {
        // Regla duplicada
        return res.json({ status: "duplicated", message: `La regla ya existe y no se aplicó.` });
      }

      // Regla aplicada correctamente
      res.json({ status: "ok", message: `La regla se ${output} ejecutó correctamente.`, output });
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
};
