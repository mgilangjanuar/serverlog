import { LogoutOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import JSCookie from 'js-cookie'
import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  user?: any
}

const logout = () => {
  JSCookie.remove('authorization')
  localStorage.removeItem('refresh_token')
  window.location.replace('/')
}

const Navbar: React.FC<Props> = ({ user }) => {
  return <>
    <Layout.Header>
      <div style={{ cursor: 'pointer' }} onClick={e => e.preventDefault()} className="logo">
        <Link to="/dashboard">ServerLog</Link>
      </div>
      {user ? <div style={{ float: 'right' }} className="logo">
        <Button onClick={logout} type="link" danger icon={<LogoutOutlined />} />
      </div> : ''}
    </Layout.Header>
  </>
}

export default Navbar