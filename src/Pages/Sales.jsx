import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import api from "../lib/axios"; // rename to api for clarity

export default function SalesReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState("daily");
  const [start, setStart] = useState(""); // YYYY-MM-DD
  const [end, setEnd] = useState("");

  // define fetchReport outside useEffect so you can call it from button
  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = { trend };
      if (start && end) {
        params.start = start;
        params.end = end;
      }

      const res = await api.get("/sales", { params });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching sales report:", err);
    } finally {
      setLoading(false);
    }
  }, [start, end, trend]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading) return <p className="text-center py-10">Loading report...</p>;
  if (!data) return <p className="text-center py-10">No data available</p>;

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* === Filters === */}
      <div className="flex flex-wrap gap-4 col-span-1 lg:col-span-2">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Trend</label>
          <select
            value={trend}
            onChange={(e) => setTrend(e.target.value)}
            className="border rounded p-2"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <Button onClick={fetchReport}>Apply</Button>
      </div>

      {/* === Sales Summary === */}
      <Card className="col-span-1 lg:col-span-2">
        <CardContent className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-xl font-bold">Sales Summary</h2>
            <p>
              Total Revenue:{" "}
              <span className="font-semibold">
                ${data.totalRevenue.toFixed(2)}
              </span>
            </p>
            <p>
              Total Orders:{" "}
              <span className="font-semibold">{data.totalOrders}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setTrend("daily")}
              variant={trend === "daily" ? "default" : "outline"}
            >
              Daily
            </Button>
            <Button
              onClick={() => setTrend("monthly")}
              variant={trend === "monthly" ? "default" : "outline"}
            >
              Monthly
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 1. Sales Trend */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Sales by Category */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.categorySales}
                dataKey="revenue"
                nameKey="_id"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {data.categorySales.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Top & Least Selling Products */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <ul className="space-y-2">
            {data.topProducts.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item._id}</span>
                <span className="font-semibold">x{item.qty}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Least Selling Products</h3>
          <ul className="space-y-2">
            {data.leastProducts.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item._id}</span>
                <span className="font-semibold">x{item.qty}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 4. Sales by Time of Day */}
      <Card className="col-span-1 ">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sales by Time of Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.timeOfDaySalesOrders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-1 ">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sales by Time of Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.timeOfDaySalesRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* 5. Sales by Day of Week */}
      <Card className="col-span-1 ">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sales by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueByDayOfWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                tickFormatter={(day) =>
                  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day - 1]
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(day) =>
                  [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ][day - 1]
                }
              />
              <Legend />
              <Bar dataKey="revenue" fill="#ff7f50" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-1 ">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sales by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.ordersByDayOfWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                tickFormatter={(day) =>
                  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day - 1]
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(day) =>
                  [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ][day - 1]
                }
              />
              <Legend />
              <Bar dataKey="orders" fill="#00c49f" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
