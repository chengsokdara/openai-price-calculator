import { Button, Loading, Table, Text } from '@nextui-org/react'
import type { Selection } from '@react-types/shared/src/selection'
import ActionDropdown, {
  type TActionDropdownItem,
} from '@ui/dropdown/ActionDropdown'
import ErrorText from '@ui/text/ErrorText'
import InfoText from '@ui/text/InfoText'
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Query,
  type Unsubscribe,
} from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState, type Key } from 'react'
import { FiInbox } from 'react-icons/fi'
import { firestore } from 'src/firebase'
import { useModal } from 'src/hooks/useModal'
import { useDatasetShortcut } from 'src/hooks/useShortcut'
import { useUser } from 'src/hooks/useUser'
import type { TDatasetPayload } from 'src/modals/DatasetModal'
import { readFirestoreDocuments } from 'src/utils/firestore'
import { useLocation } from 'wouter'

export type TDatasetRow = TRow & TDataset

function Dataset() {
  const user = useUser()
  const [, navigate] = useLocation()
  const { toggle } = useModal()
  useDatasetShortcut()
  const [error, setError] = useState<TErrorCode | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [rows, setRows] = useState<TDatasetRow[]>([])

  useEffect(() => {
    const onSubscribe = (query: Query<DocumentData>) => {
      return onSnapshot(
        query,
        (querySnapshot) => {
          const datasets = readFirestoreDocuments<TDatasetRow>(querySnapshot)
          setError(datasets.length === 0 ? 404 : 0)
          setRows(datasets)
          setLoading(false)
        },
        (err) => {
          console.error(err)
          setError(500)
          setRows([])
          setLoading(false)
        }
      )
    }

    let unsubscribe: Unsubscribe = () => {}
    const datasetQuery = query(
      collection(firestore, 'datasets'),
      where('userId', '==', 'public')
    )
    unsubscribe = onSubscribe(datasetQuery)
    return () => unsubscribe()
  }, [user])

  const onAction = useCallback(
    (item: TDatasetRow) => (key: Key) => {
      switch (key) {
        case 'edit':
          onUpdate(item)
          break
        default:
      }
    },
    []
  )

  const onCreate = useCallback(() => {
    if (!user) {
      return navigate('/auth/signin')
    }
    const modalPayload: TDatasetPayload = { isCreate: true }
    toggle('dataset-modal', modalPayload)
  }, [user])

  const onRead = useCallback((keys: Selection) => {
    const selectedKey = (keys as Set<string>).values().next().value
    if (selectedKey) {
      navigate(`/dataset/${selectedKey}`)
    }
  }, [])

  const onUpdate = useCallback((item: TDatasetRow) => {
    const modalPayload: TDatasetPayload = {
      isCreate: false,
      datasetId: item.key,
      name: item.name,
    }
    toggle('dataset-modal', modalPayload)
  }, [])

  const renderTableColumn = useMemo(
    () => (column: TColumn) => {
      if (column.key === 'actions') {
        return (
          <Table.Column key={column.key} width={64}>
            {column.label}
          </Table.Column>
        )
      }
      return <Table.Column key={column.key}>{column.label}</Table.Column>
    },
    []
  )

  const renderTableRow = useMemo(
    () => (item: TDatasetRow) => {
      return <Table.Row key={item.key}>{renderTableCell(item)}</Table.Row>
    },
    [user]
  )

  const renderTableCell = useMemo(
    () => (item: TDatasetRow) => (columnKey: Key) => {
      if (columnKey === 'actions') {
        return (
          <Table.Cell>
            <ActionDropdown
              disabledKeys={
                item.userId === 'public' && !user?.admin
                  ? ['edit', 'export', 'archive']
                  : ['export', 'archive']
              }
              items={ACTIONS}
              onAction={onAction(item)}
            />
          </Table.Cell>
        )
      }
      if (columnKey === 'username') {
        return (
          <Table.Cell>
            <Text
              css={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                ov: 'hidden',
                whiteSpace: 'normal',
              }}
            >
              {item.userId === 'public'
                ? 'public'
                : user?.email?.split('@')?.[0] ?? 'N/A'}
            </Text>
          </Table.Cell>
        )
      }
      return (
        <Table.Cell>
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
    [user]
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
      <Button
        css={{
          w: '20em',
          my: '$lg',
          px: '$0',
          '@xsMax': { w: 'stretch' },
        }}
        rounded
        shadow
        size="lg"
        onPress={onCreate}
      >
        New Dataset
      </Button>
      {error === 0 ? (
        <Table
          containerCss={{ overflowY: 'auto' }}
          aria-label="Dataset Table"
          aria-labelledby="dataset-manager"
          bordered
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

export default Dataset

const COLUMNS: TColumn[] = [
  { key: 'name', label: 'Dataset Name' },
  { key: 'username', label: 'Created By' },
  { key: 'actions', label: 'Actions' },
]

const ACTIONS: TActionDropdownItem[] = [
  {
    key: 'edit',
    // icon: <FiEdit size="2.5em" fill="var(--nextui-colors-secondary)" />,
    label: 'Edit',
  },
  {
    key: 'export',
    // icon: <FiDownload size="2.5em" fill="var(--nextui-colors-secondary)" />,
    label: 'Export',
  },
  {
    key: 'archive',
    // icon: <FiTrash2 size="2.5em" fill="currentColor" />,
    danger: true,
    label: 'Archive',
  },
]
