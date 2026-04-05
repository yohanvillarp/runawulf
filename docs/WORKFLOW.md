# Git Workflow — Runawulf

Este documento describe la estrategia de trabajo con Git para el monorepo de Runawulf, que contiene el cliente (`client/`) y el servidor (`server/`).

---

## Estructura de Ramas

### Ramas principales

- `main`  
  Contiene la versión estable del proyecto. Solo recibe cambios desde `develop` cuando hay una versión lista para publicar.

- `develop`  
  Rama de desarrollo activo. Todas las ramas temporales se crean desde aquí y se integran aquí.

---

### Ramas temporales

Se crean desde `develop` y se eliminan después del merge.

| Tipo de tarea       | Prefijo        | Ejemplo                                  | Propósito                                        |
|---------------------|----------------|------------------------------------------|--------------------------------------------------|
| Funcionalidad       | `feature/`     | `feature/firewall-rule-crud`             | Añadir nuevas funcionalidades                    |
| Corrección de error | `fix/`         | `fix/server-websocket-memory-leak`       | Arreglar bugs o errores                          |
| Mejora visual       | `enhancement/` | `enhancement/monitoring-dashboard-ui`   | Cambios menores en UI o UX                       |
| Refactorización     | `refactor/`    | `refactor/client-fsd-structure`          | Reescritura de código sin cambiar lógica         |
| Hotfix urgente      | `hotfix/`      | `hotfix/crash-on-websocket-connect`      | Correcciones críticas directamente en producción |
| Pruebas e ideas     | `experiment/`  | `experiment/native-linux-ipc`            | Experimentación o pruebas sin compromiso         |

---

## Flujo de Trabajo

1. Asegúrate de estar en `develop` y tenerla actualizada:

```bash
git checkout develop
git pull origin develop
```

2. Crea una rama para tu tarea:

```bash
git checkout -b feature/nombre-de-tu-rama
```

3. Realiza tus cambios y haz commits con el formato indicado en la sección siguiente:

```bash
git add .
git commit -m "feat(client): mensaje breve"
```

4. Cuando termines, sube tu rama y abre un Pull Request hacia `develop`:

```bash
git push -u origin feature/nombre-de-tu-rama
```

Abre un Pull Request en GitHub desde tu rama hacia `develop`. No hagas merge directo sin PR.

5. Una vez integrado, elimina la rama local:

```bash
git checkout develop
git branch -d feature/nombre-de-tu-rama
```

6. Para publicar a producción (cuando la versión esté lista):

```bash
git checkout main
git merge develop
git push origin main
```

---

## Convención para Mensajes de Commits

Se usa una variante de [Conventional Commits](https://www.conventionalcommits.org):

```
<tipo>(<scope>): <mensaje breve en infinitivo>
```

El `scope` indica qué parte del monorepo se ve afectada.

### Scopes disponibles

| Scope    | Descripción                                      |
|----------|--------------------------------------------------|
| `client` | Cambios en el frontend React                     |
| `server` | Cambios en el backend Node.js                    |
| `root`   | Configuración raíz del monorepo (pnpm, scripts)  |
| `docs`   | Documentación                                    |
| `shared` | Código o tipos compartidos entre client y server |

### Tipos disponibles

| Tipo       | Uso                                      |
|------------|------------------------------------------|
| `feat`     | Nueva funcionalidad                      |
| `fix`      | Corrección de errores                    |
| `refactor` | Reestructuración sin cambiar lógica      |
| `style`    | Cambios visuales (CSS, UI)               |
| `docs`     | Cambios en la documentación              |
| `test`     | Pruebas añadidas o modificadas           |
| `chore`    | Mantenimiento, configuraciones, deps     |

### Ejemplos

```bash
git commit -m "feat(client): add firewall rule creation form"
git commit -m "fix(server): cleanup websocket listeners on disconnect"
git commit -m "refactor(client): migrate modules to FSD structure"
git commit -m "chore(root): migrate npm workspaces to pnpm"
git commit -m "docs(docs): update git workflow for monorepo"
git commit -m "style(client): update monitoring dashboard layout"
```

---

## Buenas Practicas

- Una rama por tarea específica. No acumules cambios no relacionados en la misma rama.
- Commits pequeños y frecuentes. Es más fácil revertir un cambio pequeño que uno grande.
- Nombra las ramas con palabras clave descriptivas separadas por guiones.
- Elimina las ramas que ya se integraron para mantener el repositorio limpio.
- Usa `git pull --rebase` en lugar de `git pull` para evitar commits de merge innecesarios.
- No hagas commits directamente en `main` ni en `develop`.
- Revisa el diff antes de cada commit para asegurarte de que solo incluyes lo que quieres.