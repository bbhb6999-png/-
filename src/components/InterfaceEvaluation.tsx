import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Play, 
  Settings2, 
  FileText, 
  Trash2, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Activity, 
  Zap, 
  Layers, 
  Globe, 
  ArrowLeft, 
  Download, 
  RefreshCw,
  MoreHorizontal,
  Terminal,
  BarChart3,
  Calendar,
  Copy,
  Save,
  Send
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
  Legend,
  AreaChart,
  Area
} from 'recharts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InterfaceEvaluationProps {
  activeSubTab: string;
}

type ViewState = 'list' | 'config' | 'execution' | 'reportDetail';

export default function InterfaceEvaluation({ activeSubTab }: InterfaceEvaluationProps) {
  const [view, setView] = useState<ViewState>('list');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    setView('list');
    setSelectedItem(null);
  }, [activeSubTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 font-medium">成功</span>;
      case 'executing':
      case 'running':
        return <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 font-medium animate-pulse">执行中</span>;
      case 'failed':
        return <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 font-medium">失败</span>;
      default:
        return <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium">未执行</span>;
    }
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      PUT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
      <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold", colors[method] || 'bg-slate-100 text-slate-700')}>
        {method}
      </span>
    );
  };

  // --- List Page Renders ---

  const renderListHeader = (title: string, onAdd: () => void) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">接口评测 / {title}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button className="flex items-center px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)]">
          <RefreshCw className="w-4 h-4 mr-2" /> 批量测试
        </button>
        <button 
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" /> 新建测试
        </button>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="card p-4 mb-6 flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input type="text" placeholder="搜索接口名称、地址..." className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>
      <select className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        <option>所有状态</option>
        <option>成功</option>
        <option>失败</option>
        <option>未执行</option>
      </select>
      <div className="flex items-center space-x-2">
        <button className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderAPITestList = () => (
    <div className="space-y-6">
      {renderListHeader('API测试', () => setView('config'))}
      {renderFilters()}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">测试名称</th>
              <th className="px-6 py-4 font-semibold">接口地址</th>
              <th className="px-6 py-4 font-semibold">请求方式</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">创建时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[
              { name: '人脸检测接口功能测试', url: '/api/v1/face/detect', method: 'POST', status: 'success', time: '2026-03-01 10:00' },
              { name: '车辆识别接口连通性', url: '/api/v1/vehicle/identify', method: 'GET', status: 'failed', time: '2026-03-01 11:30' },
              { name: '轨迹查询接口性能预检', url: '/api/v1/track/query', method: 'POST', status: 'none', time: '2026-03-01 14:20' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{item.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{item.url}</td>
                <td className="px-6 py-4">{getMethodBadge(item.method)}</td>
                <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{item.time}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => setView('config')} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded" title="配置">
                      <Settings2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setView('execution'); startExecution(); }} className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500 rounded" title="执行">
                      <Play className="w-4 h-4" />
                    </button>
                    <button onClick={() => setView('reportDetail')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-secondary)] rounded" title="报告">
                      <FileText className="w-4 h-4" />
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
    </div>
  );

  const renderCompatibilityList = () => (
    <div className="space-y-6">
      {renderListHeader('兼容测试', () => setView('config'))}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">测试名称</th>
              <th className="px-6 py-4 font-semibold">接口名称</th>
              <th className="px-6 py-4 font-semibold">版本数量</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">创建时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[
              { name: 'FaceAPI 多版本兼容性', api: '人脸检测接口', versions: 3, status: 'success', time: '2026-02-28' },
              { name: 'VehicleAPI 升级回归测试', api: '车辆识别接口', versions: 2, status: 'running', time: '2026-03-01' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{item.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{item.api}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{item.versions} 个版本</td>
                <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{item.time}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <button onClick={() => setView('config')} className="text-xs font-medium text-blue-500 hover:text-blue-600">配置</button>
                    <button className="text-xs font-medium text-emerald-500 hover:text-emerald-600">执行</button>
                    <button onClick={() => setView('reportDetail')} className="text-xs font-medium text-slate-500 hover:text-slate-600">报告</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProtocolList = () => (
    <div className="space-y-6">
      {renderListHeader('协议测试', () => setView('config'))}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">测试名称</th>
              <th className="px-6 py-4 font-semibold">接口名称</th>
              <th className="px-6 py-4 font-semibold">协议类型</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">创建时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[
              { name: 'HTTPS 安全协议适配', api: '人脸检测接口', protocol: 'HTTPS', status: 'success', time: '2026-02-25' },
              { name: 'HTTP 降级兼容测试', api: '车辆识别接口', protocol: 'HTTP', status: 'none', time: '2026-03-01' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{item.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{item.api}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)]">
                    {item.protocol}
                  </span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{item.time}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setView('config')} className="text-xs font-medium text-blue-500 hover:text-blue-600">配置</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Config Page Render ---

  const renderConfig = () => (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={() => setView('list')} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">测试配置</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)]">
            取消
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20">
            <Save className="w-4 h-4 mr-2 inline" /> 保存配置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-4">基本信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">测试名称</label>
                <input type="text" defaultValue="人脸检测接口功能测试" className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">接口名称</label>
                <input type="text" defaultValue="人脸检测接口" className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">接口地址</label>
                <input type="text" defaultValue="/api/v1/face/detect" className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm font-mono" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">接口版本</label>
                <input type="text" defaultValue="v1.2.0" className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm" />
              </div>
            </div>
          </div>

          {/* Request Config */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-4">请求配置</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">请求方式</label>
                <div className="flex space-x-2">
                  {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
                    <button key={m} className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                      m === 'POST' ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)]"
                    )}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[var(--text-primary)]">请求头 (Headers)</label>
                  <button className="text-blue-500 text-[10px] font-bold">+ 新增</button>
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input type="text" defaultValue="Content-Type" className="flex-1 px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs font-mono" />
                    <input type="text" defaultValue="application/json" className="flex-1 px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs font-mono" />
                    <button className="p-1.5 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex space-x-2">
                    <input type="text" defaultValue="Authorization" className="flex-1 px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs font-mono" />
                    <input type="text" defaultValue="Bearer {{token}}" className="flex-1 px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs font-mono" />
                    <button className="p-1.5 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">请求体 (Body - JSON)</label>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-blue-400 overflow-hidden">
                  <textarea 
                    rows={6}
                    className="w-full bg-transparent outline-none resize-none"
                    defaultValue={`{
  "image_base64": "...",
  "min_confidence": 0.8,
  "detect_landmarks": true
}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Response Validation */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-4">响应校验</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-primary)]">状态码校验</span>
                <input type="text" defaultValue="200" className="w-20 px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-xs text-center font-mono" />
              </div>
              <div className="space-y-2">
                <span className="text-xs text-[var(--text-primary)]">字段校验</span>
                <div className="bg-[var(--bg-primary)] p-2 rounded border border-[var(--border-color)] text-[10px] font-mono">
                  <div className="flex justify-between mb-1">
                    <span>$.status</span>
                    <span className="text-emerald-500">== "OK"</span>
                  </div>
                  <div className="flex justify-between">
                    <span>$.data.faces</span>
                    <span className="text-emerald-500">is_array</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-primary)]">响应时间限制 (ms)</span>
                <input type="number" defaultValue="500" className="w-20 px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-xs text-center font-mono" />
              </div>
            </div>
          </div>

          {/* Execution Config */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-4">执行配置</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">执行方式</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white">立即执行</button>
                  <button className="py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)]">定时执行</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-primary)]">执行次数</span>
                <input type="number" defaultValue="1" className="w-20 px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-xs text-center" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-primary)]">超时时间 (s)</span>
                <input type="number" defaultValue="30" className="w-20 px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-xs text-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Execution Page Render ---

  const startExecution = () => {
    setIsExecuting(true);
    setExecutionProgress(0);
    const interval = setInterval(() => {
      setExecutionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExecuting(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const renderExecution = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={() => setView('list')} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">测试执行中</h2>
        </div>
        <button 
          onClick={() => setView('reportDetail')}
          disabled={isExecuting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          查看报告
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="card p-8 flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-slate-100 dark:text-slate-800 stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                <circle 
                  className="text-blue-500 stroke-current transition-all duration-300" 
                  strokeWidth="8" 
                  strokeDasharray={251.2} 
                  strokeDashoffset={251.2 * (1 - executionProgress / 100)} 
                  strokeLinecap="round" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[var(--text-primary)]">{executionProgress}%</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
              {isExecuting ? '正在执行测试用例...' : '测试执行完成'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">人脸检测接口功能测试 (v1.2.0)</p>
          </div>

          {/* Real-time Logs */}
          <div className="card overflow-hidden flex flex-col h-[400px]">
            <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-between">
              <div className="flex items-center text-xs font-bold text-[var(--text-secondary)] uppercase">
                <Terminal className="w-4 h-4 mr-2" /> 实时日志
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-bold">LIVE</span>
              </div>
            </div>
            <div className="flex-1 bg-slate-950 p-4 font-mono text-xs space-y-2 overflow-y-auto">
              <p className="text-slate-400">[10:00:01] <span className="text-blue-400">INFO</span> 初始化测试环境...</p>
              <p className="text-slate-400">[10:00:02] <span className="text-blue-400">INFO</span> 正在发送请求: POST /api/v1/face/detect</p>
              <p className="text-slate-400">[10:00:02] <span className="text-slate-500">DEBUG</span> Headers: {"{ \"Content-Type\": \"application/json\" }"}</p>
              <p className="text-slate-400">[10:00:03] <span className="text-emerald-400">SUCCESS</span> 收到响应: 200 OK (142ms)</p>
              <p className="text-slate-400">[10:00:03] <span className="text-blue-400">INFO</span> 正在校验响应字段...</p>
              <p className="text-slate-400">[10:00:04] <span className="text-emerald-400">SUCCESS</span> 字段校验通过: $.status == "OK"</p>
              {executionProgress > 50 && (
                <>
                  <p className="text-slate-400">[10:00:05] <span className="text-blue-400">INFO</span> 正在执行第 2 次测试...</p>
                  <p className="text-slate-400">[10:00:06] <span className="text-emerald-400">SUCCESS</span> 收到响应: 200 OK (156ms)</p>
                </>
              )}
              {executionProgress === 100 && (
                <p className="text-slate-400">[10:00:07] <span className="text-emerald-400 font-bold">DONE</span> 测试执行完毕，正在生成报告。</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Statistics */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-6">统计信息</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mr-3">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">成功次数</span>
                </div>
                <span className="text-lg font-bold text-emerald-600">{Math.floor(executionProgress / 10)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 mr-3">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">失败次数</span>
                </div>
                <span className="text-lg font-bold text-red-600">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mr-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">平均耗时</span>
                </div>
                <span className="text-lg font-bold text-blue-600">148ms</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-4">测试对象</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold mb-1">API Endpoint</p>
                <p className="text-xs font-mono text-[var(--text-primary)] truncate">https://api.police.gov/v1/face/detect</p>
              </div>
              <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold mb-1">Version</p>
                <p className="text-xs font-mono text-[var(--text-primary)]">v1.2.0 (Stable)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Report Detail Page Render ---

  const renderReportDetail = () => {
    const timeData = [
      { time: '09:00', latency: 120 },
      { time: '10:00', latency: 142 },
      { time: '11:00', latency: 135 },
      { time: '12:00', latency: 156 },
      { time: '13:00', latency: 148 },
      { time: '14:00', latency: 130 },
    ];

    const pieData = [
      { name: '成功', value: 98, color: '#10b981' },
      { name: '失败', value: 2, color: '#ef4444' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={() => setView('list')} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">测试报告详情</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)] flex items-center">
              <Download className="w-4 h-4 mr-2" /> 导出报告 (PDF)
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              重新测试
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">人脸检测接口功能测试报告 (v1.2.0)</h3>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> 2026-03-01 10:45:00</div>
                <div className="flex items-center"><Zap className="w-4 h-4 mr-1.5 text-blue-500" /> API测试</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" /> 测试通过</div>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-500">98%</p>
                <p className="text-xs text-[var(--text-secondary)]">成功率</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">2%</p>
                <p className="text-xs text-[var(--text-secondary)]">失败率</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">0</p>
                <p className="text-xs text-[var(--text-secondary)]">错误数量</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-2">
            <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-6">响应时间趋势 (ms)</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeData}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
                  <Area type="monotone" dataKey="latency" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-6 flex flex-col">
            <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-6">成功率分布</h4>
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

        {/* Results Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)]">
            <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase">测试结果明细</h4>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">测试项</th>
                <th className="px-6 py-4 font-semibold">请求结果</th>
                <th className="px-6 py-4 font-semibold">响应时间</th>
                <th className="px-6 py-4 font-semibold">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {[
                { item: '状态码校验 (200)', result: '200 OK', latency: '142ms', status: 'success' },
                { item: '响应字段校验 ($.status)', result: 'OK', latency: '142ms', status: 'success' },
                { item: '响应字段校验 ($.data.faces)', result: 'Array(2)', latency: '142ms', status: 'success' },
                { item: '响应时间校验 (<500ms)', result: '142ms', latency: '142ms', status: 'success' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{row.item}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{row.result}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{row.latency}</td>
                  <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (view === 'config') return renderConfig();
    if (view === 'execution') return renderExecution();
    if (view === 'reportDetail') return renderReportDetail();

    switch (activeSubTab) {
      case 'api-compat': return renderAPITestList();
      case 'multi-ver': return renderCompatibilityList();
      case 'multi-proto': return renderProtocolList();
      default: return renderAPITestList();
    }
  };

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeSubTab}-${view}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
