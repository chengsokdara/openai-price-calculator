import { Col, Text } from '@nextui-org/react'

function Chat() {
  return (
    <Col
      css={{
        d: 'flex',
        fd: 'column',
        jc: 'center',
        h: '100%',
      }}
    >
      <Text
        css={{
          ta: 'center',
          textGradient: '45deg, $blue600 -20%, $pink600 50%',
        }}
        h2
        size="$7xl"
      >
        Coming Soon!
      </Text>
    </Col>
  )
}

export default Chat
