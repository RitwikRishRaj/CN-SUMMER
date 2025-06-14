import React from 'react'

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Inactive' },
]

const Table = () => {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">User List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                ID
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                Email
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-500">{item.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
