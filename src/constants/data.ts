export const baseColumns: TColumn[] = [
  {
    key: 'label',
    label: 'Model',
  },
  {
    key: 'price',
    label: 'Price / 1k tokens',
  },
  {
    key: 'request',
    label: 'Price / tokens',
  },
]

export const baseData: TRow[] = [
  {
    key: 'ada',
    label: 'Ada',
    price: 0.0004,
  },
  {
    key: 'babbage',
    label: 'Babbage',
    price: 0.0005,
  },
  {
    key: 'curie',
    label: 'Curie',
    price: 0.002,
  },
  {
    key: 'davinci',
    label: 'Davinci',
    price: 0.02,
  },
]

export const fineTuneColumns: TColumn[] = [
  {
    key: 'label',
    label: 'Model',
  },
  {
    key: 'training',
    label: 'Training / 1k tokens',
  },
  {
    key: 'training-request',
    label: 'Training / tokens',
  },
  {
    key: 'usage',
    label: 'Usage / 1k tokens',
  },
  {
    key: 'usage-request',
    label: 'Usage / tokens',
  },
]

export const fineTuneData: TFineTuneRow[] = [
  {
    key: 'ada',
    label: 'Ada',
    training: 0.0004,
    usage: 0.0016,
  },
  {
    key: 'babbage',
    label: 'Babbage',
    training: 0.0006,
    usage: 0.0024,
  },
  {
    key: 'curie',
    label: 'Curie',
    training: 0.003,
    usage: 0.012,
  },
  {
    key: 'davinci',
    label: 'Davinci',
    training: 0.03,
    usage: 0.12,
  },
]
