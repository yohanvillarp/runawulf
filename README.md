# RUNAWULF 🐺  
Plataforma para la gestión sencilla de servidores.

---

## 📦 Instalación General

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/yohanvillarp/runawulf.git
cd runawulf
npm install
```


### 2️⃣ Instalación del Backend - servidor
```bash
cd backend
sudo chmod +x ./setup.sh
./setup.sh
```

### 3️⃣ Iniciar el backend en modo desarrollo
```bash
npm run dev
```

💡 Tip: Si quieres que el backend esté siempre activo incluso después de reiniciar el servidor, puedes convertirlo en un demonio.

#### 🔄 Convertir a demonio
```bash
sudo ./convert_to_daemon.sh
```

💻 Frontend (Cliente Web)
El frontend es la interfaz visual que permite administrar el servidor desde el navegador.

4️⃣ Instalar dependencias
```bash
cd frontend
npm install
```
5️⃣ Iniciar el cliente en modo desarrollo
```bash
npm run dev
```