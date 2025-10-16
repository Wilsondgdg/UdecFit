// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const { Storage } = require('@google-cloud/storage');

admin.initializeApp();

const projectId =
  process.env.GCP_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  process.env.FUNCTIONS_EMULATOR_PROJECT_ID;

const bucketName = 'udecfit-firestore-backups';
const storage = new Storage();

async function getFirestoreClient() {
  const client = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/datastore',
      'https://www.googleapis.com/auth/cloud-platform',
    ],
  });
  return google.firestore({ version: 'v1', auth: client });
}

exports.crearBackup = functions.https.onCall(async (data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debe iniciar sesión.'
    );
  if (!context.auth.token || context.auth.token.role !== 'admin')
    throw new functions.https.HttpsError(
      'permission-denied',
      'Acceso denegado. Requiere rol admin.'
    );

  try {
    const firestore = await getFirestoreClient();
    const parent = `projects/${projectId}/databases/(default)`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputUriPrefix = `gs://${bucketName}/${timestamp}`;

    // ✅ Aquí usamos la API de Firestore Admin directamente
    const res = await firestore.projects.databases.exportDocuments({
      name: parent,
      requestBody: {
        outputUriPrefix,
        collectionIds: [], // si quieres exportar todo, déjalo vacío
      },
    });

    console.log('✅ Backup iniciado correctamente:', outputUriPrefix);
    return {
      message: 'Backup iniciado correctamente',
      path: outputUriPrefix,
      operation: res.data,
    };
  } catch (err) {
    console.error('❌ Error al crear backup:', err);
    throw new functions.https.HttpsError(
      'internal',
      'Error al crear el backup: ' + err.message
    );
  }
});

exports.restaurarBackup = functions.https.onCall(async (data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debe iniciar sesión.'
    );
  if (!context.auth.token || context.auth.token.role !== 'admin')
    throw new functions.https.HttpsError(
      'permission-denied',
      'Acceso denegado. Requiere rol admin.'
    );

  const inputUriPrefix = data?.path;
  if (!inputUriPrefix)
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requiere path del backup (inputUriPrefix).'
    );

  try {
    const firestore = await getFirestoreClient();
    const parent = `projects/${projectId}/databases/(default)`;

    const res = await firestore.projects.databases.importDocuments({
      name: parent,
      requestBody: {
        inputUriPrefix,
      },
    });

    console.log('✅ Restauración iniciada desde:', inputUriPrefix);
    return {
      message: 'Restauración iniciada correctamente',
      path: inputUriPrefix,
      operation: res.data,
    };
  } catch (err) {
    console.error('❌ Error al restaurar:', err);
    throw new functions.https.HttpsError(
      'internal',
      'Error al restaurar: ' + err.message
    );
  }
});

exports.listarBackups = functions.https.onCall(async (data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debe iniciar sesión.'
    );
  if (!context.auth.token || context.auth.token.role !== 'admin')
    throw new functions.https.HttpsError(
      'permission-denied',
      'Acceso denegado. Requiere rol admin.'
    );

  try {
    const [files] = await storage.bucket(bucketName).getFiles();
    const folders = new Set();
    files.forEach((f) => {
      const parts = f.name.split('/');
      if (parts.length) folders.add(parts[0]);
    });
    return { backups: Array.from(folders).sort().reverse() };
  } catch (err) {
    console.error('❌ Error listando backups:', err);
    throw new functions.https.HttpsError(
      'internal',
      'Error listando backups: ' + err.message
    );
  }
});
