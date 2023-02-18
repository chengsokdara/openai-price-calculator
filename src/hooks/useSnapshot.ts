import {
  onSnapshot,
  type DocumentData,
  type Query,
  type Unsubscribe,
} from 'firebase/firestore'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { readFirestoreDocuments } from 'src/utils/firestore'

export type TUseSnapshotReturn<T> = {
  error?: TErrorCode
  loading: boolean
  rows: T[]
  setError: Dispatch<SetStateAction<TErrorCode | undefined>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setRows: Dispatch<SetStateAction<T[]>>
  subscribe: (query: Query<DocumentData>) => Unsubscribe
}

export const useSnapshot = <
  T extends TRow & TDataCommon
>(): TUseSnapshotReturn<T> => {
  const [error, setError] = useState<TErrorCode | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [rows, setRows] = useState<T[]>([])

  const subscribe = (query: Query<DocumentData>): Unsubscribe => {
    return onSnapshot(
      query,
      (querySnapshot) => {
        const datasets = readFirestoreDocuments<T>(querySnapshot)
        setError(datasets.length === 0 ? 404 : 0)
        setRows(datasets)
        setLoading(false)
      },
      (err) => {
        console.error(JSON.stringify(err))
        if (err.code === 'permission-denied') {
          setError(403)
        } else {
          setError(500)
        }
        setRows([])
        setLoading(false)
      }
    )
  }

  return {
    error,
    loading,
    rows,
    setError,
    setLoading,
    setRows,
    subscribe,
  }
}
