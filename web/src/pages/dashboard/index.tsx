import { Layout } from 'antd'
import React, { useEffect } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import useSWR from 'swr'
import Navbar from '../../components/Navbar'
import { fetcher } from '../../utils/Fetcher'
import Main from './Main'

interface PageProps extends RouteComponentProps<{
  page: string
}> {}

const Dashboard: React.FC<PageProps> = ({ match }) => {
  const history = useHistory()
  const { data: user } = useSWR('/auth/me', fetcher)

  useEffect(() => {
    if (user === null) {
      history.replace('/')
    }
  }, [history, user])

  return <>
    <Navbar />
    <Layout style={{ flexDirection: 'row' }}>
      <Layout.Content style={{ padding: '10px 10px 24px', margin: 0, minHeight: 280 }}>
        {!match.params.page || match.params.page === 'main' ? <Main user={user} /> : ''}
        {/* {match.params.page === 'post' ? <Post user={user} /> : ''}
        {match.params.page === 'profile' ? <Profile user={user} /> : ''} */}
      </Layout.Content>
    </Layout>
  </>
}

export default Dashboard