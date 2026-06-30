# HH360 - Botón de pánico — Guía de despliegue

Este paquete tiene dos partes:

1. **`index.html`** → la página web que ve el cliente (formulario SOS)
2. **`backend/`** → el servidor que recibe los datos y envía el correo

**Tu correo configurado:** `parevalo@hermanohispano.com` (envía Y recibe las alertas)

---

## PASO 1: Crear la contraseña de aplicación de Google Workspace

Tu correo usa Google Workspace, así que el proceso es idéntico a Gmail.

1. Inicia sesión en https://myaccount.google.com con `parevalo@hermanohispano.com`
2. Ve a **Seguridad** → activa la **verificación en 2 pasos** si no la tienes
3. Ve a https://myaccount.google.com/apppasswords
4. En "Seleccionar app" elige **Correo**, en "Seleccionar dispositivo" elige **Otro** y escribe `HH360 SOS`
5. Haz clic en **Generar** — Google te dará una contraseña de 16 caracteres (ej: `abcd efgh ijkl mnop`)
6. **Cópiala y guárdala** — solo se muestra una vez

> ⚠️ Si no ves la opción de contraseñas de aplicación, tu administrador de Google Workspace puede tenerla desactivada. En ese caso contáctame y usamos otro método.

---

## PASO 2: Desplegar el backend en Render (gratis)

1. Ve a https://render.com y crea una cuenta gratis
2. Crea un repositorio en https://github.com y sube los archivos de la carpeta `backend/` (`server.js` y `package.json`)
3. En Render: **New + → Web Service** → conecta tu repositorio
4. Configuración:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. En **Environment Variables** agrega UNA sola variable:
   - `GMAIL_APP_PASSWORD` = la contraseña de 16 caracteres del paso 1 (sin espacios)
   
   *(El correo `parevalo@hermanohispano.com` ya está escrito directamente en el código)*

6. Clic en **Create Web Service** — en 2-3 minutos Render te da una URL como:
   `https://hh360-sos.onrender.com`

> ⚠️ **Plan gratuito vs. pagado:** el plan gratis "duerme" el servidor tras 15 min sin uso y tarda ~30 segundos en despertar. Para un botón de pánico real, el plan de $7/mes lo mantiene siempre activo. Muy recomendado.

---

## PASO 3: Conectar el frontend con el backend

1. Abre `index.html` en cualquier editor de texto (Notepad, VS Code, etc.)
2. Busca esta línea cerca del final del archivo:
   ```js
   const BACKEND_URL = "https://TU-BACKEND.onrender.com/api/sos";
   ```
3. Reemplaza la URL con la que te dio Render + `/api/sos`:
   ```js
   const BACKEND_URL = "https://hh360-sos.onrender.com/api/sos";
   ```
4. Guarda el archivo

---

## PASO 4: Publicar el frontend (gratis en Netlify — más fácil)

1. Ve a https://app.netlify.com/drop
2. Arrastra tu archivo `index.html` a la pantalla
3. Netlify te da al instante una URL pública como `https://hh360-sos.netlify.app`
4. (Opcional) En Netlify puedes cambiar el nombre del sitio a algo más corto

---

## PASO 5: Probar antes de compartir con clientes

1. Abre la URL en tu **teléfono** (no computadora — el GPS funciona mejor en móvil)
2. Cuando el navegador pida permiso de ubicación → **Permitir**
3. Llena nombre y teléfono de prueba
4. Presiona el botón rojo
5. Revisa `parevalo@hermanohispano.com` — el correo debe llegar en segundos con:
   - Nombre y teléfono
   - Link de Google Maps con tu ubicación exacta
   - Coordenadas y precisión en metros
   - Fecha y hora

---

## Cómo compartir con tus clientes HH360

Una vez probado, tendrás una URL fija. Opciones para distribuirla:

- **WhatsApp:** manda el link a cada cliente y pídeles que lo guarden como contacto favorito o acceso directo en pantalla de inicio
- **Tarjeta física con QR:** imprime una tarjeta de bienvenida con el código QR del link
- **Acceso directo en iPhone:** abrir link en Safari → compartir → "Agregar a pantalla de inicio"
- **Acceso directo en Android:** abrir link en Chrome → menú → "Añadir a pantalla de inicio"

Avísame si quieres que genere:
- El código QR para imprimir
- Una versión con el logo y colores de HH360
- Alerta simultánea por WhatsApp Business (además del correo)
