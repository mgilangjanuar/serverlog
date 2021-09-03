import { CopyOutlined, MinusCircleOutlined, QuestionCircleOutlined, SettingOutlined, ContainerOutlined, KeyOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Drawer, Empty, Form, Input, Layout, message, Popconfirm, Row, Space, Spin, Tooltip, Typography } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { write } from 'clipboardy'
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
  const [appKeys, setAppKeys] = useState<any>()
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
        .then(data => {
          mutate('/applications?sort.created_at=desc')
          message.success('Saved')
          setApp(false)
          setLoading(false)
          localStorage.setItem(`sl:privkey:${data.application?.id}`, data.private)
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

  const copy = (value: string) => {
    write(value)
    message.info('copied')
  }

  useEffect(() => {
    localStorage.setItem(`sl:privkey:${appKeys?.id}`, appKeys?.private_key)
  }, [appKeys])

  return <Row style={{ minHeight: '85vh', padding: '30px 0 0' }}>
    <Col sm={{ span: 20, offset: 2 }} span={24}>
      <Layout.Content>
        <Space>
          <Button style={{ marginRight: '10px' }} type="primary" onClick={() => setApp({ id: 'create', uids: [user?.id] })}>Create App</Button>
          UUID <Tooltip title="You can ask others to invite you to their apps with this ID"><QuestionCircleOutlined /></Tooltip>
          <Input.Search value={user?.id} contentEditable={false} enterButton={<CopyOutlined />} onSearch={copy} />
        </Space>
      </Layout.Content>
      <Divider />
      {!data && !error ? <div style={{ textAlign: 'center' }}><Spin /></div> : ''}
      {data?.applications && !data.applications.length ? <Empty /> : ''}
      <Layout>
        <Row gutter={9}>
          {data?.applications.map((application: any) => <Col key={application.id} lg={8} md={12} span={24}>
            <Card hoverable bodyStyle={{ height: '98px' }} style={{ margin: '5px 0' }} title={<>
              {application.name}<br /><Typography.Text style={{ fontSize: '14px' }} type="secondary">{application.url?.replace(/^https?\:\/\//gi, '') || 'undefined'}</Typography.Text>
            </>} actions={[
              <Button  type="link" icon={<SettingOutlined />} onClick={() => setApp(application)} />,
              <Button  type="link" icon={<KeyOutlined />} onClick={() => setAppKeys({ ...application, private_key: localStorage.getItem(`sl:privkey:${application?.id}`) })} />,
              <Button block type="link" onClick={() => history.push(`/dashboard/${application.id}`)} icon={<ContainerOutlined />} />
            ]}>
              <Card.Meta description={<Typography.Paragraph ellipsis={{ rows: 2 }}>{application.description || 'no description'}</Typography.Paragraph>} />
            </Card>
          </Col>)}
        </Row>
      </Layout>
    </Col>
    <Drawer title={app?.id === 'create' ? 'Create New App' : `Update ${app?.name}`} visible={app?.id} onClose={() => setApp(undefined)}>
      <Form form={form} onFinish={save} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
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
        {app?.id && app?.id !== 'create' ? <Form.Item label="Members">
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
                <Col span={22}>
                  <Form.Item {...field} rules={[{ required: true, message: 'ID is required' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Button icon={<MinusCircleOutlined />} type="link" danger onClick={() => remove(field.name)} />
                </Col>
              </Row>)}
              <Form.Item>
                <Button onClick={() => add()}>Add user</Button>
              </Form.Item>
            </>}
          </Form.List>
        </Form.Item> : ''}
        <Form.Item style={{ textAlign: 'right' }} wrapperCol={{ span: 18 }}>
          <Space>
            {app?.id && app?.id !== 'create' ? <Popconfirm title="Are you sure?" onConfirm={() => remove(app)}>
              <Button danger>Remove</Button>
            </Popconfirm> : ''}
            <Button htmlType="submit" type="primary" loading={loading}>Save</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
    <Drawer title={`Keys of ${appKeys?.name}`} visible={appKeys?.id} onClose={() => setAppKeys(undefined)}>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
        <Form.Item label={<>SDK Key&nbsp; <Tooltip placement="topLeft" title="Save this key for init the SDK"><QuestionCircleOutlined /></Tooltip></>}>
          <Input.Search value={appKeys?.key} contentEditable={false} enterButton={<CopyOutlined />} onSearch={copy} />
        </Form.Item>
        <Divider />
        <Form.Item label={<>Private Key&nbsp; <Tooltip placement="bottomLeft" title="It's used to decrypt your log data, please don't share this with anyone except members of this app."><WarningOutlined /></Tooltip></>}>
          <Input.TextArea rows={6} value={appKeys?.private_key} contentEditable={false}
            onChange={({ target }) => setAppKeys({ ...appKeys, private_key: target.value })} />
          <Typography.Paragraph type="secondary">
            <strong>Your private key will be saved in the client-side/browser only.</strong> For security concerns, developers can't even decrypt your data.
          </Typography.Paragraph>
        </Form.Item>
      </Form>
    </Drawer>
  </Row>
}

export default Main