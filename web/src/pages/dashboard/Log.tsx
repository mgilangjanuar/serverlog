import { Button, Col, List, Row, Typography } from 'antd'
import moment from 'moment'
import qs from 'qs'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../../utils/Fetcher'

interface Props {
  appId: string,
  user?: any
}

const PAGE_SIZE = 2

const Log: React.FC<Props> = ({ appId }) => {
  const [page, setPage] = useState<number>(0)
  const [timeRange, setTimeRange] = useState<number | undefined>(300_000)
  const [param, setParam] = useState<any>()
  const [data, setData] = useState<any[]>()
  const { data: logs, error } = useSWR(param ? `/applications/${appId}/logs?${qs.stringify(param)}` : null, fetcher)

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

  return <Row style={{ minHeight: '85vh', padding: '70px 0' }}>
    <Col sm={{ span: 20, offset: 2 }} span={24}>
      <Typography.Paragraph>
        <Button type={timeRange === 60_000 ? 'primary' : 'default'} onClick={() => setTimeRange(60_000)}>1m</Button>
        <Button type={timeRange === 300_000 ? 'primary' : 'default'} onClick={() => setTimeRange(300_000)}>5m</Button>
        <Button type={timeRange === 600_000 ? 'primary' : 'default'} onClick={() => setTimeRange(600_000)}>10m</Button>
        <Button type={timeRange === 1_800_000 ? 'primary' : 'default'} onClick={() => setTimeRange(1_800_000)}>30m</Button>
        <Button type={timeRange === 7_200_000 ? 'primary' : 'default'} onClick={() => setTimeRange(7_200_000)}>2h</Button>
        <Button type={timeRange === 0 ? 'primary' : 'default'} onClick={() => setTimeRange(0)}>all</Button>
      </Typography.Paragraph>
      <List size="small" dataSource={data} renderItem={item => <List.Item>
        <Typography.Paragraph>
          <Typography.Text type={item.type === 'error' ? 'danger' : item === 'warn' ? 'warning' : undefined}>
            [{moment(item.created_at).fromNow()}] {item.log_data}
          </Typography.Text>
        </Typography.Paragraph>
      </List.Item>} />
      <Typography.Paragraph style={{ textAlign: 'center' }}>
        <Button disabled={logs?.logs.length < PAGE_SIZE} loading={!logs && !error} onClick={() => setPage(page + 1)}>Load more</Button>
      </Typography.Paragraph>
    </Col>
  </Row>

}

export default Log