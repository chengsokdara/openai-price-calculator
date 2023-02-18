import { Button, Loading, Table, Text } from '@nextui-org/react'
import type { Selection } from '@react-types/shared/src/selection'
import ActionDropdown, {
  type TActionDropdownItem,
} from '@ui/dropdown/ActionDropdown'
import ErrorText from '@ui/text/ErrorText'
import InfoText from '@ui/text/InfoText'
import { collection, query, where, type Unsubscribe } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, type Key } from 'react'
import { FiInbox } from 'react-icons/fi'
import { firestore } from 'src/firebase'
import { useModal } from 'src/hooks/useModal'
import { useDatasetShortcut } from 'src/hooks/useShortcut'
import { useSnapshot } from 'src/hooks/useSnapshot'
import { useUser } from 'src/hooks/useUser'
import type { TDatasetPayload } from 'src/modals/DatasetModal'
import { useLocation } from 'wouter'

export type TDatasetRow = TRow & TDataset

function Dataset() {
  useDatasetShortcut()
  const [, navigate] = useLocation()
  const { toggle } = useModal()
  const { error, loading, rows, subscribe } = useSnapshot<TDatasetRow>()
  const user = useUser()

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {}
    // user logged in
    if (user) {
      const datasetQuery = query(
        collection(firestore, 'datasets'),
        where('userId', '==', user.uid)
      )
      unsubscribe = subscribe(datasetQuery)
    }
    // user logged out
    if (user === null) {
      const datasetQuery = query(
        collection(firestore, 'datasets'),
        where('userId', '==', 'public')
      )
      unsubscribe = subscribe(datasetQuery)
    }

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
              disabled={item.userId === 'public' && !user?.admin}
              disabledKeys={['export', 'archive']}
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
        color="gradient"
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
    label: 'Edit',
  },
  {
    key: 'export',
    label: 'Export',
  },
  {
    key: 'archive',
    danger: true,
    label: 'Archive',
  },
]
