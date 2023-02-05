import { Col, Row } from '@nextui-org/react'
import { Route, Switch } from 'wouter'
import Calculator from '../pages/Calculator'
import Tokenizer from '../pages/Tokenizer'

function Routes() {
  return (
    <Row css={{ fg: 1 }}>
      <Col
        css={{
          px: '$10',
          '@xsMax': {
            px: '$sm',
          },
        }}
      >
        <Switch>
          <Route path="/tokenizer" component={Tokenizer} />
          <Route path="/token/:token" component={Calculator} />
          <Route path="/" component={Calculator} />
        </Switch>
      </Col>
    </Row>
  )
}

export default Routes
