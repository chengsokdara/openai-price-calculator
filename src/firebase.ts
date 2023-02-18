import { initializeApp } from 'firebase/app'
import { getAnalytics, setAnalyticsCollectionEnabled } from 'firebase/analytics'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  CACHE_SIZE_UNLIMITED,
  // clearIndexedDbPersistence,
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  initializeFirestore,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
if (import.meta.env.DEV) {
  setAnalyticsCollectionEnabled(analytics, false)
}
const auth = getAuth(app)
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099')
}
const firestore = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})
// Uncomment to clear persistence data
// clearIndexedDbPersistence(firestore)
//   .then(() => {
//     console.log('persistence data cleared!')
//   })
//   .catch((err) => {
//     console.error(err)
//   })
if (import.meta.env.DEV) {
  connectFirestoreEmulator(firestore, 'localhost', 8080)
}
enableIndexedDbPersistence(firestore).catch((err) => {
  console.log(err.code, err)
})

export { app, analytics, auth, firestore }
