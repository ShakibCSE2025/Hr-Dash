import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  UserCheck,
  UserX,
  Clock,
  Award,
  Target,
  AlertCircle,
  Building,
  Briefcase,
  GraduationCap,
  Bell,
  ChevronRight,
  Download,
  Filter,
  MoreVertical
} from 'lucide-react';
import MetricCard from '../Common/MetricCard';
import Chart from '../Common/Chart';
import { mockEmployees, mockPerformanceData, mockAttendanceData, mockRecruitmentData, mockTrainingData } from '../../data/mockData';

interface OverviewProps {
  setActiveSection?: (section: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ setActiveSection }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Calculate dynamic metrics from mock data
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const avgPerformance = mockEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / mockEmployees.length;
  const avgAttendance = mockEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / mockEmployees.length;
  const totalPayroll = mockEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  
  // Recent attendance data
  const recentAttendance = mockAttendanceData.slice(-7);
  const todayPresent = recentAttendance[recentAttendance.length - 1]?.present || 0;
  const todayAbsent = recentAttendance[recentAttendance.length - 1]?.absent || 0;
  const todayLate = recentAttendance[recentAttendance.length - 1]?.late || 0;

  // Performance trend data
  const performanceTrendData = mockPerformanceData.slice(-6).map(item => ({
    label: item.month,
    value: item.score
  }));

  // Employee growth data (simulated)
  const employeeGrowthData = [
    { label: 'Jan', value: totalEmployees - 50 },
    { label: 'Feb', value: totalEmployees - 42 },
    { label: 'Mar', value: totalEmployees - 35 },
    { label: 'Apr', value: totalEmployees - 28 },
    { label: 'May', value: totalEmployees - 15 },
    { label: 'Jun', value: totalEmployees }
  ];

  // Department breakdown
  const departmentBreakdown = mockEmployees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(departmentBreakdown).map(([dept, count]) => ({
    label: dept,
    value: count
  }));

  // Top performers
  const topPerformers = mockEmployees
    .sort((a, b) => b.performanceRating - a.performanceRating)
    .slice(0, 5);

  // Recent hires
  const recentHires = mockEmployees
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 3);

  // Upcoming reviews (simulated)
  const upcomingReviews = mockEmployees
    .filter(emp => emp.performanceRating < 4.5)
    .slice(0, 4);

  const handleQuickAction = (action: string, section?: string) => {
    if (section && setActiveSection) {
      setActiveSection(section);
    } else {
      // Handle other quick actions
      switch (action) {
        case 'add-employee':
          alert('Add Employee functionality - would open employee form');
          break;
        case 'process-payroll':
          alert('Process Payroll functionality - would open payroll processing');
          break;
        case 'generate-report':
          alert('Generate Report functionality - would open report generator');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your team today.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Employees"
          value={totalEmployees.toString()}
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          subtitle={`${activeEmployees} active`}
        />
        <MetricCard
          title="Avg Performance"
          value={avgPerformance.toFixed(1)}
          icon={TrendingUp}
          trend={{ value: 5.3, isPositive: true }}
          subtitle="Out of 5.0"
        />
        <MetricCard
          title="Attendance Rate"
          value={`${Math.round(avgAttendance)}%`}
          icon={Calendar}
          trend={{ value: 2.1, isPositive: false }}
          subtitle="This month"
        />
        <MetricCard
          title="Monthly Payroll"
          value={`$${Math.round(totalPayroll / 1000)}K`}
          icon={DollarSign}
          trend={{ value: 3.7, isPositive: true }}
          subtitle="Total monthly"
        />
      </div>

      {/* Today's Snapshot */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Snapshot</h3>
          <button 
            onClick={() => handleQuickAction('view-attendance', 'attendance')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
          >
            <span>View Details</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{todayPresent}</p>
              <p className="text-sm text-gray-600">Present Today</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{todayAbsent}</p>
              <p className="text-sm text-gray-600">Absent Today</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{todayLate}</p>
              <p className="text-sm text-gray-600">Late Arrivals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Employee Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Employee Growth</h3>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +8.2%
            </div>
          </div>
          <Chart data={employeeGrowthData} type="line" height={250} color="#3B82F6" />
        </div>

        {/* Performance Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
            <button 
              onClick={() => handleQuickAction('view-performance', 'performance')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Details
            </button>
          </div>
          <Chart data={performanceTrendData} type="bar" height={250} color="#8B5CF6" />
        </div>
      </div>

      {/* Department Overview & Top Performers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Department Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
            <button 
              onClick={() => handleQuickAction('view-employees', 'employees')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {departmentData.slice(0, 6).map((dept, index) => (
              <div key={dept.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{dept.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{dept.value}</span>
                  <p className="text-xs text-gray-500">employees</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            <button 
              onClick={() => handleQuickAction('view-performance', 'performance')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {topPerformers.map((employee, index) => (
              <div key={employee.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                  <p className="text-sm text-gray-600 truncate">{employee.department}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-lg font-bold text-green-600">{employee.performanceRating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500">#{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Hires */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Hires</h3>
            <button 
              onClick={() => handleQuickAction('view-recruitment', 'recruitment')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentHires.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                  <p className="text-xs text-gray-600 truncate">{employee.role}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(employee.joinDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Reviews</h3>
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {upcomingReviews.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                  <p className="text-xs text-gray-600 truncate">{employee.department}</p>
                </div>
                <div className="text-xs text-yellow-600 font-medium">
                  Due Soon
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreVertical size={20} />
            </button>
          </div>
          {showQuickActions && (
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickAction('add-employee')}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <Users className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Add New Employee</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('process-payroll')}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <DollarSign className="h-5 w-5 text-gray-400 group-hover:text-green-500" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">Process Payroll</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('generate-report')}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
              >
                <Download className="h-5 w-5 text-gray-400 group-hover:text-purple-500" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Generate Report</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('view-training', 'training')}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
              >
                <GraduationCap className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">View Training</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* System Alerts & Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
          <button 
            onClick={() => handleQuickAction('view-notifications', 'notifications')}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
          >
            <Bell size={16} />
            <span>View All</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Performance Reviews Due</p>
              <p className="text-xs text-yellow-700 mt-1">4 employees need performance reviews this week</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Briefcase className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">Open Positions</p>
              <p className="text-xs text-blue-700 mt-1">{mockRecruitmentData.length} positions currently being recruited</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <GraduationCap className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Training Progress</p>
              <p className="text-xs text-green-700 mt-1">{mockTrainingData.length} active training programs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;