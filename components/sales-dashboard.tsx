"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock data - in a real app, this would come from an API
const salesData = [
  { month: "Jan", sales: 12, revenue: 349.88 },
  { month: "Feb", sales: 19, revenue: 549.71 },
  { month: "Mar", sales: 15, revenue: 429.85 },
  { month: "Apr", sales: 22, revenue: 639.78 },
  { month: "May", sales: 28, revenue: 809.72 },
  { month: "Jun", sales: 25, revenue: 719.75 },
]

const genreData = [
  { name: "HipHop", value: 28 },
  { name: "Rap", value: 22 },
  { name: "Lo-Fi", value: 18 },
  { name: "Electronic", value: 16 },
  { name: "Alternative HipHop", value: 12 },
]

const COLORS = ["#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"]

const recentSales = [
  {
    id: "1",
    beatTitle: "Midnight Dreams",
    license: "Premium",
    customer: "john.doe@example.com",
    date: "2023-05-15",
    amount: 79.99,
    status: "Completed",
  },
  {
    id: "2",
    beatTitle: "Summer Vibes",
    license: "Basic",
    customer: "jane.smith@example.com",
    date: "2023-05-14",
    amount: 24.99,
    status: "Completed",
  },
  {
    id: "3",
    beatTitle: "Urban Legend",
    license: "Exclusive",
    customer: "mike.johnson@example.com",
    date: "2023-05-12",
    amount: 299.99,
    status: "Completed",
  },
  {
    id: "4",
    beatTitle: "Neon Lights",
    license: "Basic",
    customer: "sarah.williams@example.com",
    date: "2023-05-10",
    amount: 27.99,
    status: "Completed",
  },
  {
    id: "5",
    beatTitle: "Cosmic Journey",
    license: "Premium",
    customer: "alex.brown@example.com",
    date: "2023-05-08",
    amount: 79.99,
    status: "Completed",
  },
]

export default function SalesDashboard() {
  const [timeRange, setTimeRange] = useState("6m")

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0)
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0)
  const averageOrderValue = totalRevenue / totalSales

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-500 mt-1">+12.5% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-green-500 mt-1">+8.2% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-green-500 mt-1">+3.1% from last period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="genres">Genre Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="bg-zinc-900 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Revenue Over Time</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-zinc-800 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="genres" className="bg-zinc-900 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Sales by Genre</h3>
          </div>

          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ""} ${percent ? (percent * 100).toFixed(0) : "0"}%`
                  }
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value) => [`${value}%`, "Percentage"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-zinc-900 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-6">Recent Sales</h3>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beat</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.beatTitle}</TableCell>
                  <TableCell>{sale.license}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>${sale.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-600">{sale.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
