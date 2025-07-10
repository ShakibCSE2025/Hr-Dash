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
      color: '#8B5CF6',
      fillOpacity: 0.1
    },
    {
      label: 'Attendance',
      data: recentAttendance.slice(-6).map((item, index) => ({
        label: performanceTrendData[index]?.label || `M${index + 1}`,
        value: Math.round((item.present / (item.present + item.absent)) * 100)
      })),
      color: '#10B981',
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
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];
    return colors[index % colors.length];
  };

  const getPerformanceGradient = (rating: number) => {
    if (rating >= 4.5) return 'from-emerald-500 to-green-600';
    if (rating >= 4.0) return 'from-blue-500 to-indigo-600';
    if (rating >= 3.5) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen -m-6 p-6">
      {/* Floating Header with Glass Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Executive Dashboard
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">Real-time insights into your organization's performance</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm font-medium shadow-lg"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="1year">Last Year</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-400" />
                </div>
                <button className="p-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg">
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center space-x-3 px-4 py-2 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Data</span>
                <span className="text-xs text-green-600">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Grid with Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">+8.2%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Employees</h3>
              <p className="text-3xl font-bold text-gray-900">{animatedValues.totalEmployees}</p>
              <p className="text-sm text-gray-500">{activeEmployees} active • {totalEmployees - activeEmployees} inactive</p>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(activeEmployees / totalEmployees) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">+5.3%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg Performance</h3>
              <p className="text-3xl font-bold text-gray-900">{animatedValues.avgPerformance.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Out of 5.0 rating scale</p>
            </div>
            <div className="mt-4 flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= Math.round(avgPerformance) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 px-3 py-1 bg-red-100 rounded-full">
                <ArrowDownRight className="h-4 w-4 text-red-600" />
                <span className="text-sm font-bold text-red-700">-2.1%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Attendance Rate</h3>
              <p className="text-3xl font-bold text-gray-900">{animatedValues.avgAttendance}%</p>
              <p className="text-sm text-gray-500">This month average</p>
            </div>
            <div className="mt-4 relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${avgAttendance}%` }}
                >
                  <div className="absolute right-0 top-0 w-2 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">+3.7%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Monthly Payroll</h3>
              <p className="text-3xl font-bold text-gray-900">${Math.round(animatedValues.totalPayroll / 1000)}K</p>
              <p className="text-sm text-gray-500">Total monthly expenses</p>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Processed securely</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Today's Activity</h3>
              <p className="text-gray-600">Real-time workforce insights</p>
            </div>
          </div>
          <button 
            onClick={() => handleQuickAction('view-attendance', 'attendance')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
          >
            <Eye className="h-5 w-5" />
            <span>View Details</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Present Today */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-700">{todayPresent}</div>
                  <div className="text-sm text-green-600 font-medium">Present Today</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">On time arrivals</span>
                <span className="font-bold text-green-700">{todayPresent - todayLate}</span>
              </div>
            </div>
          </div>

          {/* Absent Today */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500 rounded-xl shadow-lg">
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
          </div>

          {/* Late Arrivals */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500 rounded-xl shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-700">{todayLate}</div>
                  <div className="text-sm text-yellow-600 font-medium">Late Arrivals</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-600">Avg delay</span>
                <span className="font-bold text-yellow-700">15 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Multi-line Performance Chart */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Performance Analytics</h3>
                <p className="text-gray-600">Multi-dimensional insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 rounded-full">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs font-medium text-purple-700">Performance</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-green-700">Attendance</span>
              </div>
            </div>
          </div>
          <Chart datasets={multiLineChartData} type="line" height={300} />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-700">{avgPerformance.toFixed(1)}</div>
              <div className="text-sm text-purple-600">Avg Performance</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-700">{Math.round(avgAttendance)}%</div>
              <div className="text-sm text-green-600">Avg Attendance</div>
            </div>
          </div>
        </div>

        {/* Department Performance Matrix */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Department Matrix</h3>
                <p className="text-gray-600">Performance & headcount analysis</p>
              </div>
            </div>
            <button 
              onClick={() => handleQuickAction('view-employees', 'employees')}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {departmentData.slice(0, 6).map((dept, index) => (
              <div key={dept.label} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center justify-between p-4 border border-gray-200/50 rounded-xl hover:border-blue-300/50 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="p-3 rounded-xl shadow-sm"
                      style={{ backgroundColor: `${getDepartmentColor(index)}20` }}
                    >
                      <Building 
                        className="h-5 w-5" 
                        style={{ color: getDepartmentColor(index) }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{dept.label}</div>
                      <div className="text-sm text-gray-600">{dept.value} employees</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{dept.performance.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">${Math.round(dept.salary / 1000)}K</div>
                      <div className="text-xs text-gray-500">Avg Salary</div>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(dept.performance / 5) * 100}%`,
                          backgroundColor: getDepartmentColor(index)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Elite Performers & Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top Performers Hall of Fame */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Elite Performers</h3>
                <p className="text-gray-600">Top talent recognition</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {topPerformers.map((employee, index) => (
              <div key={employee.id} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${getPerformanceGradient(employee.performanceRating)} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-200`}></div>
                <div className="relative flex items-center space-x-4 p-4 border border-gray-200/50 rounded-xl hover:border-yellow-300/50 transition-all duration-200">
                  <div className="relative">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-400/50"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{employee.name}</div>
                    <div className="text-sm text-gray-600 truncate">{employee.department}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-yellow-600">{employee.performanceRating.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-gray-500">{employee.attendanceRate}% attendance</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Hires Spotlight */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">New Talent</h3>
                <p className="text-gray-600">Recent additions</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentHires.map((employee) => (
              <div key={employee.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center space-x-4 p-4 border border-gray-200/50 rounded-xl hover:border-green-300/50 transition-all duration-200">
                  <div className="relative">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-green-400/50"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{employee.name}</div>
                    <div className="text-sm text-gray-600 truncate">{employee.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500">{employee.department}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Actions Hub */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Smart Actions</h3>
                <p className="text-gray-600">Quick operations</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('add-employee')}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-blue-700 group-hover:text-blue-800">Add New Employee</span>
              </div>
            </button>
            
            <button 
              onClick={() => handleQuickAction('process-payroll')}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-dashed border-green-300 hover:border-green-400 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-green-700 group-hover:text-green-800">Process Payroll</span>
              </div>
            </button>
            
            <button 
              onClick={() => handleQuickAction('generate-report')}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-dashed border-purple-300 hover:border-purple-400 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-colors">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-700 group-hover:text-purple-800">Generate Report</span>
              </div>
            </button>
            
            <button 
              onClick={() => handleQuickAction('view-training', 'training')}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-2 border-dashed border-orange-300 hover:border-orange-400 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg group-hover:bg-orange-600 transition-colors">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-orange-700 group-hover:text-orange-800">View Training</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Intelligent Alerts System */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Intelligent Alerts</h3>
              <p className="text-gray-600">AI-powered insights and recommendations</p>
            </div>
          </div>
          <button 
            onClick={() => handleQuickAction('view-notifications', 'notifications')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
          >
            <Globe className="h-5 w-5" />
            <span>View All Alerts</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Performance Alert */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-yellow-500 rounded-xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-yellow-800 mb-2">Performance Reviews Due</h4>
                  <p className="text-sm text-yellow-700 mb-3">4 employees need performance reviews this week</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-600 font-medium">High Priority</span>
                    <button className="text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-300 transition-colors">
                      Review Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recruitment Alert */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-800 mb-2">Active Recruitment</h4>
                  <p className="text-sm text-blue-700 mb-3">{mockRecruitmentData.length} positions currently being recruited</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 font-medium">In Progress</span>
                    <button className="text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-300 transition-colors">
                      View Jobs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Training Alert */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-800 mb-2">Training Progress</h4>
                  <p className="text-sm text-green-700 mb-3">{mockTrainingData.length} active training programs running</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">On Track</span>
                    <button className="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full hover:bg-green-300 transition-colors">
                      View Progress
                    </button>
                  </div>
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