import { Github } from 'lucide-react';
import { useState } from 'react';
import { useWebSocket } from '@/shared/hooks/useWebSocket'
import logo from '@/assets/runawulf.svg';
import RunesBackground from '@/shared/components/RunasBackground';
import { Server, User, Lock, Crown } from 'lucide-react';

export default function InitialSetup() {
  const [form, setForm] = useState({ ip: '', user: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const { connect } = useWebSocket();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const { success, error } = await verifyAdminCredentials(form);

    if (success) {
      localStorage.setItem('connected', 'true');
      setResult('✅ El usuario tiene permisos sudo');
      //guarda ip y usuario
      localStorage.setItem('ipServer', form.ip);
      localStorage.setItem('userServer', form.user);
      connect(form.ip)
    } else {
      setResult(`❌ Error: ${error || 'Credenciales inválidas'}`);
    }
    setLoading(false);
  };

  return (
    <>
      <RunesBackground />
      <main className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
          <FormHeader />
          <FormFields form={form} handleChange={handleChange} />
          <SubmitButton loading={loading} />
          {result && <ResultMessage result={result} />}
          <FormFooter />
        </form>
      </main>
    </>
  );
}

async function verifyAdminCredentials(form: { ip: string; user: string; password: string }) {
  try {
    const res = await fetch(`http://${form.ip}:4000/api/admin/verify-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: form.user, password: form.password }),
    });
    const data = await res.json();
    return { success: data.success, error: data.error };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'No se pudo conectar con el servidor' };
  }
}



function FormHeader() {
  return (
    <div className="text-center">
      <img
        src={logo}
        alt="Runawulf logo"
        className="mx-auto w-20 h-20 mb-2"
      />
      <h1 className="text-3xl font-bold text-gray-800">
        Configuraciones iniciales
      </h1>
      <p className="mt-2 text-gray-500">
        Bienvenido a <span className="font-semibold text-blue-600">Runawulf</span>, la herramienta de configuración de servidores.
      </p>
    </div>
  );
}

function FormFields({
  form,
  handleChange,
}: {
  form: { ip: string; user: string; password: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 text-center">
        Introduce los datos de conexión al servidor para continuar.
      </p>

      {/* Campo IP */}
      <div>
        <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-1">
          IP del servidor
        </label>
        <div className="relative">
          <Server className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            name="ip"
            id="ip"
            value={form.ip}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="192.168.0.10"
            required
          />
        </div>
      </div>

      <InfoBox />

      {/* Campo Usuario */}
      <div className="pt-2">
        <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
          Usuario de conexión
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            name="user"
            id="user"
            value={form.user}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="root"
            required
          />
        </div>
      </div>

      {/* Campo Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña de conexión
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
}


function InfoBox() {
  return (
    <div className="bg-gray-100 rounded-lg p-4 space-y-3 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <span>
          Se requiere un usuario con <strong>permisos sudo</strong> para comprobar la conexión.
          Esto permite ejecutar comandos administrativos sin usar directamente root.
        </span>
      </div>
      <p>Tu servidor debe permitir acceso remoto para este usuario.</p>
      <p>Si aún no tienes un usuario sudo, sigue esta guía para crearlo:</p>
      <div className="flex justify-center pt-2">
        <a
          href="https://example.com/crear-usuario-sudo"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          <Crown size={16} />
          Usuarios Sudoers
        </a>
      </div>
    </div>
  );
}


function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
    >
      {loading ? 'Conectando...' : 'Intentar conexión'}
    </button>
  );
}

function ResultMessage({ result }: { result: string }) {
  return <div className="text-center mt-2 text-sm text-gray-700">{result}</div>;
}

function FormFooter() {
  return (
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
  );
}