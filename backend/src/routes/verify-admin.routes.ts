import { Router } from 'express'
import { exec } from 'child_process'

const router = Router()

// Verificar si el usuario tiene permisos sudo
router.post('/verify-admin', (req, res) => {
  const { user, password } = req.body

  if (!user || !password) {
    return res.status(400).json({ error: 'Usuario o contraseña faltantes' })
  }

  // Intenta ejecutar 'whoami' como el usuario usando sudo
  const command = `echo '${password}' | sudo -S -u ${user} whoami`

  exec(command, (err, stdout, stderr) => {
    if (err || stderr) {
      console.error('Error:', err || stderr)
      return res.status(401).json({ error: 'Credenciales inválidas o sin permisos sudo' })
    }

    const result = stdout.trim()

    if (result === user || result === 'root') {
      return res.json({ success: true })
    }

    return res.status(403).json({ error: 'No tiene permisos sudo' })
  })
})


export default router