import { Progress, Text } from '@nextui-org/react'
import { Col } from '@ui'

export type TLoaderProps = {
  message: string
}

function Loader({ message }: TLoaderProps) {
  return (
    <Col flex>
      <Progress color="gradient" indeterminated size="xl" status="secondary" />
      <Col center flex>
        <Text
          css={{
            ta: 'center',
            textGradient: '45deg, $blue600 -20%, $pink600 50%',
          }}
          h1
          size="$6xl"
        >
          {message}
        </Text>
      </Col>
    </Col>
  )
}

export default Loader
