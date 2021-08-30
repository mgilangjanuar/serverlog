import { SettingOutlined } from '@ant-design/icons'
import { Button, Card, Col, Empty, Row, Space, Spin, Typography } from 'antd'
import Layout from 'antd/lib/layout/layout'
import React from 'react'
import useSWR from 'swr'
import { fetcher } from '../../utils/Fetcher'

interface Props {
  user?: any
}

const Main: React.FC<Props> = () => {
  const { data, error } = useSWR('/applications?sort.created_at=desc', fetcher)


  return <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
    <Col sm={{ span: 20, offset: 2 }} span={24}>
      {!data && !error ? <div style={{ textAlign: 'center' }}><Spin /></div> : ''}
      {data?.applications && !data.applications.length ? <Empty /> : ''}
      <Layout>
        <Row gutter={9}>
          {data?.applications.map((application: any) => <Col key={application.id} lg={8} md={12} span={24}>
            <Card hoverable bodyStyle={{ height: '115px' }} style={{ margin: '5px 0' }} title={<>
              {application.name}<br /><Typography.Text style={{ fontSize: '14px' }} type="secondary">{application.url ? application.url.replace(/^https?\:\/\//gi, '') : 'undefined'}</Typography.Text>
            </>} extra={<Space><Button size="small" type="link" icon={<SettingOutlined />} /></Space>}>
              <Card.Meta description={<>
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {application.description || 'no description'}
                </div>
              </>} />
            </Card>
          </Col>)}
        </Row>
      </Layout>
    </Col>
  </Row>
}

export default Main