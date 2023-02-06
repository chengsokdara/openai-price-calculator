import { Col, Progress, Text } from '@nextui-org/react'

function Loader() {
  return (
    <Col css={{ d: 'flex', fd: 'column', fg: 1, px: '$10' }}>
      <Progress color="gradient" indeterminated size="xl" status="secondary" />
      <Col
        css={{
          dflex: 'center',
          fd: 'column',
          fg: 1,
        }}
      >
        <Text
          css={{
            ta: 'center',
            textGradient: '45deg, $blue600 -20%, $pink600 50%',
          }}
          h1
          size="$9xl"
        >
          Welcome!
        </Text>
      </Col>
    </Col>
  )
}

export default Loader
