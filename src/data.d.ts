type TDocumentData = import('firebase/firestore').DocumentData
type TDocumentReference = import('firebase/firestore').DocumentReference
type TFieldValue = import('firebase/firestore').FieldValue

// Common type
type TDataCommon = {
  // optional fields
  createdAt?: TFieldValue
  updatedAt?: TFieldValue
  userId?: string | null // user ID
  userRef?: TDocumentReference | null // user document reference
} & TDocumentData

type TSubDataCommon = {
  parentId?: string // parent document ID
  parentRef?: TDocumentReference // parent document reference
}

// Data type
type TDataset = {
  // required fields
  name: string
} & TDataCommon

type TDatasetData = {
  // required fields
  prompt: string
  completion: string
} & TDataCommon &
  TSubDataCommon

// Firebase Authentication User Data
type TAuthUser = {
  uid: string
  email: string
  emailVerified: boolean
  isAnonymous: boolean
  providerData: TAuthProviderData[]
  stsTokenManager: TAuthSTSTokenManager
  createdAt: string
  lastLoginAt: string
  apiKey: string
  appName: string
}

type TAuthProviderData = {
  providerId: string
  uid: string
  displayName: string | null
  email: string
  phoneNumber: string | null
  photoURL: string | null
}

type TAuthSTSTokenManager = {
  refreshToken: string
  accessToken: string
  expirationTime: number
}
