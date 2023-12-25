import { getFirestore } from "firebase-admin/firestore";
import { ServiceAccount } from "firebase-admin";
import adm from "firebase-admin";
import credentials from "./firebase-credentials.json";

const cred = credentials as string | ServiceAccount;

export const admin = adm.initializeApp({
  credential: adm.credential.cert(cred),
});

export const database = getFirestore();
export const bucket = admin.storage().bucket("gs://blog-f1daa.appspot.com/");
