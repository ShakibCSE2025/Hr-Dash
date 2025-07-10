import React from 'react';
import { TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import MetricCard from '../Common/MetricCard';
import Chart from '../Common/Chart';

const Overview: React.FC = () => {
  const metrics = [
    {
      title: 'Total Employees',
      value: '1,247',
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Monthly Payroll',
      value: '$847,320',
      change: '+8.2%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Attendance Rate',
      value: '94.2%',
      change: '-2.1%',
      trend: 'down' as const,
      icon: Calendar,
      color: 'orange'
    },
    {
      title: 'Performance Score',
      value: '87.5',
      change: '+5.3%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const chartData = [
    { month: 'Jan', employees: 1180, payroll: 780000 },
    { month: 'Feb', employees: 1195, payroll: 795000 },
    { month: 'Mar', employees: 1210, payroll: 810000 },
    { month: 'Apr', employees: 1225, payroll: 825000 },
    { month: 'May', employees: 1235, payroll: 835000 },
    { month: 'Jun', employees: 1247, payroll: 847320 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your team today.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Employee Growth</h3>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +5.7%
            </div>
          </div>
          <Chart
            data={chartData}
            xKey="month"
            yKey="employees"
            color="#3B82F6"
            height={200}
          />
        </div>

        {/* Payroll Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payroll Trends</h3>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +8.2%
            </div>
          </div>
          <Chart
            data={chartData}
            xKey="month"
            yKey="payroll"
            color="#10B981"
            height={200}
            formatValue={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
            <div className="text-center">
              <Users className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Add New Employee</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">Process Payroll</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">View Reports</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;