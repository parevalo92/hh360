// Backend HH360 - Botón de pánico
// Recibe datos del formulario web y envía un correo de emergencia vía Gmail (SMTP)

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// ====== CONFIGURACIÓN (usar variables de entorno en producción) ======
const GMAIL_USER = process.env.GMAIL_USER || 'parevalo@hermanohispano.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // contraseña de aplicación (ver INSTRUCCIONES.md)
const EMAIL_DESTINO = process.env.EMAIL_DESTINO || 'parevalo@hermanohispano.com';
const PORT = process.env.PORT || 3000;

// Google Workspace usa el mismo servidor SMTP que Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

app.post('/api/sos', async (req, res) => {
  try {
    const { nombre, telefono, latitud, longitud, precision_metros, fecha_hora, mapa_url } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (nombre, teléfono).' });
    }

    const fechaLegible = fecha_hora
      ? new Date(fecha_hora).toLocaleString('es-SV', { timeZone: 'America/El_Salvador' })
      : new Date().toLocaleString('es-SV', { timeZone: 'America/El_Salvador' });

    const ubicacionHtml = mapa_url
      ? `<p><strong>Ubicación:</strong> <a href="${mapa_url}" target="_blank">${mapa_url}</a></p>
         <p><strong>Coordenadas:</strong> ${latitud}, ${longitud} (precisión ±${precision_metros}m)</p>`
      : `<p style="color:#C62828;"><strong>Ubicación:</strong> No disponible (el usuario no dio permiso o falló el GPS).</p>`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background:#C62828; color:white; padding:16px; border-radius:8px 8px 0 0;">
          <h2 style="margin:0;">🚨 ALERTA DE EMERGENCIA - HH360</h2>
        </div>
        <div style="border:1px solid #ddd; padding:20px; border-radius:0 0 8px 8px;">
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Teléfono:</strong> ${telefono}</p>
          <p><strong>Fecha y hora:</strong> ${fechaLegible}</p>
          ${ubicacionHtml}
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
          <p style="color:#888; font-size:12px;">Este correo fue generado automáticamente por el botón de pánico de HermanoHispano360. Actúa de inmediato según el protocolo de emergencia.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Alertas HH360" <${GMAIL_USER}>`,
      to: EMAIL_DESTINO,
      subject: `🚨 SOS - ${nombre} necesita ayuda urgente`,
      html: htmlBody
    });

    console.log(`[SOS enviado] ${nombre} - ${telefono} - ${fechaLegible}`);
    res.status(200).json({ ok: true, message: 'Alerta enviada correctamente.' });

  } catch (error) {
    console.error('Error enviando alerta SOS:', error);
    res.status(500).json({ error: 'No se pudo enviar la alerta.' });
  }
});

app.get('/', (req, res) => {
  res.send('HH360 SOS backend funcionando correctamente.');
});

app.listen(PORT, () => {
  console.log(`Servidor HH360 SOS corriendo en puerto ${PORT}`);
});
