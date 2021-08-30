import { Layout } from 'antd'
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/errors/NotFound'
import Dashboard from './pages/dashboard'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

import 'antd/dist/antd.min.css'
import './App.css'

function App(): React.ReactElement {
  return (
    <Layout className="App">
      <Switch>
        <Route path="/dashboard/:page?" exact component={Dashboard} />
        <Route path="/" exact component={Home} />
        <Route path="/terms" exact component={Terms} />
        <Route path="/privacy" exact component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  )
}

export default App
