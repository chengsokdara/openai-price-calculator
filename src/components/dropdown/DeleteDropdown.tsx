import {
  Button,
  Loading,
  Popover,
  PressEvent,
  Text,
  Tooltip,
} from '@nextui-org/react'
import { Col, Row } from '@ui'
import { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'

export type TDeleteDropdownProps = {
  disabled?: boolean
  loading?: boolean
  message?: string
  onCancel?: (e: PressEvent) => void
  onDelete?: (e: PressEvent) => void
}

function DeleteDropdown({
  disabled,
  loading,
  message,
  onCancel,
  onDelete,
}: TDeleteDropdownProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Popover
      isBordered
      isDismissable={!loading}
      isOpen={open}
      placement="bottom-right"
      onOpenChange={setOpen}
    >
      <Tooltip content="Delete">
        <Popover.Trigger>
          <Button
            css={{ minWidth: 'auto', px: '$6' }}
            color="error"
            disabled={disabled}
            icon={<FiTrash2 size="1.25em" />}
            rounded
            onPress={() => setOpen(true)}
          />
        </Popover.Trigger>
      </Tooltip>
      <Popover.Content css={{ zIndex: 1001 }}>
        <Col css={{ br: '$lg', p: '$lg', maxW: '20em' }}>
          <Row css={{ mb: '$10' }}>
            <Text>{message}</Text>
          </Row>
          <Row>
            <Button
              disabled={loading}
              light
              size="sm"
              onPress={(e) => {
                setOpen(false)
                onCancel?.(e)
              }}
            >
              {loading ? (
                <Loading color="secondary" size="sm" type="points-opacity" />
              ) : (
                'Cancel'
              )}
            </Button>
            <Button
              color="error"
              disabled={loading}
              shadow
              size="sm"
              onPress={onDelete}
            >
              {loading ? (
                <Loading color="secondary" size="xl" type="points-opacity" />
              ) : (
                'Delete'
              )}
            </Button>
          </Row>
        </Col>
      </Popover.Content>
    </Popover>
  )
}

export default DeleteDropdown
