import {
  collection,
  doc,
  serverTimestamp,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
} from 'firebase/firestore'
import { auth, firestore } from 'src/firebase'

/**
 * Transform Firestore DocumentSnapshot into preferred type T
 * @param ds Firestore DocumentSnapshot
 * @returns object data in type T
 */
export const readFirestoreDocument = <T extends TRow & TDataCommon>(
  ds: DocumentSnapshot<DocumentData>
) => {
  return {
    ...(ds.data() as T),
    key: ds.id,
    ref: ds.ref,
  }
}

/**
 * Transform Firestore QuerySnapshot into preferred type Array<T>
 * @param qs Firestore QuerySnapshot
 * @returns array of object data in type Array<T>
 */
export const readFirestoreDocuments = <T extends TRow & TDataCommon>(
  qs: QuerySnapshot<DocumentData>
) => {
  return qs.docs.map((ds: QueryDocumentSnapshot<DocumentData>) =>
    readFirestoreDocument<T>(ds)
  )
}

export type TMutateFirestoreDataOptions = {
  admin?: boolean
}

/**
 * Get common data for Firestore addDoc or setDoc
 * @param data object in type T
 * @returns common data with createdAt and updatedAt
 */
export const createFirestoreData = <T extends TDataCommon>(
  data: T,
  options?: TMutateFirestoreDataOptions
) => {
  const createData = {
    ...data,
    ...withUserData(options?.admin),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  return createData
}

/**
 * Get common data for Firestore setDoc
 * @returns common data with updatedAt
 */
export const updateFirestoreData = <T extends TDataCommon>(
  data: T,
  options?: TMutateFirestoreDataOptions
) => {
  const updateData = {
    ...data,
    ...withUserData(options?.admin),
    updatedAt: serverTimestamp(),
  }
  return updateData
}

/**
 * Include userId and user ref with return data
 * @param admin if user has admin role
 * @returns data with userId and userRef
 */
const withUserData = (admin?: boolean) => {
  const withUserData: TDataCommon = {}
  if (auth.currentUser) {
    const userRef = doc(collection(firestore, 'users'), auth.currentUser.uid)
    withUserData.userId = admin ? 'public' : auth.currentUser.uid
    withUserData.userRef = admin ? null : userRef
  }
  return withUserData
}
