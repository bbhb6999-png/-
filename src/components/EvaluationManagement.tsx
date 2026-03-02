import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Download, 
  Play, 
  Trash2, 
  Eye, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  ArrowLeft,
  Calendar,
  User,
  Settings,
  Database,
  Activity,
  Zap,
  Layout as LayoutIcon,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EvaluationManagementProps {
  activeSubTab: string;
}

type ViewType = 'list' | 'taskDetail' | 'reportDetail';

export default function EvaluationManagement({ activeSubTab }: EvaluationManagementProps) {
  const [view, setView] = useState<ViewType>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Reset view when sub-tab changes
  React.useEffect(() => {
    setView('list');
  }, [activeSubTab]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return { label: '未开始', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' };
      case 'running': return { label: '运行中', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' };
      case 'completed': return { label: '已完成', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' };
      case 'failed': return { label: '失败', color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' };
      default: return { label: '未知', color: 'bg-slate-100 text-slate-600' };
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const { label, color } = getStatusLabel(status);
    return (
      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", color)}>
        {label}
      </span>
    );
  };

  // --- Render Functions ---

  const renderHeader = (title: string, onAdd?: () => void) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">评测管理 / {title}</p>
      </div>
      {onAdd && (
        <button 
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> 新建任务
        </button>
      )}
    </div>
  );

  const renderFilters = (types?: string[]) => (
    <div className="card p-4 mb-6 flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input 
          type="text" 
          placeholder="搜索名称、ID..." 
          className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      {types && (
        <select className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <option value="">所有类型</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      )}
      <select className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        <option value="">所有状态</option>
        <option value="pending">未开始</option>
        <option value="running">运行中</option>
        <option value="completed">已完成</option>
        <option value="failed">失败</option>
      </select>
      <div className="flex items-center space-x-2">
        <button className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
          <Filter className="w-4 h-4" />
        </button>
        <button className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderTestTasks = () => (
    <>
      {renderHeader('测试任务', () => {})}
      {renderFilters(['UI测试', '接口测试', '性能测试'])}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">任务ID</th>
              <th className="px-6 py-4 font-semibold">任务名称</th>
              <th className="px-6 py-4 font-semibold">测试类型</th>
              <th className="px-6 py-4 font-semibold">测试对象</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">创建时间</th>
              <th className="px-6 py-4 font-semibold">创建人</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[
              { id: 'TASK-001', name: '人脸识别精度测试', type: 'UI测试', target: 'FaceSDK-v2.1', status: 'completed', time: '2026-03-01 10:00', user: '张警官' },
              { id: 'TASK-002', name: '车辆识别接口压力测试', type: '接口测试', target: 'VehicleAPI-v1.0', status: 'running', time: '2026-03-01 11:30', user: '李警官' },
              { id: 'TASK-003', name: '视频流并发处理评测', type: '性能测试', target: 'StreamServer-v3', status: 'failed', time: '2026-03-01 09:15', user: '王警官' },
              { id: 'TASK-004', name: '移动端UI兼容性测试', type: 'UI测试', target: 'MobileApp-v1.2', status: 'pending', time: '2026-03-01 14:00', user: '赵警官' },
            ].map((task) => (
              <tr key={task.id} className="hover:bg-[var(--bg-primary)] transition-colors group">
                <td className="px-6 py-4 text-sm font-mono text-[var(--text-secondary)]">{task.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{task.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.type}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.target}</td>
                <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.time}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.user}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => { setSelectedId(task.id); setView('taskDetail'); }}
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded" title="查看"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500 rounded" title="执行">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTestReports = () => (
    <>
      {renderHeader('测试报告')}
      {renderFilters(['UI测试', '接口测试', '性能测试'])}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">报告ID</th>
              <th className="px-6 py-4 font-semibold">任务名称</th>
              <th className="px-6 py-4 font-semibold">测试类型</th>
              <th className="px-6 py-4 font-semibold">结果</th>
              <th className="px-6 py-4 font-semibold">生成时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[
              { id: 'REP-001', name: '人脸识别精度测试', type: 'UI测试', result: '通过', time: '2026-03-01 10:45' },
              { id: 'REP-002', name: '车辆识别接口压力测试', type: '接口测试', result: '部分失败', time: '2026-03-01 12:30' },
              { id: 'REP-003', name: '视频流并发处理评测', type: '性能测试', result: '失败', time: '2026-03-01 09:45' },
            ].map((rep) => (
              <tr key={rep.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-[var(--text-secondary)]">{rep.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{rep.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{rep.type}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    rep.result === '通过' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" :
                    rep.result === '部分失败' ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20" :
                    "bg-red-50 text-red-600 dark:bg-red-900/20"
                  )}>
                    {rep.result}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{rep.time}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => { setSelectedId(rep.id); setView('reportDetail'); }}
                      className="flex items-center text-xs font-medium text-blue-500 hover:text-blue-600"
                    >
                      <BarChart3 className="w-3.5 h-3.5 mr-1" /> 查看报告
                    </button>
                    <button className="flex items-center text-xs font-medium text-slate-500 hover:text-slate-600">
                      <Download className="w-3.5 h-3.5 mr-1" /> 下载
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderUITest = () => (
    <>
      {renderHeader('UI测试', () => {})}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">测试名称</th>
              <th className="px-6 py-4 font-semibold">测试页面</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">执行时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[
              { name: '登录页面自动化测试', page: '/login', status: 'completed', time: '2026-03-01 10:00' },
              { name: '仪表盘组件渲染测试', page: '/dashboard', status: 'running', time: '2026-03-01 11:30' },
            ].map((test, i) => (
              <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{test.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{test.page}</td>
                <td className="px-6 py-4"><StatusBadge status={test.status} /></td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{test.time}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <button className="text-xs font-medium text-blue-500 hover:text-blue-600">执行</button>
                    <button className="text-xs font-medium text-slate-500 hover:text-slate-600">查看结果</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderInterfaceTest = () => (
    <>
      {renderHeader('接口测试', () => {})}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">接口名称</th>
              <th className="px-6 py-4 font-semibold">接口地址</th>
              <th className="px-6 py-4 font-semibold">方法</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[
              { name: '人脸特征提取API', url: '/api/v1/face/extract', method: 'POST', status: 'completed' },
              { name: '车辆轨迹查询API', url: '/api/v1/vehicle/track', method: 'GET', status: 'failed' },
            ].map((test, i) => (
              <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{test.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{test.url}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold",
                    test.method === 'POST' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  )}>
                    {test.method}
                  </span>
                </td>
                <td className="px-6 py-4"><StatusBadge status={test.status} /></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <button className="text-xs font-medium text-blue-500 hover:text-blue-600">测试</button>
                    <button className="text-xs font-medium text-slate-500 hover:text-slate-600">查看结果</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderPerformanceTest = () => (
    <>
      {renderHeader('性能测试', () => {})}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">测试名称</th>
              <th className="px-6 py-4 font-semibold">测试对象</th>
              <th className="px-6 py-4 font-semibold">并发数</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[
              { name: '高并发视频流接入测试', target: 'StreamGateway-v2', concurrency: 500, status: 'completed' },
              { name: '数据库写入性能评测', target: 'PostgreSQL-Cluster', concurrency: 1000, status: 'running' },
            ].map((test, i) => (
              <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{test.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{test.target}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{test.concurrency}</td>
                <td className="px-6 py-4"><StatusBadge status={test.status} /></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <button className="text-xs font-medium text-blue-500 hover:text-blue-600">执行</button>
                    <button className="text-xs font-medium text-slate-500 hover:text-slate-600">查看</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTaskDetail = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setView('list')}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回列表
        </button>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)]">
            编辑配置
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            立即执行
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" /> 基本信息
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-secondary)]">任务名称</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">人脸识别精度测试 (TASK-001)</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-secondary)]">测试类型</p>
                <div className="flex items-center">
                  <LayoutIcon className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">UI测试</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-secondary)]">创建时间</p>
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">2026-03-01 10:00:00</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-secondary)]">创建人</p>
                <div className="flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">张警官</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Config */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-500" /> 测试配置
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-[var(--text-secondary)] mb-2">运行参数</p>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg font-mono text-xs text-[var(--text-primary)] border border-[var(--border-color)]">
                  {`{
  "threshold": 0.85,
  "max_iterations": 1000,
  "retry_on_failure": true,
  "log_level": "DEBUG"
}`}
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)] mb-2">数据集</p>
                <div className="flex items-center p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)]">
                  <Database className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Standard_Face_Dataset_2026.zip</p>
                    <p className="text-xs text-[var(--text-secondary)]">大小: 1.2GB | 包含 50,000 张样本</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Status */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" /> 执行信息
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">当前状态</span>
                <StatusBadge status="completed" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">执行进度</span>
                  <span className="font-medium text-blue-500">100%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-full" />
                </div>
              </div>
              <div className="pt-4 border-t border-[var(--border-color)]">
                <button 
                  onClick={() => setView('reportDetail')}
                  className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <BarChart3 className="w-4 h-4 mr-2" /> 查看测试报告
                </button>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold mb-4">执行节点</h3>
            <div className="flex items-center p-3 bg-[var(--bg-primary)] rounded-lg">
              <Zap className="w-4 h-4 text-orange-500 mr-3" />
              <div>
                <p className="text-xs font-medium">GPU-Node-04</p>
                <p className="text-[10px] text-[var(--text-secondary)]">负载: 42% | 温度: 65°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportDetail = () => {
    const pieData = [
      { name: '成功', value: 92, color: '#10b981' },
      { name: '失败', value: 8, color: '#ef4444' },
    ];

    const trendData = [
      { time: 'T1', timeCost: 120, successRate: 85 },
      { time: 'T2', timeCost: 132, successRate: 88 },
      { time: 'T3', timeCost: 101, successRate: 92 },
      { time: 'T4', timeCost: 134, successRate: 90 },
      { time: 'T5', timeCost: 90, successRate: 95 },
      { time: 'T6', timeCost: 230, successRate: 82 },
      { time: 'T7', timeCost: 210, successRate: 89 },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setView('list')}
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回列表
          </button>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)] flex items-center">
              <Download className="w-4 h-4 mr-2" /> 下载 PDF
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              分享报告
            </button>
          </div>
        </div>

        {/* Report Summary */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">人脸识别精度测试报告 (REP-001)</h3>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> 2026-03-01 10:45:00</div>
                <div className="flex items-center"><LayoutIcon className="w-4 h-4 mr-1.5" /> UI测试</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" /> 评测通过</div>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-500">92%</p>
                <p className="text-xs text-[var(--text-secondary)]">成功率</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">8%</p>
                <p className="text-xs text-[var(--text-secondary)]">失败率</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">142ms</p>
                <p className="text-xs text-[var(--text-secondary)]">平均耗时</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-2">
            <h4 className="text-sm font-semibold mb-6">趋势分析 (耗时 & 成功率)</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
                  <Legend verticalAlign="top" height={36}/>
                  <Line name="耗时 (ms)" type="monotone" dataKey="timeCost" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line name="成功率 (%)" type="monotone" dataKey="successRate" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-6 flex flex-col">
            <h4 className="text-sm font-semibold mb-6">结果分布</h4>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)]">
            <h4 className="text-sm font-semibold">测试项明细</h4>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">测试项</th>
                <th className="px-6 py-4 font-semibold">结果</th>
                <th className="px-6 py-4 font-semibold">耗时</th>
                <th className="px-6 py-4 font-semibold">错误信息</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {[
                { item: '人脸检测 - 正面', result: 'success', cost: '45ms', error: '-' },
                { item: '人脸检测 - 侧面', result: 'success', cost: '52ms', error: '-' },
                { item: '特征点提取', result: 'success', cost: '120ms', error: '-' },
                { item: '活体检测', result: 'failed', cost: '210ms', error: '光照强度不足' },
                { item: '人脸比对 (1:1)', result: 'success', cost: '85ms', error: '-' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{row.item}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {row.result === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className={cn(
                        "text-xs font-medium",
                        row.result === 'success' ? "text-emerald-600" : "text-red-600"
                      )}>
                        {row.result === 'success' ? '通过' : '失败'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{row.cost}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (view === 'taskDetail') return renderTaskDetail();
    if (view === 'reportDetail') return renderReportDetail();

    switch (activeSubTab) {
      case 'task-mgmt': return renderTestTasks();
      case 'reports': return renderTestReports();
      case 'ui-test': return renderUITest();
      case 'api-test': return renderInterfaceTest();
      case 'perf-test': return renderPerformanceTest();
      default: return renderTestTasks();
    }
  };

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeSubTab}-${view}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
