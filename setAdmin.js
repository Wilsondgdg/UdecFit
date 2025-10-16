// setAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // ruta a tu JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'kAiWeRtgi9g2g8Ap68MNnAZVQ322'; // <-- reemplaza con tu UID real

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log(`✅ Rol de administrador asignado a: ${uid}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error asignando el rol:', err);
    process.exit(1);
  });
