# 🧠 Git Workflow para Proyecto React

Este documento describe una estrategia clara y sencilla para trabajar con Git en proyectos Reac.

---

## 📁 Estructura de Ramas

Organizamos el repositorio en ramas principales y ramas temporales según el tipo de tarea.

### Ramas principales

- `main`:  
  Contiene la versión **estable y en producción** del proyecto.

- `develop`:  
  Es la rama de desarrollo activo. Desde aquí se crean ramas para nuevas funcionalidades o correcciones.

---

### Ramas temporales (desde `develop`)

Estas ramas se crean temporalmente y se eliminan después de hacer *merge*:

| Tipo de tarea      | Prefijo        | Ejemplo                          | Propósito                               |
|--------------------|----------------|----------------------------------|-----------------------------------------|
| Funcionalidad      | `feature/`     | `feature/login-form`             | Añadir nuevas funcionalidades           |
| Corrección de error| `fix/`         | `fix/navbar-scroll`              | Arreglar bugs o errores                 |
| Mejora visual      | `enhancement/` | `enhancement/improve-sidebar`    | Cambios menores en UI o UX             |
| Refactorización    | `refactor/`    | `refactor/use-hooks`             | Reescritura de código sin cambiar lógica |
| Hotfix (urgente)   | `hotfix/`      | `hotfix/crash-on-load`           | Correcciones críticas directamente en producción |
| Pruebas/Ideas      | `experiment/`  | `experiment/theme-test`          | Experimentación o pruebas               |

---

## ✅ Flujo de Trabajo

1. Desde `develop`, crea una nueva rama:
   ```bash
   git checkout develop
   git checkout -b feature/nombre-de-tu-rama
   ```

2. Realiza tus cambios y haz commits con el formato adecuado:
   ```bash
   git add .
   git commit -m "feat(nombre): mensaje breve"
   ```

3. Cuando termines, integra tu rama a `develop`:
   ```bash
   git checkout develop
   git merge feature/nombre-de-tu-rama
   git branch -d feature/nombre-de-tu-rama
   ```

4. Cuando estés listo para publicar:
   ```bash
   git checkout main
   git merge develop
   ```

---

## 📝 Convención para Mensajes de Commits

Usamos una variante simple de [Conventional Commits](https://www.conventionalcommits.org):

```
<tipo>(<área>): <mensaje breve>
```

### Tipos disponibles

| Tipo     | Uso                                     |
|----------|-----------------------------------------|
| `feat`   | Nueva funcionalidad                     |
| `fix`    | Corrección de errores                   |
| `refactor` | Reestructuración sin cambiar lógica  |
| `style`  | Cambios visuales (CSS, UI)              |
| `docs`   | Cambios o añadidos en la documentación  |
| `test`   | Pruebas añadidas o modificadas          |
| `chore`  | Tareas de mantenimiento o configuraciones |

### Ejemplos:

```bash
git commit -m "feat(auth): add login form validation"
git commit -m "fix(navbar): fix sticky scroll issue"
git commit -m "style(button): update color scheme"
git commit -m "docs(readme): add installation steps"
git commit -m "refactor(context): replace redux with context api"
```

---

## 💡 Buenas Prácticas

- Usa ramas **por tarea específica**.
- Haz **commits pequeños y frecuentes**.
- Nombra tus ramas con palabras clave legibles y separadas por guiones.
- Borra ramas que ya se integraron (`git branch -d`).
- Usa `git pull --rebase` para evitar commits innecesarios.
- Documenta bien cada cambio que hagas.

---