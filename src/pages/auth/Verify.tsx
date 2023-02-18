import { Button, Card, Text } from '@nextui-org/react'
import { Form } from '@ui'
import InputField from '@ui/input/InputField'
import Loader from '@ui/Loader'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { emailValidationRegex } from 'src/constants/regex'
import { auth, firestore } from 'src/firebase'
import { useStrictModeEffect } from 'src/hooks/useStrictModeEffect'
import { useLocation } from 'wouter'

export type TVerifyValue = {
  email: string
}

const defaultValues: TVerifyValue = {
  email: '',
}

function Verify() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TVerifyValue>({
    defaultValues,
  })
  const [, navigate] = useLocation()
  const [message, setMessage] = useState<string>('Verifying...')
  const [requireEmail, setRequireEmail] = useState<boolean>(false)

  useStrictModeEffect(() => {
    ;(async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const savedEmail = localStorage.getItem('email')
        if (savedEmail) {
          await onSignin(savedEmail)
        } else {
          setRequireEmail(true)
        }
      }
    })()
  })

  const onSignin = useCallback(async (email: string) => {
    try {
      const { user } = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      )
      await setDoc(
        doc(firestore, 'users', user.uid),
        { email: user.email, uid: user.uid },
        { merge: true }
      )
      localStorage.removeItem('email')
      navigate('/')
    } catch (err) {
      console.error(err)
      setMessage('Something went wrong!')
    }
  }, [])

  const onSubmit = useCallback(async (data: TVerifyValue) => {
    await onSignin(data.email)
  }, [])

  if (!requireEmail) {
    return <Loader message={message} />
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
          <Text css={{ mb: '$0' }} h2>
            Confirm E-Mail
          </Text>
        </Card.Header>
        <Card.Body css={{ pt: '$12' }}>
          <InputField
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
                message: 'E-Mail is not valid!',
              },
            }}
            size="xl"
            status={errors.email ? 'error' : 'default'}
            type="email"
          />
        </Card.Body>
        <Card.Footer css={{ ai: 'stretch', fd: 'column', pb: '$10' }}>
          <Button color="gradient" rounded size="xl" type="submit">
            Verify
          </Button>
        </Card.Footer>
      </Card>
    </Form>
  )
}

export default Verify
