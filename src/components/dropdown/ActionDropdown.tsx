import { Dropdown, Tooltip } from '@nextui-org/react'
import { useMemo, type Key, type ReactNode } from 'react'
import { FiMoreVertical } from 'react-icons/fi'

export type TActionDropdownItem = {
  danger?: boolean
  icon?: ReactNode
} & TItem

export type TActionDropdownProps = {
  disabled?: boolean
  disabledKeys?: Iterable<Key>
  items: TActionDropdownItem[]
  onAction?: (key: Key) => void
}

function ActionDropdown({
  disabled,
  disabledKeys,
  items,
  onAction,
}: TActionDropdownProps) {
  const renderItem = useMemo(
    () =>
      ({ key, label, icon, danger }: TActionDropdownItem, index: number) => {
        return (
          <Dropdown.Item
            key={key}
            color={danger ? 'error' : 'default'}
            icon={icon}
            withDivider={danger}
          >
            {label}
          </Dropdown.Item>
        )
      },
    []
  )

  return (
    <Dropdown placement="bottom-right">
      <Tooltip content="More Options">
        <Dropdown.Button
          css={{
            minWidth: 'auto',
            px: '$6',
          }}
          disabled={disabled}
          icon={<FiMoreVertical size="1.25em" />}
          rounded
        />
      </Tooltip>
      <Dropdown.Menu
        aria-label="Actions"
        color="secondary"
        disabledKeys={disabledKeys}
        onAction={onAction}
      >
        {items.map(renderItem)}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ActionDropdown
