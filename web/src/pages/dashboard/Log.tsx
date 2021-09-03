import { MenuOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Col, DatePicker, Divider, Drawer, Dropdown, Input, Layout, List, Menu, message, Result, Row, Space, Tag, Typography } from 'antd'
import moment from 'moment'
import qs from 'qs'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { fetcher, fetcherWithSecret } from '../../utils/Fetcher'

interface Props {
  appId: string,
  user?: any
}

const PAGE_SIZE = 20

const Log: React.FC<Props> = ({ appId }) => {
  const [page, setPage] = useState<number>(0)
  const [timeRange, setTimeRange] = useState<[moment.Moment, moment.Moment]>([moment().subtract(5, 'minutes'), moment()])
  const [param, setParam] = useState<any>()
  const [data, setData] = useState<any[]>()
  const [recover, setRecover] = useState<{ search: string | null, data?: any[] }>()
  const { data: logs, error } = useSWR(localStorage.getItem(`sl:privkey:${appId}`) && param ? [`/applications/${appId}/logs?${qs.stringify(param)}&sort.created_at=asc`, localStorage.getItem(`sl:privkey:${appId}`)] : null, fetcherWithSecret)
  // const { data: logs, error } = useSWR(param ? `/applications/${appId}/logs?${qs.stringify(param)}&sort.created_at=asc` : null, fetcher)
  const { data: application } = useSWRImmutable(`/applications/${appId}`, fetcher)
  const [log, setLog] = useState<any>()
  const history = useHistory()

  useEffect(() => {
    if (logs?.logs) {
      if (page === 0) {
        setRecover({ search: recover?.search || null, data: logs.logs })
      } else {
        const newData = [...data?.filter(d => !logs.logs.find((log: any) => log.id === d.id)) || [], ...logs.logs]
        setRecover({ search: recover?.search || null, data: newData })
      }
    }
  }, [logs])

  useEffect(() => {
    if (page) {
      setParam({
        size: PAGE_SIZE, page,
        ...timeRange?.length ? {
          ...timeRange[0] ? { 'created_at.gte': timeRange[0].toISOString() } : {},
          ...timeRange[1] ? { 'created_at.lte':  timeRange[1].toISOString() } : {}
        } : {}
      })
    }
  }, [page])

  useEffect(() => {
    setPage(0)
    setParam({
      size: PAGE_SIZE, page: 0,
      ...timeRange?.length ? {
        ...timeRange[0] ? { 'created_at.gte': timeRange[0].toISOString() } : {},
        ...timeRange[1] ? { 'created_at.lte':  timeRange[1].toISOString() } : {}
      } : {}
    })
  }, [timeRange])

  const load = () => {
    if (logs?.logs.length < PAGE_SIZE) {
      setParam({ ...param, t: new Date().getTime() })
    } else {
      setPage(page + 1)
    }
  }

  const search = (value?: string) => {
    setRecover({ search: value || null, data: recover?.data || data })
  }

  useEffect(() => {
    if (recover) {
      setData(recover?.search ? recover.data?.filter(item => item.log_data.match(new RegExp(`${recover.search}`, 'gi'))) : recover.data)
    }
  }, [recover])

  useEffect(() => {
    if (error) {
      message.error(error.data.error)
    }
  }, [error])

  return <Row style={{ minHeight: '85vh', padding: '30px 0 0' }}>
    <Col sm={{ span: 20, offset: 2 }} span={24}>
      {error?.status === 403 ? <Result status="403" title="Forbidden" subTitle={
        <Button type="primary" onClick={() => history.goBack()}>Back</Button>} /> : <>
        <Breadcrumb style={{ marginBottom: '15px' }}>
          <Breadcrumb.Item>
            <Link to="/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{application?.application.name}</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={16}>
          <Col lg={16} md={14} span={24}>
            <Typography.Paragraph>
              <Input.Search placeholder="Search..." onSearch={search} enterButton allowClear  />
            </Typography.Paragraph>
          </Col>
          <Col lg={8} md={10} span={24}>
            <Layout.Content>
              <Space>
                <DatePicker.RangePicker showNow picker="time" value={timeRange} onCalendarChange={val => setTimeRange(val as any)} />
                <Dropdown placement="bottomRight" overlay={<Menu>
                  <Menu.Item onClick={() => setTimeRange([moment().subtract(1, 'minute'), moment()])}>1 minute ago</Menu.Item>
                  <Menu.Item onClick={() => setTimeRange([moment().subtract(5, 'minutes'), moment()])}>5 minutes ago</Menu.Item>
                  <Menu.Item onClick={() => setTimeRange([moment().subtract(10, 'minutes'), moment()])}>10 minutes ago</Menu.Item>
                  <Menu.Item onClick={() => setTimeRange([moment().subtract(30, 'minutes'), moment()])}>30 minutes ago</Menu.Item>
                  <Menu.Item onClick={() => setTimeRange([moment().subtract(2, 'hours'), moment()])}>2 hours ago</Menu.Item>
                  <Menu.Item onClick={() => setTimeRange([moment().subtract(6, 'hours'), moment()])}>6 hours ago</Menu.Item>
                </Menu>}>
                  <Button type="text" icon={<MenuOutlined />} />
                </Dropdown>
              </Space>
            </Layout.Content>
          </Col>
        </Row>
        <Divider />
        <List loading={!logs && !error} size="small" dataSource={data}
          renderItem={item => <List.Item onClick={() => setLog(item)} style={{ border: 'none', cursor: 'pointer', padding: 0 }}>
            <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ wordBreak: 'break-all' }}>
              <Tag color={item.type === 'error' ? 'red' : item.type === 'warn' ? 'orange' : 'default'}>
                {moment(item.created_at).format('MMM DD, HH:mm:ss.SSSZ')}
              </Tag>
              <Typography.Text type={item.type === 'error' ? 'danger' : item.type === 'warn' ? 'warning' : undefined}>
                {item.log_data}
              </Typography.Text>
            </Typography.Paragraph>
          </List.Item>} />
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          <Button loading={!logs && !error} onClick={load}>load more</Button>
        </Typography.Paragraph>
      </>}
    </Col>
    <Drawer width={1200} title={moment(log?.created_at).format('MMM DD, HH:mm:ss.SSSZ')} visible={log?.id} onClose={() => setLog(undefined)}>
      <Typography.Text style={{ fontSize: '13px' }} type={log?.type === 'error' ? 'danger' : log?.type === 'warn' ? 'warning' : undefined}><pre>{log?.log_data}</pre></Typography.Text>
    </Drawer>
  </Row>

}

export default Log