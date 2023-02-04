type TRow = {
  [key: string]: any
  key: string
  label: string
  price: number
  request?: number
} & Record<string, any>

type TColumn = {
  [key: string]: any
  key: string
  label: string
}
