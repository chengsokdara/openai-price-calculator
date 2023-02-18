import type { User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import { auth, firestore } from 'src/firebase'
import { readFirestoreDocument } from 'src/utils/firestore'
import { useLocation } from 'wouter'

export type TUser = {
  email: string
  uid: string
  admin?: boolean
} & TDocumentData

export type TUserRow = TUser & TRow

export type TUserValue = { admin: boolean } & User

export const UserContext = createContext<TUserRow | undefined | null>(undefined)

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [, navigate] = useLocation()
  const [authState, setAuthState] = useState<User | null>(null)
  const [user, setUser] = useState<TUserRow | undefined | null>(undefined)

  useEffect(() => {
    if (authState) {
      const docRef = doc(firestore, 'users', authState.uid)
      const unsubscribe = onSnapshot(
        docRef,
        async (documentSnapshot) => {
          if (!user) {
            const userData = readFirestoreDocument<TUserRow>(documentSnapshot)
            console.log({ userData })
            setUser(userData)
            if (userData.admin === true) {
              navigate('/admin/dataset')
            }
          }
        },
        (err) => {
          console.error(err)
        }
      )

      return () => unsubscribe()
    }
    if (!authState) {
      if (user || user === undefined) {
        setUser(null)
      }
    }
  }, [authState, user])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (result) => {
        if (result && !authState) {
          setAuthState(result)
        }
        if (!result && authState) {
          setAuthState(null)
        }
      },
      (err) => {
        console.error(err)
      }
    )

    return () => unsubscribe()
  }, [authState])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
