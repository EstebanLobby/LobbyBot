const express = require("express");
const {
  client,
  enviarMensaje,
  getQR,
  getEstado,
} = require("../whatsappService");
const QRCode = require("qrcode");

const router = express.Router();

// 🔹 Ruta para obtener el QR en formato imagen
router.get("/qr", async (req, res) => {
  const qrCodeData = getQR();

  if (!qrCodeData) {
    return res
      .status(400)
      .json({ error: "QR aún no disponible. Espera un momento." });
  }

  try {
    // Generar imagen QR
    const qrImage = await QRCode.toDataURL(qrCodeData);
    res.json({ qr: qrImage });
  } catch (err) {
    res.status(500).json({ error: "Error generando QR" });
  }
});

// 🔹 Ruta para enviar un mensaje de WhatsApp
router.post("/send", async (req, res) => {
  const { numero, mensaje } = req.body;

  if (!numero || !mensaje) {
    return res.status(400).json({ error: "Número y mensaje son requeridos" });
  }

  const respuesta = await enviarMensaje(numero, mensaje);
  if (respuesta.success) {
    res.json({ success: true, message: `Mensaje enviado a ${numero}` });
  } else {
    res.status(500).json({ success: false, error: respuesta.error });
  }
});

// Ruta para verificar el estado de conexión
router.get("/status", async (req, res) => {
  try {
    res.json({ connected: getEstado() });
  } catch (error) {
    res
      .status(500)
      .json({ connected: false, error: "No se pudo obtener el estado." });
  }
});

module.exports = router;
