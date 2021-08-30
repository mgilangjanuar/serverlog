import { Col, Row } from 'antd'
import React from 'react'
import useSWR from 'swr'
import { fetcher } from '../../utils/Fetcher'

interface Props {
  user?: any
}

const Main: React.FC<Props> = ({ user }) => {
  const { data, error } = useSWR('/applications', fetcher)


  return <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
    <Col lg={{ span: 12, offset: 6 }} md={{ span: 18, offset: 2 }} sm={{ span: 20, offset: 2 }} span={24}>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. At harum iure, est illum numquam obcaecati, tenetur, nisi sunt soluta sed culpa rerum. Ut incidunt sunt aut libero atque illum distinctio?
    </Col>
  </Row>
}

export default Main