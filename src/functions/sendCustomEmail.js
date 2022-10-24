import { addDoc, collection, getFirestore } from 'firebase/firestore';

export default async function sendCustomEmail(email, userName, body, templateName) {
  const colRef = collection(getFirestore(), 'email');
  const emailContent = {
    to: email,
    template: {
      name: templateName,
      data: {
        username: userName,
        message: body,
      },
    }
  }

  return await addDoc(colRef, emailContent);

}