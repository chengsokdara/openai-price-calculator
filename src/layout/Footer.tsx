import { Col, Row, Text } from '@nextui-org/react'
import { Link } from 'wouter'
import pkg from '../../package.json'

function Footer() {
  return (
    <Row>
      <Col>
        <Text css={{ mx: '$lg', ta: 'center' }} blockquote>
          {`© ${new Date().getFullYear()} - v${pkg.version} - `}
          <Link href="https://chengsokdara.github.io" target="_blank">
            Sokdara Cheng
          </Link>
        </Text>
      </Col>
    </Row>
  )
}

export default Footer
