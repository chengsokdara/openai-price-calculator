import {
  Col,
  Container,
  FormElement,
  Input,
  Row,
  Spacer,
  Table,
  Text,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useRoute } from 'wouter'

const baseColumns: TColumn[] = [
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

const baseData: TRow[] = [
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

const fineTuneColumns: TColumn[] = [
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

type TFineTuneRow = {
  training: number
  'training-request'?: number
  usage: number
  'usage-request'?: number
} & Omit<TRow, 'price' | 'request'>

const fineTuneData: TFineTuneRow[] = [
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

function Calculator() {
  const [match, params] = useRoute<{ token: string }>('/token/:token')
  const [request, setRequest] = useState<string>('1,000')
  const [baseRows, setBaseRows] = useState<TRow[]>(
    baseData.map((data) => ({ ...data, request: data['price'] }))
  )
  const [fineTuneRows, setFineTuneRows] = useState<TFineTuneRow[]>(
    fineTuneData.map((data) => ({
      ...data,
      'training-request': data['training'],
      'usage-request': data['usage'],
    }))
  )

  useEffect(() => {
    if (match && params) {
      const _value = params.token
      if (/^\d+$/.test(_value.slice(-1))) {
        const _request = parseFloat(_value)
        setRequest(_request.toLocaleString())
        _updatePrice(_request)
      }
    }
  }, [])

  const _updatePrice = (request: number) => {
    const newBaseRows = baseRows
      .slice()
      .map((row) => ({ ...row, request: row['price'] * (request / 1000) }))
    const newFineTuneRows = fineTuneRows.slice().map((row) => ({
      ...row,
      'training-request': row['training'] * (request / 1000),
      'usage-request': row['usage'] * (request / 1000),
    }))
    setBaseRows(newBaseRows)
    setFineTuneRows(newFineTuneRows)
  }

  const handleRequestChange = (event: React.ChangeEvent<FormElement>) => {
    const _value = event.target.value.replace(/,/g, '')
    if (!/^\d+$/.test(_value.slice(-1))) {
      setRequest('')
      return
    }
    const _request = parseFloat(_value)
    setRequest(_request.toLocaleString())
    _updatePrice(_request)
  }

  return (
    <Container css={{ fg: 1 }} sm>
      <Row>
        <Col>
          <Input
            css={{ mt: '$lg' }}
            aria-label="token amount input"
            bordered
            color="secondary"
            placeholder="Enter token amount"
            size="lg"
            fullWidth
            width="35%"
            value={request}
            labelRight={'tokens'}
            onChange={handleRequestChange}
          />
          <Text
            css={{
              my: '$sm',
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
            }}
            h3
          >
            Base model price calculator
          </Text>
          <Table aria-label="GPT-3 price table" bordered lined sticked>
            <Table.Header columns={baseColumns}>
              {(column) => <Table.Column>{column.label}</Table.Column>}
            </Table.Header>
            <Table.Body items={baseRows}>
              {(item) => (
                <Table.Row key={item.key}>
                  {(columnKey) => (
                    <Table.Cell>
                      {columnKey === 'price' || columnKey === 'request'
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
          <Text
            css={{
              my: '$sm',
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
            }}
            h3
          >
            Fine-tune model price calculator
          </Text>
          <Table aria-label="GPT-3 price table" bordered lined sticked>
            <Table.Header columns={fineTuneColumns}>
              {(column) => <Table.Column>{column.label}</Table.Column>}
            </Table.Header>
            <Table.Body items={fineTuneRows}>
              {(item) => (
                <Table.Row key={item.key}>
                  {(columnKey) => (
                    <Table.Cell>
                      {columnKey === 'training' ||
                      columnKey === 'training-request' ||
                      columnKey === 'usage' ||
                      columnKey === 'usage-request'
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
      </Row>
    </Container>
  )
}

export default Calculator
