import React from 'react'
import Chart from '../components/chart'
import Table from '../components/table'

export default function Dashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6">
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="text-2xl font-bold">$4,567</div>
                <p className="text-sm text-gray-500">Revenue</p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="text-2xl font-bold">78%</div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="text-2xl font-bold">98%</div>
                <p className="text-sm text-gray-500">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Chart />
          <Table />
        </div>
      </div>
    </div>
  )
}
