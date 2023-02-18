import { useContext } from 'react'
import { UserContext } from 'src/contexts/UserContext'

export const useUser = () => useContext(UserContext)
