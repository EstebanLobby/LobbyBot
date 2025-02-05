const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

let client;
let qrCodeData = "";
let isConnected = false; // Estado de conexión

// Función para inicializar el cliente
function iniciarCliente() {
  console.log("🚀 Iniciando cliente de WhatsApp...");

  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  });

  // Evento para recibir el código QR
  client.on("qr", (qr) => {
    console.log("📱 Escanea este QR para conectar WhatsApp:");
    qrcode.generate(qr, { small: true });
    qrCodeData = qr;
    isConnected = false; // Asegurar que se muestre el QR
  });

  // Cliente listo
  client.on("ready", () => {
    console.log("✅ Cliente de WhatsApp listo para enviar mensajes");
    qrCodeData = "";
    isConnected = true;
  });

  // Cliente desconectado
  client.on("disconnected", async (reason) => {
    console.log("❌ Cliente desconectado. Razón:", reason);
    isConnected = false;

    try {
      // Cerrar Puppeteer correctamente antes de reiniciar
      if (client.pupBrowser) {
        console.log("🛑 Cerrando Puppeteer...");
        await client.pupBrowser.close();
      }

      // Eliminar la sesión para forzar nuevo QR
      const sessionPath = path.join(__dirname, ".wwebjs_auth");
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log("🗑️ Sesión eliminada correctamente.");
      }
    } catch (err) {
      console.error("❌ Error al cerrar Puppeteer o eliminar sesión:", err);
    }

    // Esperar 5 segundos antes de reiniciar
    console.log("🔄 Reiniciando cliente en 5 segundos...");
    setTimeout(iniciarCliente, 5000);
  });

  // Iniciar cliente
  client.initialize();
}

// 🔹 Función para obtener el QR
function getQR() {
  return qrCodeData;
}

// 🔹 Función para verificar el estado de conexión
function getEstado() {
  return isConnected;
}

// 🔹 Función para enviar mensajes
async function enviarMensaje(numero, mensaje) {
  try {
    const chatId = numero.includes("@c.us") ? numero : `${numero}@c.us`;
    await client.sendMessage(chatId, mensaje);
    return { success: true, message: `Mensaje enviado a ${numero}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Iniciar el cliente al cargar el servidor
iniciarCliente();

module.exports = { client, enviarMensaje, getQR, getEstado };
