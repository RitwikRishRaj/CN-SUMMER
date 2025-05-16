import React from 'react'
import { Layout } from './components/layout'
import Dashboard from './pages/dashboard'
import Navbar from './components/navbar'

function App() {
  return (
    <Layout>
      <Navbar />
      <Dashboard />
    </Layout>
  )
}

export default App
