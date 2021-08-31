import { Button, Col, Drawer, Layout, List, Row, Tag, Typography } from 'antd'
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
  const { data: logs, error } = useSWR(param ? `/applications/${appId}/logs?${qs.stringify(param)}` : null, fetcher)
  const [log, setLog] = useState<any>()

  useEffect(() => {
    if (logs?.logs) {
      setData([...data?.filter(d => !logs.logs.find((log: any) => log.id === d.id)) || [], ...logs.logs])
    }
  }, [logs])

  useEffect(() => {
    setParam({
      size: PAGE_SIZE,
      page,
      ...timeRange ? { 'created_at.gt': new Date(new Date().getTime() - timeRange).toISOString() } : {}
    })
  }, [timeRange, page])

  const load = () => {
    if (logs?.logs.length < PAGE_SIZE) {
      setParam({ ...param, t: new Date().getTime() })
    } else {
      setPage(page + 1)
    }
  }

  return <Row style={{ minHeight: '85vh', padding: '30px 0' }}>
    <Col sm={{ span: 20, offset: 2 }} span={24}>
      <Typography.Paragraph>
        <Button type={timeRange === 60_000 ? 'primary' : 'default'} onClick={() => setTimeRange(60_000)}>1m</Button>
        <Button type={timeRange === 300_000 ? 'primary' : 'default'} onClick={() => setTimeRange(300_000)}>5m</Button>
        <Button type={timeRange === 600_000 ? 'primary' : 'default'} onClick={() => setTimeRange(600_000)}>10m</Button>
        <Button type={timeRange === 1_800_000 ? 'primary' : 'default'} onClick={() => setTimeRange(1_800_000)}>30m</Button>
        <Button type={timeRange === 7_200_000 ? 'primary' : 'default'} onClick={() => setTimeRange(7_200_000)}>2h</Button>
        <Button type={timeRange === 0 ? 'primary' : 'default'} onClick={() => setTimeRange(0)}>all</Button>
      </Typography.Paragraph>
      <Layout.Content style={{ height: '80vh', overflowY: 'auto' }}>
        <List size="small" dataSource={data} renderItem={item => <List.Item onClick={() => setLog(item)} style={{ cursor: 'pointer' }}>
          <Typography.Paragraph>
            <Tag color={item.type === 'error' ? 'red' : item === 'warn' ? 'orange' : 'default'}>
              {moment(item.created_at).format('MMM DD, HH:mm:ss.SSS')}
            </Tag>
            <Typography.Text type={item.type === 'error' ? 'danger' : item.type === 'warn' ? 'warning' : undefined}>
              {item.log_data}
            </Typography.Text>
          </Typography.Paragraph>
        </List.Item>} />
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          <Button loading={!logs && !error} onClick={load}>load more</Button>
        </Typography.Paragraph>
      </Layout.Content>
    </Col>
    <Drawer title={moment(log?.created_at).format('MMM DD, HH:mm:ss.SSS')} visible={log?.id} onClose={() => setLog(undefined)}>
      <Typography.Text type={log?.type === 'error' ? 'danger' : log?.type === 'warn' ? 'warning' : undefined}><pre>{log?.log_data}</pre></Typography.Text>
    </Drawer>
  </Row>

}

export default Log