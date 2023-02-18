import { Button, Card, Spacer, Text } from '@nextui-org/react'
import { Col, Form } from '@ui'
import InputField from '@ui/input/InputField'
import SubTitle from '@ui/text/SubTitle'
import { sendSignInLinkToEmail, type ActionCodeSettings } from 'firebase/auth'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { emailValidationRegex } from 'src/constants/regex'
import { auth } from 'src/firebase'
import { useLocation } from 'wouter'

export type TLoginValue = {
  email: string
}

const defaultValues: TLoginValue = {
  email: '',
}

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginValue>({
    defaultValues,
  })
  const [, navigate] = useLocation()
  const [sent, setSent] = useState<boolean>(false)

  const onSubmit = useCallback((data: TLoginValue) => {
    const actionCodeSettings: ActionCodeSettings = {
      url: `${
        import.meta.env.DEV ? `http://localhost:5173` : window.location.origin
      }/auth/verify`,
      handleCodeInApp: true,
    }
    sendSignInLinkToEmail(auth, data.email, actionCodeSettings)
      .then(() => {
        setSent(true)
        localStorage.setItem('email', data.email)
      })
      .catch((err) => {
        console.error(err)
        setSent(false)
      })
  }, [])

  if (sent) {
    return (
      <Col
        css={{
          px: '$4xl',
          '@xsMax': {
            px: '$0',
          },
        }}
        centerY
        flex
      >
        <Card variant="bordered">
          <Card.Body css={{ ai: 'center' }}>
            <SubTitle css={{ ta: 'center' }}>
              Check your inbox for login link
            </SubTitle>
            <Text small>Sometimes it can ends up in your spam folder</Text>
            <Spacer y={1} />
            <Text>You can now close this tab</Text>
            <Button color="primary" light onPress={() => navigate('/')}>
              Home
            </Button>
          </Card.Body>
        </Card>
      </Col>
    )
  }

  return (
    <Form
      css={{
        jc: 'center',
        px: '$4xl',
        '@xsMax': {
          px: '$0',
        },
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card variant="bordered">
        <Card.Header css={{ jc: 'center', pb: '$0' }}>
          <Text css={{ mb: '$0', ta: 'center' }} h2>
            Passwordless Authentication
          </Text>
        </Card.Header>
        <Card.Body css={{ pt: '$12' }}>
          <InputField
            autoComplete="email"
            autoFocus
            bordered
            color="secondary"
            control={control}
            labelPlaceholder="E-Mail"
            name="email"
            rounded
            rules={{
              required: true,
              pattern: {
                value: emailValidationRegex,
                message: 'Email is not valid!',
              },
            }}
            size="xl"
            status={errors.email ? 'error' : 'default'}
            type="email"
          />
          <Spacer y={0.5} />
          <Text css={{ ta: 'center' }} small>
            We will sent you a secure login link in your inbox, please check
            your spam folder if you cannot find it.
          </Text>
        </Card.Body>
        <Card.Footer css={{ ai: 'stretch', fd: 'column', pb: '$10' }}>
          <Button color="gradient" rounded size="xl" type="submit">
            Login
          </Button>
        </Card.Footer>
      </Card>
    </Form>
  )
}

export default Login
