import { Navbar, Text } from '@nextui-org/react'
import { Col } from '@ui'
import { Link } from 'wouter'

function Logo() {
  return (
    <Navbar.Brand>
      <Col stretch>
        <Link href="/">
          <Text
            css={{
              lh: '$xs',
              my: '$0',
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
              '@xsMax': {
                ta: 'center',
              },
            }}
            color="gradient"
            h1
          >
            OAT
          </Text>
          <Text
            css={{
              my: '$0',
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
            }}
            h2
            size="$xs"
          >
            OpenAI API Tools
          </Text>
        </Link>
      </Col>
    </Navbar.Brand>
  )
}

export default Logo
