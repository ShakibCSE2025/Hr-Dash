import React, { useState, useEffect } from 'react';
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
  MoreVertical,
  Zap,
  Star,
  TrendingDown,
  Activity,
  Eye,
  Settings,
  RefreshCw,
  BarChart3,
  PieChart,
  Globe,
  Shield,
  Sparkles
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
  const [animatedValues, setAnimatedValues] = useState({
    totalEmployees: 0,
    avgPerformance: 0,
    avgAttendance: 0,
    totalPayroll: 0
  });

  // Calculate dynamic metrics from mock data
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const avgPerformance = mockEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / mockEmployees.length;
  const avgAttendance = mockEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / mockEmployees.length;
  const totalPayroll = mockEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  
  // Animate numbers on load
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedValues({
        totalEmployees: Math.round(totalEmployees * easeOutQuart),
        avgPerformance: avgPerformance * easeOutQuart,
        avgAttendance: Math.round(avgAttendance * easeOutQuart),
        totalPayroll: Math.round(totalPayroll * easeOutQuart)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [totalEmployees, avgPerformance, avgAttendance, totalPayroll]);
  
  // Recent attendance data
  const recentAttendance = mockAttendanceData.slice(-7);
  const todayPresent = recentAttendance[recentAttendance.length - 1]?.present || 0;
  const todayAbsent = recentAttendance[recentAttendance.length - 1]?.absent || 0;
  const todayLate = recentAttendance[recentAttendance.length - 1]?.late || 0;

  // Performance trend data with multiple datasets
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

  // Multi-line chart data for advanced analytics
  const multiLineChartData = [
    {
      label: 'Performance',
      data: performanceTrendData,
      color: '#475569',
      fillOpacity: 0.1
    },
    {
      label: 'Attendance',
      data: recentAttendance.slice(-6).map((item, index) => ({
        label: performanceTrendData[index]?.label || `M${index + 1}`,
        value: Math.round((item.present / (item.present + item.absent)) * 100)
      })),
      color: '#64748b',
      fillOpacity: 0.1
    }
  ];

  // Department breakdown with enhanced data
  const departmentBreakdown = mockEmployees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = {
        count: 0,
        avgPerformance: 0,
        avgSalary: 0,
        employees: []
      };
    }
    acc[emp.department].count += 1;
    acc[emp.department].employees.push(emp);
    return acc;
  }, {} as Record<string, any>);

  // Calculate department averages
  Object.keys(departmentBreakdown).forEach(dept => {
    const employees = departmentBreakdown[dept].employees;
    departmentBreakdown[dept].avgPerformance = employees.reduce((sum: number, emp: any) => sum + emp.performanceRating, 0) / employees.length;
    departmentBreakdown[dept].avgSalary = employees.reduce((sum: number, emp: any) => sum + emp.salary, 0) / employees.length;
  });

  const departmentData = Object.entries(departmentBreakdown).map(([dept, data]) => ({
    label: dept,
    value: data.count,
    performance: data.avgPerformance,
    salary: data.avgSalary
  }));

  // Top performers
  const topPerformers = mockEmployees
    .sort((a, b) => b.performanceRating - a.performanceRating)
    .slice(0, 5);

  // Recent hires
  const recentHires = mockEmployees
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 4);

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

  const getDepartmentColor = (index: number) => {
    const colors = ['#475569', '#64748b', '#94a3b8', '#1e293b', '#334155', '#0f172a', '#475569', '#64748b'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen -m-6 p-6">
      {/* Professional Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
          <div className="space-y-4">
            {/* Welcome Back Greeting */}
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-600 mb-1">
                Welcome back, <span className="text-slate-700 font-semibold">John Doe</span> 👋
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <BarChart3 className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Executive Dashboard
                </h1>
                <p className="text-lg text-slate-600">Real-time insights into your organization's performance</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm font-medium"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="1year">Last Year</option>
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-400" />
              </div>
              <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200">
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-3 h-3 bg-slate-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">Live Data</span>
              <span className="text-xs text-slate-600">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Users className="h-6 w-6 text-slate-600" />
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 bg-slate-100 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">+8.2%</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Employees</h3>
            <p className="text-3xl font-bold text-slate-900">{animatedValues.totalEmployees}</p>
            <p className="text-sm text-gray-500">{activeEmployees} active • {totalEmployees - activeEmployees} inactive</p>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-slate-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(activeEmployees / totalEmployees) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-slate-600" />
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 bg-slate-100 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">+5.3%</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg Performance</h3>
            <p className="text-3xl font-bold text-slate-900">{animatedValues.avgPerformance.toFixed(1)}</p>
            <p className="text-sm text-gray-500">Out of 5.0 rating scale</p>
          </div>
          <div className="mt-4 flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-4 w-4 ${star <= Math.round(avgPerformance) ? 'text-slate-600 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>

        {/* Attendance Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Calendar className="h-6 w-6 text-slate-600" />
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 bg-red-50 rounded-full">
              <ArrowDownRight className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">-2.1%</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Attendance Rate</h3>
            <p className="text-3xl font-bold text-slate-900">{animatedValues.avgAttendance}%</p>
            <p className="text-sm text-gray-500">This month average</p>
          </div>
          <div className="mt-4 relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-slate-600 h-3 rounded-full transition-all duration-1000 relative"
                style={{ width: `${avgAttendance}%` }}
              >
                <div className="absolute right-0 top-0 w-2 h-3 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-slate-600" />
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 bg-slate-100 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">+3.7%</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Monthly Payroll</h3>
            <p className="text-3xl font-bold text-slate-900">${Math.round(animatedValues.totalPayroll / 1000)}K</p>
            <p className="text-sm text-gray-500">Total monthly expenses</p>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Processed securely</span>
          </div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Activity className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Today's Activity</h3>
              <p className="text-gray-600">Real-time workforce insights</p>
            </div>
          </div>
          <button 
            onClick={() => handleQuickAction('view-attendance', 'attendance')}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium"
          >
            <Eye className="h-5 w-5" />
            <span>View Details</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Present Today */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-600 rounded-xl">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-700">{todayPresent}</div>
                <div className="text-sm text-slate-600 font-medium">Present Today</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">On time arrivals</span>
              <span className="font-bold text-slate-700">{todayPresent - todayLate}</span>
            </div>
          </div>

          {/* Absent Today */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 rounded-xl">
                <UserX className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-700">{todayAbsent}</div>
                <div className="text-sm text-red-600 font-medium">Absent Today</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-600">Unplanned absences</span>
              <span className="font-bold text-red-700">{Math.round(todayAbsent * 0.7)}</span>
            </div>
          </div>

          {/* Late Arrivals */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-600 rounded-xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-700">{todayLate}</div>
                <div className="text-sm text-amber-600 font-medium">Late Arrivals</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-600">Avg delay</span>
              <span className="font-bold text-amber-700">15 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Performance Analytics</h3>
                <p className="text-gray-600">Multi-dimensional insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full">
                <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                <span className="text-xs font-medium text-slate-700">Performance</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">Attendance</span>
              </div>
            </div>
          </div>
          <Chart datasets={multiLineChartData} type="line" height={300} />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-700">{avgPerformance.toFixed(1)}</div>
              <div className="text-sm text-slate-600">Avg Performance</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-700">{Math.round(avgAttendance)}%</div>
              <div className="text-sm text-gray-600">Avg Attendance</div>
            </div>
          </div>
        </div>

        {/* Department Matrix */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <PieChart className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Department Matrix</h3>
                <p className="text-gray-600">Performance & headcount analysis</p>
              </div>
            </div>
            <button 
              onClick={() => handleQuickAction('view-employees', 'employees')}
              className="text-slate-600 hover:text-slate-800 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {departmentData.slice(0, 6).map((dept, index) => (
              <div key={dept.label} className="group">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-100 rounded-xl">
                      <Building className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{dept.label}</div>
                      <div className="text-sm text-gray-600">{dept.value} employees</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">{dept.performance.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">${Math.round(dept.salary / 1000)}K</div>
                      <div className="text-xs text-gray-500">Avg Salary</div>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-600 rounded-full transition-all duration-500"
                        style={{ width: `${(dept.performance / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top Performers */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Award className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Top Performers</h3>
                <p className="text-gray-600">Excellence recognition</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {topPerformers.map((employee, index) => (
              <div key={employee.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                <div className="relative">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{employee.name}</div>
                  <div className="text-sm text-gray-600 truncate">{employee.department}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-slate-600 fill-current" />
                    <span className="text-lg font-bold text-slate-700">{employee.performanceRating.toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-gray-500">{employee.attendanceRate}% attendance</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Hires */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Zap className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">New Talent</h3>
                <p className="text-gray-600">Recent additions</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentHires.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                <div className="relative">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{employee.name}</div>
                  <div className="text-sm text-gray-600 truncate">{employee.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-600">
                    {new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs text-gray-500">{employee.department}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Settings className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
                <p className="text-gray-600">Essential operations</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('add-employee')}
              className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-slate-700">Add New Employee</span>
              </div>
            </button>
            
            <button 
              onClick={() => handleQuickAction('process-payroll')}
              className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-600 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-slate-700">Process Payroll</span>
              </div>
            </button>
            
            <button 
              onClick={() => handleQuickAction('generate-report')}
              className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-600 rounded-lg">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-slate-700">Generate Report</span>
              </div>
            </button>
            
            <button 
              onClick={() => handleQuickAction('view-training', 'training')}
              className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-600 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-slate-700">View Training</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Professional Alerts */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Bell className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">System Alerts</h3>
              <p className="text-gray-600">Important notifications and updates</p>
            </div>
          </div>
          <button 
            onClick={() => handleQuickAction('view-notifications', 'notifications')}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium"
          >
            <Globe className="h-5 w-5" />
            <span>View All Alerts</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Performance Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-amber-600 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-amber-800 mb-2">Performance Reviews Due</h4>
                <p className="text-sm text-amber-700 mb-3">4 employees need performance reviews this week</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-600 font-medium">High Priority</span>
                  <button className="text-xs bg-amber-200 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-300 transition-colors">
                    Review Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recruitment Alert */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-slate-600 rounded-xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-2">Active Recruitment</h4>
                <p className="text-sm text-slate-700 mb-3">{mockRecruitmentData.length} positions currently being recruited</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">In Progress</span>
                  <button className="text-xs bg-slate-200 text-slate-800 px-3 py-1 rounded-full hover:bg-slate-300 transition-colors">
                    View Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Training Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-800 mb-2">Training Progress</h4>
                <p className="text-sm text-blue-700 mb-3">{mockTrainingData.length} active training programs running</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-600 font-medium">On Track</span>
                  <button className="text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-300 transition-colors">
                    View Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;