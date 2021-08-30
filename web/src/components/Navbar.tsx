import { CopyOutlined } from '@ant-design/icons'
import { Layout, message, Tooltip } from 'antd'
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
        <Tooltip title="You can ask others to invite you to their apps with this ID" placement="bottom">
          {user?.id} <CopyOutlined onClick={copyUuid} />
        </Tooltip>
      </div> : ''}
    </Layout.Header>
  </>
}

export default Navbar