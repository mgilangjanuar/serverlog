import { GithubOutlined, GoogleOutlined } from '@ant-design/icons'
import { Button, Spin, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { fetcher } from '../utils/Fetcher'

const LoginButtons: React.FC = () => {
  const history = useHistory()
  const { data, error } = useSWRImmutable('/auth/urls', fetcher)
  const { data: user } = useSWR('/auth/me', fetcher)

  useEffect(() => {
    if (user) {
      history.replace('/dashboard')
    }
  }, [user])

  const login = (provider: string) => {
    if (data) {
      window.location.replace((data as any)[provider] as string)
    }
  }
  return <div>
    <Spin spinning={!data && !error}>
      <Typography.Paragraph style={{ textAlign: 'center' }}>
        <Button onClick={() => login('google')} type="primary" style={{ padding: '0 40px' }} icon={<GoogleOutlined />}>Sign in with Google</Button>
      </Typography.Paragraph>
      <Typography.Paragraph style={{ textAlign: 'center' }}>
        <Button onClick={() => login('github')} style={{ background: '#000', color: '#fff', padding: '0 40px' }} icon={<GithubOutlined />}>Sign in with GitHub</Button>
      </Typography.Paragraph>
    </Spin>
  </div>
}

export default LoginButtons