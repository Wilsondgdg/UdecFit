const functions = require("firebase-functions");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
let admin;

// 🔹 Detectar entorno
if (process.env.FUNCTIONS_EMULATOR || process.env.GCLOUD_PROJECT === undefined) {
  admin = require("./localAdmin");
  console.log("✅ Modo local: inicializado con credenciales personalizadas.");
} else {
  admin = require("firebase-admin");
  if (!admin.apps.length) {
    admin.initializeApp();
    console.log("🌐 Modo Cloud: inicializado con credenciales del entorno.");
  }
}

const db = admin.firestore();
const storage = new Storage();
const BUCKET_NAME = "udecfit-firestore-backups";

/**
 * 🔹 CREAR BACKUP
 */
exports.crearBackup = functions.https.onRequest({ region: "us-central1" }, async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido. Usa POST." });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFolder = `backups/${timestamp}`;
    const bucket = storage.bucket(BUCKET_NAME);

    console.log(`🗄️ Iniciando backup en: ${backupFolder}`);

    const collections = await db.listCollections();
    for (const collection of collections) {
      const snapshot = await collection.get();
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      const file = bucket.file(`${backupFolder}/${collection.id}.json`);
      await file.save(JSON.stringify(docs, null, 2));
      console.log(`✅ Backup guardado: ${collection.id}.json`);
    }

    res.json({
      message: "✅ Backup completado correctamente.",
      folder: backupFolder,
    });
  } catch (error) {
    console.error("❌ Error creando el backup:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔹 RESTAURAR BACKUP
 */
exports.restaurarBackup = functions.https.onRequest({ region: "us-central1" }, async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido. Usa POST." });
    }

    const carpeta = req.body?.carpeta || req.query?.carpeta;
    if (!carpeta) {
      return res.status(400).json({ error: "Falta el parámetro 'carpeta' en body o query." });
    }

    const bucket = storage.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ prefix: `backups/${carpeta}/` });

    if (files.length === 0) {
      return res.status(404).json({ error: `No se encontraron archivos en backups/${carpeta}/` });
    }

    console.log(`♻️ Restaurando backup desde: ${carpeta}`);

    for (const file of files) {
      const [content] = await file.download();
      const docs = JSON.parse(content.toString());
      const collectionName = path.basename(file.name, ".json");

      const batch = db.batch();
      const colRef = db.collection(collectionName);

      docs.forEach((doc) => {
        const docRef = colRef.doc(doc.id);
        batch.set(docRef, doc.data);
      });

      await batch.commit();
      console.log(`✅ Restaurada colección: ${collectionName}`);
    }

    res.json({ message: `✅ Restauración completada correctamente.`, folder: carpeta });
  } catch (error) {
    console.error("❌ Error restaurando backup:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔹 LISTAR BACKUPS
 */
exports.listarBackups = functions.https.onRequest({ region: "us-central1" }, async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ prefix: "backups/" });

    const folders = [...new Set(files.map((f) => f.name.split("/")[1]))].filter(Boolean);

    res.json({
      message: "✅ Lista de backups obtenida.",
      backups: folders.sort().reverse(),
    });
  } catch (error) {
    console.error("❌ Error listando backups:", error);
    res.status(500).json({ error: error.message });
  }
});
