import { Request, Response } from "express";
import { exec } from "child_process";
import path from "path";

export const updateThing = async (req: Request, res: Response) => {
  try {
    const { thing, params } = req.body;
    if (!thing) return res.status(400).json({ error: "Missing 'thing' parameter" });

    // Construir ruta al script correspondiente
    const scriptPath = path.join(__dirname, "../../scripts/update", `${thing}.sh`);

    // Construir comando
    const cmd = `sudo bash ${scriptPath} ${params?.join(" ") ?? ""}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("Error ejecutando script:", stderr || error.message);
        return res.status(500).json({ error: stderr || error.message });
      }

      return res.json({ output: stdout });
    });

  } catch (err: unknown) {
    let message = "Error desconocido";
    if (err instanceof Error) message = err.message;
    res.status(500).json({ error: message });
  }
};
