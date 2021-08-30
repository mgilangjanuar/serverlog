import { GithubOutlined, GoogleOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import React from 'react'
import { useAuthUrls } from '../hooks/auth/useAuthUrls'

const LoginButtons: React.FC = () => {
  const { data } = useAuthUrls()

  const login = (provider: string) => {
    if (data) {
      window.location.replace((data as any)[provider] as string)
    }
  }
  return <div>
    <Typography.Paragraph style={{ textAlign: 'center' }}>
      <Button onClick={() => login('google')} type="primary" style={{ padding: '0 40px' }} icon={<GoogleOutlined />}>Sign in with Google</Button>
    </Typography.Paragraph>
    <Typography.Paragraph style={{ textAlign: 'center' }}>
      <Button onClick={() => login('github')} style={{ background: '#000', color: '#fff', padding: '0 40px' }} icon={<GithubOutlined />}>Sign in with GitHub</Button>
    </Typography.Paragraph>
  </div>
}

export default LoginButtons