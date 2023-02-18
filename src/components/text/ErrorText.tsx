import { Text } from '@nextui-org/react'
import { Col } from '@ui'
import { FiAlertCircle } from 'react-icons/fi'

export type TErrorTextProps = {
  code?: TErrorCode
}

const errorMessages: Record<TErrorCode, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Permission Denied',
  404: 'Not Found',
  500: 'Internal Server Error',
}

function ErrorText({ code }: TErrorTextProps) {
  return (
    <Col css={{ px: '$10' }} center flex>
      {<FiAlertCircle size="2.5em" stroke={'var(--nextui-colors-error)'} />}
      <Text
        css={{
          mb: '$0',
          mt: '$2',
          ta: 'center',
        }}
        color="error"
        h6
        size="$lg"
      >
        {code ? errorMessages[code] : 'Something went wrong!'}
      </Text>
    </Col>
  )
}

export default ErrorText
