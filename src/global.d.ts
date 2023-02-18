type TDocumentReference = import('firebase/firestore').DocumentReference

type TErrorCode = 400 | 401 | 403 | 404 | 500 | number

type TItem = {
  key: string
  label: string
}

type TColumn = {
  [key: string]: any
} & TItem

type TRow = {
  [key: string]: any
  key: string
  ref?: TDocumentReference
}
