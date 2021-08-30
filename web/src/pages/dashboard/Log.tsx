import { Button, Col, Row, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import qs from 'qs'
import useSWR from 'swr'
import { fetcher } from '../../utils/Fetcher'

interface Props {
  appId: string,
  user?: any
}

const Log: React.FC<Props> = ({ appId, user }) => {
  const [page, setPage] = useState<number>(0)
  const [timeRange, setTimeRange] = useState<number | undefined>(300_000)
  const [param, setParam] = useState<any>()
  const [data, setData] = useState<any[]>()
  const { data: logs, error } = useSWR(param ? `/applications/${appId}/logs?${qs.stringify(param)}` : null, fetcher)

  useEffect(() => {
    if (logs?.logs) {
      setData([...data || [], ...logs.logs])
    }
  }, [logs])

  useEffect(() => {
    if (timeRange !== undefined) {
      setParam({
        size: 2,
        page,
        ...timeRange ? { 'created_at.gt': new Date(new Date().getTime() - timeRange).toISOString() } : {}
      })
    }
  }, [timeRange])

  useEffect(() => {
    if (page !== undefined) {
      setParam({
        size: 2,
        page,
        ...timeRange ? { 'created_at.gt': new Date(new Date().getTime() - timeRange).toISOString() } : {}
      })
    }
  }, [page])

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
      {!logs && !error ? <div style={{ textAlign: 'center' }}><Spin /></div> : ''}
    </Col>
  </Row>

}

export default Log