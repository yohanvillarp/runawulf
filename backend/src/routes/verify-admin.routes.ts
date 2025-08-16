import { Router } from 'express'
import { spawn } from 'child_process'
import path from 'path'

const router = Router()

router.post('/verify-admin', (req, res) => {
  const { user, password } = req.body

  if (!user || !password) {
    return res.status(400).json({ error: 'Usuario o contraseña faltantes' })
  }

  const scriptPath = path.resolve('./scripts/validate_user.sh')
  const bash = spawn('bash', [scriptPath, user])

  let stdout = ''
  let stderr = ''

  // ⬇️ enviamos la contraseña al script, que la leerá con read -r
  bash.stdin.write(`${password}\n`)
  bash.stdin.end()

  bash.stdout.on('data', (d) => (stdout += d.toString()))
  bash.stderr.on('data', (d) => (stderr += d.toString()))

  bash.on('close', (code) => {
    const result = stdout.trim()
    console.log('SCRIPT STDOUT:', result)
    console.log('SCRIPT STDERR:', stderr)

    if (result === 'VALID') {
      return res.json({ success: true })
    } else if (result === 'INVALID_USER') {
      return res.status(404).json({ error: 'Usuario no existe' })
    } else {
      return res.status(401).json({ error: 'Credenciales inválidas o sin permisos sudo' })
    }
  })
})

export default router
