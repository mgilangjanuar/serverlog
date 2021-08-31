import { Button, Col, Drawer, Input, List, Result, Row, Tag, Typography } from 'antd'
import moment from 'moment'
import qs from 'qs'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../../utils/Fetcher'

interface Props {
  appId: string,
  user?: any
}

const PAGE_SIZE = 20

const Log: React.FC<Props> = ({ appId }) => {
  const [page, setPage] = useState<number>(0)
  const [timeRange, setTimeRange] = useState<number | undefined>(300_000)
  const [param, setParam] = useState<any>()
  const [data, setData] = useState<any[]>()
  const [recover, setRecover] = useState<{ search: string | null, data?: any[] }>()
  const { data: logs, error } = useSWR(param ? `/applications/${appId}/logs?${qs.stringify(param)}` : null, fetcher)
  const [log, setLog] = useState<any>()

  useEffect(() => {
    if (logs?.logs) {
      if (page === 0) {
        setData(logs.logs)
      } else {
        const newData = [...data?.filter(d => !logs.logs.find((log: any) => log.id === d.id)) || [], ...logs.logs]
        newData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        setData(newData)
        setRecover({ search: null, data: newData })
      }
    }
  }, [logs])

  useEffect(() => {
    if (page) {
      setParam({
        size: PAGE_SIZE,
        page,
        ...timeRange ? { 'created_at.gt': new Date(new Date().getTime() - timeRange).toISOString() } : {}
      })
    }
  }, [page])

  useEffect(() => {
    setPage(0)
    setParam({
      size: PAGE_SIZE,
      page: 0,
      ...timeRange ? { 'created_at.gt': new Date(new Date().getTime() - timeRange).toISOString() } : {}
    })
  }, [timeRange])

  const load = () => {
    if (logs?.logs.length < PAGE_SIZE) {
      setParam({ ...param, t: new Date().getTime() })
    } else {
      setPage(page + 1)
    }
  }

  const search = (value: string) => {
    if (value) {
      setRecover({ search: value, data: recover?.data || data })
    } else {
      setParam({ ...param, t: new Date().getTime() })
    }
  }

  useEffect(() => {
    if (recover?.search) {
      setData(recover.data?.filter(item => item.log_data.match(new RegExp(`${recover.search}`, 'gi'))))
    }
  }, [recover])

  return <Row style={{ minHeight: '85vh', padding: '30px 0 0' }}>
    <Col sm={{ span: 20, offset: 2 }} span={24}>
      {error?.status === 403 ? <Result status="403" /> : <>
        <Typography.Paragraph>
          <Input.Search placeholder="Search..." onSearch={search} enterButton allowClear />
        </Typography.Paragraph>
        <Typography.Paragraph style={{ textAlign: 'right' }}>
          <Button type={timeRange === 60_000 ? 'primary' : 'default'} onClick={() => setTimeRange(60_000)}>1m</Button>
          <Button type={timeRange === 300_000 ? 'primary' : 'default'} onClick={() => setTimeRange(300_000)}>5m</Button>
          <Button type={timeRange === 600_000 ? 'primary' : 'default'} onClick={() => setTimeRange(600_000)}>10m</Button>
          <Button type={timeRange === 1_800_000 ? 'primary' : 'default'} onClick={() => setTimeRange(1_800_000)}>30m</Button>
          <Button type={timeRange === 14_400_000 ? 'primary' : 'default'} onClick={() => setTimeRange(14_400_000)}>4h</Button>
          <Button type={timeRange === 0 ? 'primary' : 'default'} onClick={() => setTimeRange(0)}>all</Button>
        </Typography.Paragraph>
        <List loading={!logs && !error} size="small" dataSource={data} renderItem={item => <List.Item onClick={() => setLog(item)} style={{ cursor: 'pointer', padding: 0 }}>
          <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ wordBreak: 'break-all' }}>
            <Tag color={item.type === 'error' ? 'red' : item === 'warn' ? 'orange' : 'default'}>
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