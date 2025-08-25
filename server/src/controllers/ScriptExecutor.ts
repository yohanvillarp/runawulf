import { exec, execFile } from 'child_process';
import path from 'path';
import ReturnScript from '../types/returnScript';

// ejecuta comandos
export class ScriptExecutor {
    // Método privado para manejar la ejecución de scripts con execFile
    private static async runExecFile(command: string, args: string[]): Promise<ReturnScript> {
        return new Promise((resolve, reject) => {
            execFile('sudo', [command, ...args], (error, stdout, stderr) => {
                if (error) {
                    console.log("hay un código de error: "+stdout)
                    const errorResult = JSON.parse(stdout);
                    reject(errorResult);
                } else {
                    const result = JSON.parse(stdout);
                    resolve(result);
                }
            });
        });
    }

    // Método privado para manejar la ejecución de scripts con exec
    private static async runExec(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(stderr || error.message);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    // Método público para ejecutar un script de creación
    public static async create(thing: string, params: string[]): Promise<ReturnScript> {
        const scriptPath = path.join(__dirname, '../../scripts/create', `create_${thing}.sh`);
        return this.runExecFile(scriptPath, params);
    }
    
    // Método público para ejecutar un script de borrado
    public static async delete(thing: string, params: string[]): Promise<ReturnScript> {
        const scriptPath = path.join(__dirname, '../../scripts/delete', `delete_${thing}.sh`);
        return this.runExecFile(scriptPath, params);
    }

    // Método público para obtener información del sistema
    public static async get(thing: string): Promise<string> {
        const scriptPath = path.join(__dirname, '../../scripts/get/get.sh');
        const cmd = `bash "${scriptPath}" "${thing}"`;
        return this.runExec(cmd);
    }

    // Método público para actualizar recursos
    public static async update(thing: string, params: string[]): Promise<string> {
        const scriptPath = path.join(__dirname, '../../scripts/update', `${thing}.sh`);
        const cmd = `sudo bash ${scriptPath} ${params?.join(" ") ?? ""}`;
        return this.runExec(cmd);
    }
}