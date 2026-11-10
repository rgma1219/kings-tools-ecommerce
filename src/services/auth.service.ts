import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import type { UserProfile, UserRole } from '../types';

function mapFirebaseError(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: unknown }).code);
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'El correo o la contraseña son incorrectos.';
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta registrada con este correo electrónico.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.';
      case 'auth/popup-closed-by-user':
        return 'Se cerró la ventana de inicio de sesión con Google antes de finalizar.';
      default:
        return 'Ocurrió un error de autenticación. Intentá nuevamente.';
    }
  }
  return 'Ocurrió un error inesperado. Intentá nuevamente.';
}

export async function getOrCreateUserProfile(
  firebaseUser: User,
  fallbackDisplayName?: string
): Promise<UserProfile> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    const createdAt =
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
    const role: UserRole = data.role === 'admin' ? 'admin' : 'customer';

    return {
      uid: firebaseUser.uid,
      email: String(data.email ?? firebaseUser.email ?? ''),
      displayName: String(
        data.displayName ?? firebaseUser.displayName ?? 'Usuario'
      ),
      role,
      createdAt,
    };
  }

  const displayName =
    fallbackDisplayName?.trim() ||
    firebaseUser.displayName ||
    firebaseUser.email?.split('@')[0] ||
    'Cliente';
  const email = firebaseUser.email ?? '';
  const defaultRole: UserRole = 'customer';

  await setDoc(userRef, {
    email,
    displayName,
    role: defaultRole,
    createdAt: serverTimestamp(),
  });

  return {
    uid: firebaseUser.uid,
    email,
    displayName,
    role: defaultRole,
    createdAt: new Date(),
  };
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<UserProfile> {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(credential.user, { displayName: displayName.trim() });
    return await getOrCreateUserProfile(credential.user, displayName);
  } catch (error: unknown) {
    throw new Error(mapFirebaseError(error));
  }
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserProfile> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return await getOrCreateUserProfile(credential.user);
  } catch (error: unknown) {
    throw new Error(mapFirebaseError(error));
  }
}

export async function loginWithGoogle(): Promise<UserProfile> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return await getOrCreateUserProfile(credential.user);
  } catch (error: unknown) {
    throw new Error(mapFirebaseError(error));
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    throw new Error(mapFirebaseError(error));
  }
}

export function subscribeToAuthChanges(
  onChange: (firebaseUser: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, onChange);
}

