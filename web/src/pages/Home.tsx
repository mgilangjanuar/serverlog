import { Carousel, Col, Divider, Image, Layout, Row, Typography } from 'antd'
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
        <Col lg={{ span: 12, offset: 6 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
          <div style={{ padding: '0 10px' }}>
            <Typography.Title type="secondary" level={4} style={{ textAlign: 'center' }}>
              Say goodbye to console.log 👋
            </Typography.Title>
            <Typography.Title style={{ fontWeight: 200, textAlign: 'center', marginTop: 0 }}>
              The Lightweight Debugger Platform
            </Typography.Title>
            <Carousel style={{ boxShadow: '13px 13px 15px #f0f1f2' }} autoplay dots={false} effect="fade">
              <Image style={{ width: '100%' }} src="/Screen Shot 2021-09-01 at 00.19.46.png"/>
              <Image style={{ width: '100%' }} src="/Screen Shot 2021-09-01 at 00.20.11.png"/>
              <Image style={{ width: '100%' }} src="/Screen Shot 2021-09-01 at 00.20.25.png"/>
            </Carousel>
            <Typography.Paragraph style={{ marginTop: '50px' }}>
              Installation
              <pre style={{ overflowX: 'auto', whiteSpace: 'pre' }}>$ npm install serverlogjs@latest -S{'\n\n# with yarn\n'}$ yarn add serverlogjs@latest</pre>
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: '50px' }}>
              Usage
              <pre style={{ overflowX: 'auto', whiteSpace: 'pre' }}>import {'{'} ServerLog {'}'} from 'serverlogjs'{'\n\n'}ServerLog.init(APP_KEY){'\n\n'}// your another dirty code here...{'\n\n'}try {'{\n'}  const {'{'} data {'}'} = await axios.get('https://example.com'){'\n'}  ServerLog.log('Response:', data){'\n}'} catch (error) {'{\n'}  ServerLog.error('!ERROR:', error){'\n}'}</pre>
            </Typography.Paragraph>
            <Divider>Login 🚀</Divider>
            <LoginButtons />
            <img style={{ width: '100%' }} alt="Code Version Control.svg" src="./Code Version Control.svg" />
            <Typography.Title level={3}>Features</Typography.Title>
            <ul>
              <li>Free</li>
              <li>Collaborative monitoring</li>
              <li>Lightweight and clean</li>
              <li>Up to 10 applications</li>
              <li>Saving the last 12 hours log data</li>
              <li>Open source</li>
            </ul>
            <Typography.Title level={3}>Is it safe?</Typography.Title>
            <Typography.Paragraph>
              Your data will be encrypted with <a href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard" target="_blank">Advanced Encryption Standard (AES)</a> in database.
            </Typography.Paragraph>
          </div>
          <Image src="/Screen Shot 2021-08-31 at 17.06.27.png" alt="Screen Shot 2021-08-31 at 17.06.27.png" style={{ width: '100%' }} />
        </Col>
      </Row>
    </Layout.Content>

    <Footer />
  </div>
}

export default Home