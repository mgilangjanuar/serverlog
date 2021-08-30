import { SettingOutlined } from '@ant-design/icons'
import { Button, Card, Col, Drawer, Empty, Form, Input, message, Popconfirm, Row, Space, Spin, Typography } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Layout from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { fetcher } from '../../utils/Fetcher'

interface Props {
  user?: any
}

const Main: React.FC<Props> = () => {
  const { data, error } = useSWR('/applications?sort.created_at=desc', fetcher)
  const [app, setApp] = useState<any>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm()

  useEffect(() => {
    if (app) {
      form.setFieldsValue(app)
    }
  }, [app])

  const save = () => {
    const application = form.getFieldsValue()
    setLoading(true)
    if (application.id === 'create') {
      fetcher('/applications', 'post', { application: { ...application, id: undefined } })
        .then(() => {
          mutate('/applications?sort.created_at=desc')
          message.success('Saved')
          setApp(false)
          form.resetFields()
          setLoading(false)
        }).catch(({ response }) => {
          message.error(response?.data?.error || 'Something error')
          setLoading(false)
        })
    } else {
      fetcher(`/applications/${application.id}`, 'patch', { application })
        .then(() => {
          mutate('/applications?sort.created_at=desc')
          message.success('Updated')
          setApp(false)
          form.resetFields()
          setLoading(false)
        }).catch(({ response }) => {
          message.error(response?.data?.error || 'Something error')
          setLoading(false)
        })
    }
  }

  const remove = (app: any) => {
    fetcher(`/applications/${app.id}`, 'delete')
      .then(() => {
        mutate('/applications?sort.created_at=desc')
        message.success('Deleted')
        setApp(false)
        form.resetFields()
      }).catch(({ response }) => {
        message.error(response?.data?.error || 'Something error')
      })
  }

  return <Row style={{ minHeight: '85vh', padding: '0 0 70px' }}>
    <Col sm={{ span: 20, offset: 2 }} span={24}>
      <Typography.Paragraph>
        <Button type="primary" onClick={() => setApp({ id: 'create' })}>Create App</Button>
      </Typography.Paragraph>
      {!data && !error ? <div style={{ textAlign: 'center' }}><Spin /></div> : ''}
      {data?.applications && !data.applications.length ? <Empty /> : ''}
      <Layout>
        <Row gutter={9}>
          {data?.applications.map((application: any) => <Col key={application.id} lg={8} md={12} span={24}>
            <Card hoverable bodyStyle={{ height: '115px' }} style={{ margin: '5px 0' }} title={<>
              {application.name}<br /><Typography.Text style={{ fontSize: '14px' }} type="secondary">{application.url?.replace(/^https?\:\/\//gi, '') || 'undefined'}</Typography.Text>
            </>} extra={<Button  type="link" icon={<SettingOutlined />} onClick={() => setApp(application)} />}>
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
    <Drawer title={`Update ${app?.name}`} visible={app?.id} onClose={() => setApp(undefined)}>
      <Form form={form} onFinish={save} layout="vertical">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="url" label="URL">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item style={{ float: 'right' }}>
          <Space>
            <Popconfirm title="Are you sure?" onConfirm={() => remove(app)}>
              <Button danger>Remove</Button>
            </Popconfirm>
            <Button htmlType="submit" type="primary" loading={loading}>Save</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  </Row>
}

export default Main