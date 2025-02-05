require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 🚀 1. Crear instancia de Express
const app = express();
const PORT = process.env.PORT || 5000;

// 🚀 2. Configurar middlewares
app.use(express.json());
app.use(cors());

// 🚀 3. Importar rutas (después de inicializar `app`)
const userRoutes = require("./routes/userRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/users", userRoutes);

// 🚀 4. Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🔥 MongoDB Atlas conectado"))
  .catch((err) => console.log(err));

// 🚀 5. Definir una ruta base para probar
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 🚀 6. Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
