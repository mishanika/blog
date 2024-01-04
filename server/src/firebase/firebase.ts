import { getFirestore } from "firebase-admin/firestore";
import { ServiceAccount } from "firebase-admin";
import adm from "firebase-admin";
import credentials from "./firebase-credentials.json";

const cred = credentials as string | ServiceAccount;

export const admin = adm.initializeApp({
  credential: adm.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // replace `\` and `n` character pairs w/ single `\n` character
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

export const database = getFirestore();
export const bucket = admin.storage().bucket("gs://blog-f1daa.appspot.com/");
