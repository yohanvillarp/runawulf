import { Request, Response } from 'express'

export const getServerStatus = (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is up and running' })
}