import {
  Button,
  Col,
  Container,
  FormElement,
  Row,
  Spacer,
  Text,
  Textarea,
} from '@nextui-org/react'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { Link } from 'wouter'
import React, { useState } from 'react'

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

type TResult = { bpe: number[]; text: string[] }

function Tokenizer() {
  const [prompt, setPrompt] = useState<string>('')
  const [token, setToken] = useState<TResult>()

  const handlePromptChange = (event: React.ChangeEvent<FormElement>) => {
    const text = event.target.value
    console.log({ text })
    const _result = tokenizer.encode(text)
    console.log({ _result })
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
      <Row wrap="wrap">
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
            Paste to Price Calculator
          </Button>
        </Link>
      </Row>
    </>
  )
}

export default Tokenizer
