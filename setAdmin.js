// setAdmin.js
const admin = require('firebase-admin');
const path = require('path');

// Ruta fuera del proyecto 
const serviceAccountPath = path.resolve('C:/credenciales_udecfit/serviceAccountKey.json');

// Inicializar Firebase Admin con la clave
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath))
});

const uid = 'kAiWeRtgi9g2g8Ap68MNnAZVQ322';

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log(`✅ Rol de administrador asignado correctamente al usuario con UID: ${uid}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error asignando el rol:', err);
    process.exit(1);
  });
