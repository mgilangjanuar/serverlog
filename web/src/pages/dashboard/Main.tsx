import { MinusCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { Button, Card, Col, Drawer, Empty, Form, Input, message, Popconfirm, Row, Space, Spin, Typography } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Layout from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import { fetcher } from '../../utils/Fetcher'

interface Props {
  user?: any
}

const Main: React.FC<Props> = ({ user }) => {
  const { data, error } = useSWR('/applications?sort.created_at=desc', fetcher)
  const [app, setApp] = useState<any>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm()
  const history = useHistory()

  useEffect(() => {
    if (app) {
      form.setFieldsValue(app)
    } else {
      form.resetFields()
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
      }).catch(({ response }) => {
        message.error(response?.data?.error || 'Something error')
      })
  }

  return <Row style={{ minHeight: '85vh', padding: '70px 0' }}>
    <Col sm={{ span: 20, offset: 2 }} span={24}>
      <Typography.Paragraph>
        <Button type="primary" onClick={() => setApp({ id: 'create', uids: [user?.id] })}>Create App</Button>
      </Typography.Paragraph>
      {!data && !error ? <div style={{ textAlign: 'center' }}><Spin /></div> : ''}
      {data?.applications && !data.applications.length ? <Empty /> : ''}
      <Layout>
        <Row gutter={9}>
          {data?.applications.map((application: any) => <Col key={application.id} lg={8} md={12} span={24}>
            <Card hoverable bodyStyle={{ height: '115px' }} style={{ margin: '5px 0' }} title={<>
              {application.name}<br /><Typography.Text style={{ fontSize: '14px' }} type="secondary">{application.url?.replace(/^https?\:\/\//gi, '') || 'undefined'}</Typography.Text>
            </>} extra={<Button  type="link" icon={<SettingOutlined />} onClick={() => setApp(application)} />}
            actions={[<Button block type="link" onClick={() => history.push(`/dashboard/${application.id}`)}>View Logs</Button>]}>
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
        <Form.Item name="key" label="Key">
          <Input disabled />
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
        <Form.Item label="Users Invitation">
          <Form.List name="uids" rules={[
            {
              validator: async (_, uids) => {
                if (!uids?.length) {
                  return Promise.reject(new Error('At least 1 user'))
                }
              },
            },
          ]}>
            {(fields, { add, remove }) => <>
              {fields.map((field, i) => <Row gutter={14} key={i}>
                <Col span={23}>
                  <Form.Item {...field} rules={[{ required: true, message: 'ID is required' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={1}>
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Col>
              </Row>)}
              <Form.Item>
                <Button onClick={() => add()}>Add user</Button>
              </Form.Item>
            </>}
          </Form.List>
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