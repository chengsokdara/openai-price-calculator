import { Text, type SimpleColors } from '@nextui-org/react'
import { Col } from '@ui'
import type { ReactNode } from 'react'

export type TInfoTextProps = {
  color?: SimpleColors
  icon?: ReactNode
  message?: string
  title: string
}

function InfoText({ color, icon, message, title }: TInfoTextProps) {
  return (
    <Col css={{ px: '$10' }} center flex>
      {icon}
      <Text
        css={{
          mb: '$0',
          mt: '$2',
          ta: 'center',
        }}
        color={color}
        h6
        size="$lg"
      >
        {title}
      </Text>
      {message ? (
        <Text color={color} small>
          {message}
        </Text>
      ) : null}
    </Col>
  )
}

export default InfoText
