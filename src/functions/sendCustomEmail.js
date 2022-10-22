import { addDoc, collection, getFirestore } from 'firebase/firestore';

export default async function sendCustomEmail(email, subject, body) {
  const colRef = collection(getFirestore(), 'email');
  const emailContent = {
    to: email,
    message: {
      subject: subject,
      text: body
    }
  }

  return await addDoc(colRef, emailContent);

}