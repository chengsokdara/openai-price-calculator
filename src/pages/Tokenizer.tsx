import {
  Button,
  Col,
  FormElement,
  Row,
  Spacer,
  Text,
  Textarea,
} from '@nextui-org/react'
import { logEvent } from 'firebase/analytics'
import GPT3Tokenizer from 'gpt3-tokenizer'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { analytics } from '../firebase'

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

type TResult = { bpe: number[]; text: string[] }

function Tokenizer() {
  const [location] = useLocation()
  const [prompt, setPrompt] = useState<string>('')
  const [token, setToken] = useState<TResult>()

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_location: location,
      page_path: '/tokenizer',
      page_title: 'Token Counter',
    })
  }, [])

  const handlePromptChange = (event: React.ChangeEvent<FormElement>) => {
    const text = event.target.value
    const _result = tokenizer.encode(text)
    setPrompt(text)
    setToken(_result)
  }

  return (
    <>
      <Row>
        <Col>
          <Text
            css={{
              my: '$sm',
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
            }}
            h3
          >
            Prompt
          </Text>
          <Textarea
            bordered
            color="secondary"
            placeholder="Enter prompt here"
            minRows={10}
            maxRows={20}
            fullWidth
            size="lg"
            width="35%"
            onChange={handlePromptChange}
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
        <Link href={`/token/${token?.bpe.length ?? '1000'}`}>
          <Button
            as="a"
            css={{
              '@xsMax': {
                mt: '$sm',
              },
            }}
            color="gradient"
          >
            Calculate Price
          </Button>
        </Link>
      </Row>
    </>
  )
}

export default Tokenizer
