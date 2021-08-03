import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>Copyright &copy; 矮仔工作室</Col>
          <a href="https://wa.me/c/85294582889">
          <Col className='text-center py-3'>WhatsApp: +852 94582889 _Click Here_</Col>
          </a>
          <a href='https://www.instagram.com/shorts_studio/'>
          <Col className='text-center py-3'>IG: Shorts_studio  _Click Here_</Col>
          </a>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
