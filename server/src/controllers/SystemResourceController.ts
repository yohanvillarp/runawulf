import { Request, Response } from "express";
import path from "path";
import { exec } from "child_process";
import { execFile } from "child_process";
import { ScriptExecutor } from "./ScriptExecutor";

// maneja las peticiones web
export class SystemResourceController {

    constructor() { }

    public createThing = async (req: Request, res: Response): Promise<Response> => {
        const { thing, params } = req.body;

        if (!this.isValidThing(thing)) {
            return res.status(400).json({
                error: 'Debe especificar un recurso válido'
            });
        }

        try {
            const output = await ScriptExecutor.create(thing, params);
            
            if (output.includes('DUPLICADA')) {
                return res.json({
                    status: 'duplicated',
                    message: 'Este recurso ya existe'
                });
            }
            
            // esto es exclusivo de un módulo, se está procediando a adaptarlo
            /*if( verifyDuplicated) {
                
            }
            */

            return res.status(201).json({
                status: 'ok',
                message: 'El recurso se creó correctamente.',
                output
            })

        } catch (error: any) {
            console.error(`Error al crear recurso ${thing}:`, error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    public deleteThing = async (req: Request, res: Response): Promise<Response> => {
        const { thing, params } = req.body;

        if (!this.isValidThing(thing)) {
            return res.status(400).json({
                error: 'Debe especificar un recurso válido'
            });
        }

        try {
            const output = await ScriptExecutor.delete(thing, params);
            return res.json({
                output: output.trim()
            })
        } catch (error: any) {
            console.error(`Error al eliminar recurso ${thing}:`, error)
            return res.status(500).json({ error: error.message });
        }
    };

    public getThings = async (req: Request, res: Response): Promise<Response> => {
        const thing = req.query.thing as string;

        if (!this.isValidThing(thing)) {
            return res.status(400).json({
                error: 'Debe especificar un recurso válido'
            });
        }

        try {
            const output = await ScriptExecutor.get(thing);
            const lines = output.split("\n").filter(Boolean);
            return res.json({
                data: lines
            })
        } catch (error: any) {
            console.error(`Error al traer recurso ${thing}:`, error)
            return res.status(500).json({
                error: error.message
            })
        }
    };

    public updateThing = async (req: Request, res: Response): Promise<Response> => {
        const { thing, params } = req.body;

        if (!this.isValidThing(thing)) {
            return res.status(400).json({
                error: 'Debe especificar un recurso válido'
            });
        }

        try {
            const output = await ScriptExecutor.update(thing, params);
            return res.json({
                output: output.trim()
            })
        } catch (error: any) {
            console.error(`Error al actualizar recurso ${thing}:`, error)
            return res.status(500).json({
                error: error.message
            })
        }
    };

    // Verifica si la 'thing' es valida
    private isValidThing(thing: string): boolean {
        return typeof thing === 'string' && thing.trim().length > 0;
    }
}