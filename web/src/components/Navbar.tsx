import { LeftOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'

interface Props {
  back?: boolean,
  title?: string
}

const Navbar: React.FC<Props> = ({ back, title }) => {
  const history = useHistory()

  return <>
    <Layout.Header style={{ ...title || back ? { padding: '0 15px' } : {} }}>
      <div style={{ cursor: 'pointer' }} onClick={e => back ? history.goBack() : e.preventDefault()} className="logo">
        {back ? <><LeftOutlined /> Back</> : title || 'server.log()'}
      </div>
    </Layout.Header>
  </>
}

export default Navbar