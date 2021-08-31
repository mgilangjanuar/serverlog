import { Col, Divider, Layout, Row, Typography } from 'antd'
import JSCookie from 'js-cookie'
import QueryString from 'querystring'
import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import LoginButtons from '../components/LoginButtons'
import Navbar from '../components/Navbar'

const Home: React.FC = () => {
  useEffect(() => {
    const token = QueryString.decode(window.location.hash.replace(/^\#/gi, ''))
    if (token.access_token) {
      JSCookie.set('authorization', token.access_token)
      localStorage.setItem('refresh_token', token.refresh_token as string)
      window.location.replace('/dashboard')
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <div>
    <Navbar />
    <Layout.Content style={{ marginTop: '40px' }}>
      <Row>
        <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
          <Typography.Paragraph style={{ textAlign: 'center' }}>
            <img style={{ width: '100%' }} alt="Code Version Control.svg" src="./Code Version Control.svg" />
          </Typography.Paragraph>
          <div style={{ padding: '0 10px 24px' }}>
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              👋 Say good bye to
              <Typography.Text type="danger">
                <code>console.log('Fvck you!', theFuckerObjectThatMadeErrorsButWorksInMyMachine)</code>
              </Typography.Text>
            </Typography.Paragraph>
            {/* <Typography.Paragraph style={{ textAlign: 'center' }}>
              <Typography.Text type="secondary"><strong>server.log();</strong> your valuable time saver</Typography.Text>
            </Typography.Paragraph> */}
            <Divider>Login</Divider>
            <LoginButtons />
          </div>
        </Col>
      </Row>
    </Layout.Content>

    <Footer />
  </div>
}

export default Home