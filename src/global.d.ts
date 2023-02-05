type TColumn = {
  [key: string]: any
  key: string
  label: string
}

type TRow = {
  [key: string]: any
  key: string
  label: string
  price: number
  request?: number
} & Record<string, any>

type TFineTuneRow = {
  training: number
  'training-request'?: number
  usage: number
  'usage-request'?: number
} & Omit<TRow, 'price' | 'request'>
