import admin from "firebase-admin";

const credential = JSON.parse(
  Buffer.from(`${process.env.FIREBASE_ADMIN_CREDENTIALS}`, "base64").toString()
);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(credential),
    });
  } catch (error) {
    console.log("Firebase admin initialization error");
  }
}
export default admin.firestore();
