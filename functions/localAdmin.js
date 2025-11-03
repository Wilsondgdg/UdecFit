// functions/localAdmin.js
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

if (!admin.apps.length) {
  try {
    // ✅ Usa path.resolve() para evitar errores con los backslashes de Windows
    const localPath = path.resolve("C:/Users/higue/OneDrive/Documentos/credenciales_udecfit/serviceAccountKey.json");

    if (fs.existsSync(localPath)) {
      const serviceAccount = require(localPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin inicializado con credenciales locales.");
    } else {
      // 🔹 Si no se encuentra el archivo, usa las credenciales del entorno (para Cloud Functions)
      admin.initializeApp();
      console.log("🌐 Firebase Admin inicializado con credenciales del entorno (GCP).");
    }
  } catch (err) {
    console.error("⚠️ Error al inicializar Firebase Admin:", err);
    admin.initializeApp();
  }
}

module.exports = admin;
