import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export async function login(email, password) {
    const uc = await signInWithEmailAndPassword(getAuth(), email, password);

    return uc.user;
}

export async function signUp(email, password) {
    const uc = await createUserWithEmailAndPassword(getAuth(), email, password);

    return uc.user;
}

export async function logOut() {
    return getAuth().signOut();
}
