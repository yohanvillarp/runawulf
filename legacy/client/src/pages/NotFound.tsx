import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">Page not found</h1>
      <img
        src="/404.svg"
        alt="404 Not Found"
        className="w-64 h-64 mb-6"
      />
      <p className="text-gray-600 mb-1">
        Verifica si realmente existe la ruta que has solicitado.
      </p>
      <p className="text-gray-600 mb-6">
        Si el problema persiste, contacta con el administrador.
      </p>
      <Link to="/">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Volver al inicio
        </button>
      </Link>
    </div>
  );
}

export default NotFound;
