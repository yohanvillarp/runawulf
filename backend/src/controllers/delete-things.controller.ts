import { Request, Response } from "express";
import { execFile } from "child_process";
import path from "path";

export const deleteThing = (req: Request, res: Response) => {
  try {
    const { thing, params } = req.body;

    if (!thing) {
      return res.status(400).json({ error: "No se especificó el 'thing'" });
    }

    // Ruta absoluta al script delete_${thing}.sh
    const scriptPath = path.join(__dirname, "../../scripts/delete", `delete_${thing}.sh`);

    // Ejecutar el script con parámetros
    execFile(scriptPath, params || [], { shell: true }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando script ${thing}:`, stderr || error.message);
        return res.status(500).json({ error: stderr || error.message });
      }

      // Devolver resultado
      res.json({ output: stdout.trim() });
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
