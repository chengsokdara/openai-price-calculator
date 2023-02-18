import { Input, Table, type FormElement } from '@nextui-org/react'
import { Col, Row } from '@ui'
import InputLabel from '@ui/input/InputLabel'
import { logEvent } from 'firebase/analytics'
import { useEffect, useState } from 'react'
import { analytics } from 'src/firebase'
import { useLocation, useRoute } from 'wouter'

export type TCalculatorParam = {
  token?: string
}

function Calculator() {
  const [match, params] = useRoute<TCalculatorParam>('/token/:token')
  const [location] = useLocation()
  const [token, setToken] = useState<string>('1,000')
  const [baseRows, setBaseRows] = useState<TRow[]>(baseData)
  const [fineTuneRows, setFineTuneRows] = useState<TFineTuneRow[]>(fineTuneData)

  useEffect(() => {
    if (match && params) {
      // Log page view to Firebase analytics
      logEvent(analytics, 'page_view', {
        page_location: location,
        page_path: '/token',
        page_title: 'Price Calculator',
      })

      if (params?.token && /^\d+$/.test(params.token.slice(-1))) {
        const tokenCount = parseFloat(params.token)
        setToken(tokenCount.toLocaleString())
        onPriceUpdate(tokenCount)
      }
    } else {
      // Log page view to Firebase analytics
      logEvent(analytics, 'page_view', {
        page_location: location,
        page_path: '/',
        page_title: 'Price Calculator',
      })
    }
  }, [])

  const onPriceUpdate = (request: number) => {
    const newBaseRows = baseRows
      .slice()
      .map((row) => ({ ...row, price: basePrice[row.key] * (request / 1000) }))
    const newFineTuneRows = fineTuneRows.slice().map((row) => ({
      ...row,
      training: fineTunePrice[row.key]['training'] * (request / 1000),
      usage: fineTunePrice[row.key]['usage'] * (request / 1000),
    }))
    setBaseRows(newBaseRows)
    setFineTuneRows(newFineTuneRows)
  }

  const onTokenChange = (event: React.ChangeEvent<FormElement>) => {
    const value = event.target.value.replace(/,/g, '')
    if (!/^\d+$/.test(value.slice(-1))) {
      setToken('')
      return
    }
    const tokenCount = parseFloat(value)
    setToken(tokenCount.toLocaleString())
    onPriceUpdate(tokenCount)
  }

  return (
    <>
      <Row css={{ mt: '$10' }}>
        <Input
          css={{ bg: '$background', fg: 1 }}
          aria-label="token amount input"
          bordered
          color="secondary"
          labelRight={'tokens'}
          placeholder="Enter token amount"
          size="lg"
          value={token}
          onChange={onTokenChange}
        />
      </Row>
      <Col>
        <InputLabel h3>Base model price calculator</InputLabel>
        <Table aria-label="GPT-3 base price table" bordered lined sticked>
          <Table.Header columns={baseColumns as unknown as TColumn[]}>
            {(column) => <Table.Column>{column.label}</Table.Column>}
          </Table.Header>
          <Table.Body items={baseRows}>
            {(item) => (
              <Table.Row key={item.key}>
                {(columnKey) => (
                  <Table.Cell>
                    {columnKey === 'price'
                      ? `$${item[columnKey]?.toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}`
                      : item[columnKey]}
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <InputLabel h3>Fine-tune model price calculator</InputLabel>
        <Table
          css={{
            fg: 1,
          }}
          aria-label="GPT-3 fine-tune price table"
          bordered
          lined
          sticked
        >
          <Table.Header columns={fineTuneColumns as unknown as TColumn[]}>
            {(column) => <Table.Column>{column.label}</Table.Column>}
          </Table.Header>
          <Table.Body items={fineTuneRows}>
            {(item) => (
              <Table.Row key={item.key}>
                {(columnKey) => (
                  <Table.Cell>
                    {columnKey === 'training' || columnKey === 'usage'
                      ? `$${item[columnKey]?.toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}`
                      : item[columnKey]}
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Col>
    </>
  )
}

export default Calculator

const baseColumns = [
  {
    key: 'label',
    label: 'Model',
  },
  {
    key: 'price',
    label: 'Price / tokens',
  },
] as const

const basePrice: Record<string, number> = {
  ada: 0.0004,
  babbage: 0.0005,
  curie: 0.002,
  davinci: 0.02,
}

type TBaseRow = TRow & Record<(typeof baseColumns)[number]['key'], any>

const baseData: TBaseRow[] = [
  {
    key: 'ada',
    label: 'Ada',
    price: basePrice['ada'],
  },
  {
    key: 'babbage',
    label: 'Babbage',
    price: basePrice['babbage'],
  },
  {
    key: 'curie',
    label: 'Curie',
    price: basePrice['curie'],
  },
  {
    key: 'davinci',
    label: 'Davinci',
    price: basePrice['davinci'],
  },
]

const fineTuneColumns = [
  {
    key: 'label',
    label: 'Model',
  },
  {
    key: 'training',
    label: 'Training / tokens',
  },
  {
    key: 'usage',
    label: 'Usage / tokens',
  },
] as const

const fineTunePrice: Record<string, Record<string, number>> = {
  ada: {
    training: 0.0004,
    usage: 0.0016,
  },
  babbage: {
    training: 0.0006,
    usage: 0.0024,
  },
  curie: {
    training: 0.003,
    usage: 0.012,
  },
  davinci: {
    training: 0.03,
    usage: 0.12,
  },
}

type TFineTuneRow = TRow & Record<(typeof fineTuneColumns)[number]['key'], any>

const fineTuneData: TFineTuneRow[] = [
  {
    key: 'ada',
    label: 'Ada',
    training: fineTunePrice['ada']['training'],
    usage: fineTunePrice['ada']['usage'],
  },
  {
    key: 'babbage',
    label: 'Babbage',
    training: fineTunePrice['babbage']['training'],
    usage: fineTunePrice['babbage']['usage'],
  },
  {
    key: 'curie',
    label: 'Curie',
    training: fineTunePrice['curie']['training'],
    usage: fineTunePrice['curie']['usage'],
  },
  {
    key: 'davinci',
    label: 'Davinci',
    training: fineTunePrice['davinci']['training'],
    usage: fineTunePrice['davinci']['usage'],
  },
]
