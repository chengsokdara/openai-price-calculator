import { FormElement, Input, Table, Text } from '@nextui-org/react'
import { logEvent } from 'firebase/analytics'
import { useEffect, useState } from 'react'
import { useLocation, useRoute } from 'wouter'
import { analytics } from '../firebase'
import {
  baseColumns,
  baseData,
  fineTuneColumns,
  fineTuneData,
} from '../constants/data'

function Calculator() {
  const [match, params] = useRoute<{ token: string }>('/token/:token')
  const [location] = useLocation()
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
    logEvent(analytics, 'page_view', {
      page_location: location,
      page_path: '/',
      page_title: 'Price Calculator',
    })
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
    <>
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
    </>
  )
}

export default Calculator
