import { Github } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InitialSetup() {

  const [form, setForm] = useState({
    ip: '',user: '',password: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const navigate = useNavigate();

  const socketRef = useRef<WebSocket | null>(null);

  // Verificar si ya esta configurado
  useEffect(() => {
    const isConfigured = localStorage.getItem('configured') === 'true'
    if (isConfigured) {
      navigate('/')
    }
  }, [navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar recarga del formulario
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`http://${form.ip}:4000/api/commands/verify-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: form.user,
          password: form.password
        })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('configured', 'true')
        setResult('✅ El usuario tiene permisos sudo');

        // Conectar al servidor WebSocket
        const socket = new WebSocket(`ws://${form.ip}:4000`);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log('Conectado al servidor WebSocket');
          socket.send('echo "Runawulf conectado correctamente"'); //test
        };

        socket.onmessage = (event) => {
          console.log('Mensaje recibido del servidor WebSocket:', event.data);
        };

        socket.onerror = (error) => {
          console.error('Error al conectar al servidor WebSocket:', error);
        };

        socket.onclose = () => {
          console.log('Conexión cerrada al servidor WebSocket');
        };

      };

        setTimeout(() => {
          navigate('/'); // Redirigir tras éxito
        }, 1000);
      } else {
        setResult(`❌ Error: ${data.error || 'Credenciales inválidas'}`);
      }
    } catch (error) {
      setResult('⚠️ No se pudo conectar con el servidor');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Configuraciones iniciales</h1>
          <p className="mt-2 text-gray-500">
            Bienvenido a <span className="font-semibold text-blue-600">Runawulf</span>, la herramienta de configuración de servidores.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Introduce los datos de conexión al servidor para continuar.
          </p>

          <div>
            <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-1">
              IP del servidor
            </label>
            <input
              type="text"
              name="ip"
              id="ip"
              value={form.ip}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="192.168.0.10"
              required
            />
          </div>

          <div className="bg-gray-100 rounded-lg p-4 space-y-2 text-sm text-gray-700">
            <p>
              Se requiere un usuario con permisos <code className="bg-gray-200 px-1 rounded">root</code> para comprobar la conexión.
            </p>
            <p>Tu servidor debe permitir acceso remoto.</p>
            <p>Si usas <code>iptables</code> o <code>ufw</code>, revisa estas guías:</p>
            <div className="flex gap-2 pt-2">
              <a href="#" className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition">Guía iptables</a>
              <a href="#" className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition">Guía ufw</a>
            </div>
          </div>

          <div className="pt-2 space-y-4">
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">Usuario de conexión</label>
              <input
                type="text"
                name="user"
                id="user"
                value={form.user}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="root"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña de conexión</label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {loading ? 'Conectando...' : 'Intentar conexión'}
          </button>

          {result && (
            <div className="text-center mt-2 text-sm text-gray-700">{result}</div>
          )}
        </div>

        <footer className="pt-4 flex justify-center text-gray-400 hover:text-black transition">
          <a
            href="https://github.com/yohanvillarp/runawulf"
            target="_blank"
            rel="noreferrer"
            aria-label="Ver repositorio en GitHub"
          >
            <Github />
          </a>
        </footer>
      </form>
    </main>
  );
}
