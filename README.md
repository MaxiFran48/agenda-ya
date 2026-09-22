# Agenda Ya - Sistema de Turnos

Este proyecto es una aplicación web construida con [Next.js](https://nextjs.org) (React) para la gestión de turnos.

## Requisitos Previos

- Node.js instalado (recomendado v18 o superior).
- Un gestor de paquetes como `npm` o `pnpm`.
 
## Cómo levantar el frontend localmente

1. Abre una terminal y sitúate en la raíz del proyecto.
2. Instala las dependencias del proyecto ejecutando:
   ```bash
   npm install
   # o bien: pnpm install
   ```
3. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   # o bien: pnpm dev
   ```
4. Abre tu navegador e ingresa a [http://localhost:3000](http://localhost:3000).

---

## Ejecución de Pruebas Automatizadas

El proyecto cuenta con dos tipos de pruebas: Pruebas Unitarias/Lógica de Negocio y Pruebas End-to-End (E2E).

### 1. Pruebas Unitarias (Lógica de Negocio)
Se utilizan **Jest** para verificar la lógica de negocio. Estas pruebas se encuentran en la carpeta `__tests__/` (equivalente a la carpeta `tests/` solicitada).

Para ejecutarlas, corre el siguiente comando en la terminal:
```bash
npm run test
```

### 2. Pruebas E2E (Simulación de Usuario)
Se utiliza **Cypress** para probar los flujos principales en el navegador. Las pruebas están ubicadas en `cypress/e2e/`.

- **Para ejecutar Cypress en modo Interactivo (con interfaz gráfica):**
  Abre una terminal paralela a la de `npm run dev` y ejecuta:
  ```bash
  npm run cypress:open
  ```
  Esto abrirá la ventana de Cypress donde podrás elegir qué test correr y ver cómo interactúa visualmente con la app.

- **Para ejecutar todos los tests E2E en modo Headless (oculto en consola):**
  Este es el modo ideal para integración continua:
  ```bash
  npm run cypress:run
  ```

---
*Nota sobre la estructura del proyecto:* Al utilizar Next.js, el código del frontend y la lógica de la interfaz reside en `app/` y `components/`, mientras que la lógica de negocio se ubica en `services/`. Esta estructura es más moderna y escalable, cumpliendo íntegramente con los objetivos propuestos para la división de responsabilidades.
