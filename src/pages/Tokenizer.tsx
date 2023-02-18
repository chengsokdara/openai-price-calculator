import { Spacer, Text, Textarea, type FormElement } from '@nextui-org/react'
import { Col, Row } from '@ui'
import ButtonLink from '@ui/button/ButtonLink'
import InputLabel from '@ui/input/InputLabel'
import { logEvent } from 'firebase/analytics'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { useEffect, useState } from 'react'
import { analytics } from 'src/firebase'
import { useLocation } from 'wouter'

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

type TTokenizerResult = { bpe: number[]; text: string[] }

function Tokenizer() {
  const [location] = useLocation()
  const [prompt, setPrompt] = useState<string>('')
  const [token, setToken] = useState<TTokenizerResult>()

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_location: location,
      page_path: '/tokenizer',
      page_title: 'Token Counter',
    })
  }, [])

  const onPromptChange = (event: React.ChangeEvent<FormElement>) => {
    const text = event.target.value
    const _result = tokenizer.encode(text)
    setPrompt(text)
    setToken(_result)
  }

  return (
    <>
      <Row>
        <Col>
          <InputLabel>Prompt</InputLabel>
          <Textarea
            aria-label="Prompt"
            bordered
            color="secondary"
            fullWidth
            minRows={10}
            maxRows={12}
            placeholder="Enter prompt here"
            size="lg"
            width="35%"
            onChange={onPromptChange}
          />
        </Col>
      </Row>
      <Spacer y={1} />
      <Row
        css={{
          fw: 'nowrap',
          '@xsMax': { fw: 'wrap' },
        }}
      >
        <Row>
          <Text
            css={{
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
            }}
            h5
          >{`Tokens: ${token?.bpe.length ?? 0}`}</Text>
          <Spacer x={2} />
          <Text
            css={{
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
            }}
            h5
          >{`Characters: ${prompt.length ?? 0}`}</Text>
        </Row>
        <ButtonLink
          css={{
            '@xsMax': {
              fg: 1,
              mt: '$sm',
            },
          }}
          color="gradient"
          href={`/token/${token?.bpe.length ?? '1000'}`}
          rounded
          shadow
          size="xl"
        >
          Calculate Price
        </ButtonLink>
      </Row>
    </>
  )
}

export default Tokenizer
