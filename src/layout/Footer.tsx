import { Text } from '@nextui-org/react'
import { Row } from '@ui'
import { Link } from 'wouter'
import pkg from 'package.json'

function Footer() {
  return (
    <Row css={{ px: '$sm' }}>
      <Text
        css={{
          backdropFilter: 'saturate(180%) blur(var(--nextui--navbarBlur))',
          backgroundColor: 'var(--nextui-colors-backgroundAlpha)',
          fg: 1,
          m: '$sm',
          ta: 'center',
        }}
        blockquote
      >
        {`© ${new Date().getFullYear()} - v${pkg.version} - `}
        <Link href="https://chengsokdara.github.io" target="_blank">
          Sokdara Cheng
        </Link>
      </Text>
    </Row>
  )
}

export default Footer
