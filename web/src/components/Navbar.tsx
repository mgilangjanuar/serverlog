import { CopyOutlined } from '@ant-design/icons'
import { Layout, message } from 'antd'
import { write } from 'clipboardy'
import React from 'react'

interface Props {
  user?: any
}

const Navbar: React.FC<Props> = ({ user }) => {
  const copyUuid = () => {
    write(user?.id)
    message.info('copied')
  }
  return <>
    <Layout.Header>
      <div style={{ cursor: 'pointer' }} onClick={e => e.preventDefault()} className="logo">
        server.log()
      </div>
      {user ? <div style={{ float: 'right' }} className="logo">
        {user?.id} <CopyOutlined onClick={copyUuid} />
      </div> : ''}
    </Layout.Header>
  </>
}

export default Navbar