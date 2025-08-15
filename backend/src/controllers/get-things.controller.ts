import { Request, Response } from "express";
import { exec } from "child_process";
import path from "path";

export const getThings = (req: Request, res: Response) => {
  const thing = req.query.thing as string;

  if (!thing) {
    return res.status(400).json({ error: "Falta el parámetro 'thing'" });
  }

  const scriptPath = path.join(__dirname, "../../scripts/get/get.sh");

  exec(`bash "${scriptPath}" "${thing}"`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }

    // salida array JSON
    const lines = stdout.split("\n").filter(Boolean);
    res.json({ data: lines });
  });
};
