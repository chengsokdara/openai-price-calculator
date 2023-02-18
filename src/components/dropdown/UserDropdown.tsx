import { Avatar, Checkbox, Dropdown, Text, useTheme } from '@nextui-org/react'
import { Col } from '@ui'
import type { Key } from 'react'
import { FiUser } from 'react-icons/fi'
import { useUser } from 'src/hooks/useUser'

export type TUserDropdownProps = {
  onAction?: (key: Key) => void
}

function UserDropdown({ onAction }: TUserDropdownProps) {
  const { isDark } = useTheme()
  const user = useUser()

  return (
    <Dropdown placement="bottom-right">
      <Dropdown.Trigger>
        <Avatar
          as="button"
          bordered
          color={user ? 'primary' : 'default'}
          icon={<FiUser size="1.5em" />}
          size="lg"
        />
      </Dropdown.Trigger>
      <Dropdown.Menu
        aria-label="User Actions"
        color="default"
        disabledKeys={['profile']}
        onAction={onAction}
      >
        <Dropdown.Item key="profile" css={{ height: '$18' }}>
          <Col>
            <Text b color="inherit">
              Signed in as
            </Text>
          </Col>
          <Text b color="inherit">
            {user?.email ?? 'N/A'}
          </Text>
        </Dropdown.Item>
        <Dropdown.Item
          key="dark-mode"
          css={{ px: '$0' }}
          textValue="Dark Mode"
          withDivider
        >
          <Checkbox
            css={{
              fs: '$base',
              px: '$6',
              w: 'stretch',
            }}
            color="gradient"
            isRounded
            isSelected={isDark}
            size="sm"
            onChange={() => {
              onAction?.('dark-mode')
            }}
          >
            Dark Mode
          </Checkbox>
        </Dropdown.Item>
        {user ? (
          <Dropdown.Item key="logout" color="error" withDivider>
            Logout
          </Dropdown.Item>
        ) : (
          <Dropdown.Item key="login" color="primary" withDivider>
            Login
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default UserDropdown
