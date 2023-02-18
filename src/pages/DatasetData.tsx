import { Button, Loading, Table, Text } from '@nextui-org/react'
import type { Selection } from '@react-types/shared/src/selection'
import { Row } from '@ui'
import DeleteDropdown from '@ui/dropdown/DeleteDropdown'
import ErrorText from '@ui/text/ErrorText'
import InfoText from '@ui/text/InfoText'
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { useCallback, useEffect, useMemo, type Key } from 'react'
import { FiChevronLeft, FiInbox } from 'react-icons/fi'
import { firestore } from 'src/firebase'
import { useModal } from 'src/hooks/useModal'
import { useResponsive } from 'src/hooks/useResponsive'
import { useDatasetDataShortcut } from 'src/hooks/useShortcut'
import { useSnapshot } from 'src/hooks/useSnapshot'
import { useUser } from 'src/hooks/useUser'
import type { TDatasetDataPayload } from 'src/modals/DatasetDataModal'
import { useLocation, useRoute } from 'wouter'

export type TDatasetDataRow = TRow & TDatasetData

export type TDatasetDataParam = {
  datasetId: string
}

function DatasetData() {
  const [, navigate] = useLocation()
  const { toggle } = useModal()
  const { isMobile } = useResponsive()
  const [match, params] = useRoute<TDatasetDataParam>('/dataset/:datasetId')
  useDatasetDataShortcut(params)
  const { error, loading, rows, setError, setLoading, subscribe } =
    useSnapshot<TDatasetDataRow>()
  const user = useUser()

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {}
    if (match && params) {
      if (user) {
        const datasetDataQuery = query(
          collectionGroup(firestore, 'data'),
          where('parentId', '==', params.datasetId),
          where('userId', '==', user.uid)
        )
        unsubscribe = subscribe(datasetDataQuery)
      }
      if (user === null) {
        const datasetDataQuery = query(
          collectionGroup(firestore, 'data'),
          where('parentId', '==', params.datasetId),
          where('userId', '==', 'public')
        )
        unsubscribe = subscribe(datasetDataQuery)
      }

      return () => unsubscribe()
    } else {
      setError(400)
      setLoading(false)
    }
  }, [user])

  const onCreate = useCallback(() => {
    if (!user) {
      return navigate('/auth/signin')
    }
    if (params) {
      const modalPayload: TDatasetDataPayload = {
        isCreate: true,
        parentId: params.datasetId,
        parentRef: doc(collection(firestore, 'datasets'), params.datasetId),
        prompt: '',
        completion: '',
      }
      toggle('dataset-data-modal', modalPayload)
    }
  }, [params, user])

  const onDelete = useCallback(
    (item: TDatasetDataRow) => () => {
      if (item.parentId && item.key) {
        const docRef = doc(
          collection(firestore, 'datasets', item.parentId, 'data'),
          item.key
        )
        setLoading(true)
        deleteDoc(docRef)
          .then(() => {
            console.log(docRef.id, 'deleted!')
            setLoading(false)
          })
          .catch((err) => {
            console.error(err)
            setLoading(false)
          })
      }
    },
    []
  )

  const onRead = useCallback(
    (keys: Selection) => {
      if (!user || user?.admin === false) {
        return
      }
      const selectedKey = (keys as Set<string>).values().next().value
      if (params && selectedKey) {
        const selectedRow = rows.find((row) => row.key === selectedKey)
        if (selectedRow) {
          const modalPayload: TDatasetDataPayload = {
            isCreate: false,
            datasetDataId: selectedKey,
            parentId: params.datasetId,
            parentRef: doc(collection(firestore, 'datasets'), params.datasetId),
            prompt: selectedRow.prompt ?? '',
            completion: selectedRow.completion ?? '',
          }
          toggle('dataset-data-modal', modalPayload)
        }
      }
    },
    [params, rows, user]
  )

  const renderTableColumn = useMemo(
    () => (column: TColumn) => {
      if (column.key === 'actions') {
        return (
          <Table.Column key={column.key} width={64}>
            {column.label}
          </Table.Column>
        )
      }
      if (column.key === 'prompt') {
        return (
          <Table.Column key={column.key} width={isMobile ? null : 250}>
            {column.label}
          </Table.Column>
        )
      }
      return <Table.Column key={column.key}>{column.label}</Table.Column>
    },
    []
  )

  const renderTableRow = useMemo(
    () => (item: TDatasetDataRow) => {
      return <Table.Row key={item.key}>{renderTableCell(item)}</Table.Row>
    },
    [loading, user]
  )

  const renderTableCell = useMemo(
    () => (item: TDatasetDataRow) => (columnKey: Key) => {
      if (columnKey === 'actions') {
        return (
          <Table.Cell
            key={`${columnKey}-${item.key}`}
            css={{ minWidth: 'auto', px: '$6' }}
          >
            <DeleteDropdown
              disabled={user === null || user?.admin === true}
              loading={loading}
              message="Are you sure you want to delete this dataset data? By doing this, you will not be able to recover the data."
              onDelete={onDelete(item)}
            />
          </Table.Cell>
        )
      }
      return (
        <Table.Cell key={`${columnKey}-${item.key}`}>
          <Text
            css={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              ov: 'hidden',
              whiteSpace: 'normal',
            }}
          >
            {item[columnKey]}
          </Text>
        </Table.Cell>
      )
    },
    [loading, user]
  )

  if (loading) {
    return (
      <InfoText
        icon={
          <Loading
            css={{ mb: '$5' }}
            type="points"
            color="secondary"
            size="xl"
          />
        }
        title="Loading data..."
      />
    )
  }

  return (
    <>
      <Row css={{ my: '$lg' }}>
        <Button
          css={{
            bg: '$pink600',
            minWidth: 'auto',
            bbrr: '$0',
            btrr: '$0',
            w: '4em',
            px: '$10',
          }}
          icon={<FiChevronLeft size="1.25em" />}
          rounded
          shadow
          size="lg"
          onPress={() => navigate('/dataset')}
        />
        <Button
          css={{
            bblr: '$0',
            btlr: '$0',
            px: '$0',
            w: '14em',
            '@xsMax': { w: 'stretch' },
          }}
          color="gradient"
          rounded
          shadow
          size="lg"
          onPress={onCreate}
        >
          New Dataset Data
        </Button>
      </Row>
      {error === 0 ? (
        <Table
          aria-label="Dataset Data Table"
          aria-labelledby="dataset-data-manager"
          bordered
          selectedKeys={new Set()}
          selectionBehavior="replace"
          selectionMode="single"
          onSelectionChange={onRead}
        >
          <Table.Header columns={COLUMNS}>{renderTableColumn}</Table.Header>
          <Table.Body items={rows}>{renderTableRow}</Table.Body>
        </Table>
      ) : error === 404 ? (
        <InfoText icon={<FiInbox size="5em" />} title="No data" />
      ) : (
        <ErrorText code={error} />
      )}
    </>
  )
}

export default DatasetData

const COLUMNS: TColumn[] = [
  { key: 'prompt', label: 'Promot' },
  { key: 'completion', label: 'Completion' },
  { key: 'actions', label: 'Actions' },
]
