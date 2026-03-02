import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Download, 
  RefreshCw,
  FileText,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface ModulePageProps {
  title: string;
  subtitle?: string;
}

export default function ModulePage({ title, subtitle }: ModulePageProps) {
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');

  const renderList = () => (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input 
              type="text" 
              placeholder="搜索名称、ID..." 
              className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
            />
          </div>
          <button className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)]">
            <Download className="w-4 h-4 mr-2" /> 导出
          </button>
          <button 
            onClick={() => setView('create')}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> 新建任务
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">名称</th>
                <th className="px-6 py-4 font-semibold">版本</th>
                <th className="px-6 py-4 font-semibold">状态</th>
                <th className="px-6 py-4 font-semibold">创建时间</th>
                <th className="px-6 py-4 font-semibold">更新时间</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-primary)]">示例任务_{i.toString().padStart(3, '0')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">v1.2.{i}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      i % 3 === 0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" :
                      i % 3 === 1 ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" :
                      "bg-slate-50 text-slate-600 dark:bg-slate-900/20"
                    )}>
                      {i % 3 === 0 ? "已完成" : i % 3 === 1 ? "进行中" : "待处理"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">2026-03-01 12:00</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">10分钟前</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setView('detail')}
                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-secondary)] rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">共 128 条记录</span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-[var(--border-color)] rounded hover:bg-[var(--bg-primary)] text-sm disabled:opacity-50" disabled>上一页</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-[var(--border-color)] rounded hover:bg-[var(--bg-primary)] text-sm">2</button>
            <button className="px-3 py-1 border border-[var(--border-color)] rounded hover:bg-[var(--bg-primary)] text-sm">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetail = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setView('list')}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
        >
          ← 返回列表
        </button>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)]">
            重新运行
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            下载报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">任务详情: 示例任务_001</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: '任务ID', value: 'TASK-2026-001' },
                { label: '任务类型', value: title },
                { label: '所属项目', value: '公安AI评测一期' },
                { label: '创建人', value: '管理员' },
                { label: '开始时间', value: '2026-03-01 10:00:00' },
                { label: '结束时间', value: '2026-03-01 10:45:22' },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">评测结果分析</h3>
            <div className="h-64 bg-[var(--bg-primary)] rounded-lg flex items-center justify-center border border-dashed border-[var(--border-color)]">
              <p className="text-[var(--text-secondary)]">可视化图表展示区域</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">执行日志</h3>
            <div className="space-y-3">
              {[
                { time: '10:00:01', msg: '任务初始化成功', type: 'info' },
                { time: '10:05:22', msg: '正在加载测试数据集...', type: 'info' },
                { time: '10:15:45', msg: '算法模型加载完成', type: 'info' },
                { time: '10:30:12', msg: '检测到资源负载较高', type: 'warning' },
                { time: '10:45:22', msg: '任务执行完毕，生成报告', type: 'success' },
              ].map((log, i) => (
                <div key={i} className="flex text-xs font-mono">
                  <span className="text-slate-400 shrink-0 mr-2">[{log.time}]</span>
                  <span className={clsx(
                    log.type === 'warning' ? "text-orange-500" :
                    log.type === 'success' ? "text-emerald-500" :
                    "text-[var(--text-primary)]"
                  )}>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => setView('list')}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center mb-4"
        >
          ← 返回列表
        </button>
        <h3 className="text-xl font-bold">新建{title}任务</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">请填写以下信息以启动新的评测任务</p>
      </div>

      <div className="card p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">任务名称</label>
            <input 
              type="text" 
              placeholder="请输入任务名称"
              className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">优先级</label>
              <select className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>常规</option>
                <option>紧急</option>
                <option>高</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">执行节点</label>
              <select className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>自动分配</option>
                <option>节点-A (GPU)</option>
                <option>节点-B (CPU)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">数据集选择</label>
            <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 flex flex-col items-center justify-center hover:bg-[var(--bg-primary)] transition-colors cursor-pointer group">
              <Plus className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-blue-500 mb-2" />
              <p className="text-sm text-[var(--text-secondary)]">点击或拖拽上传数据集文件</p>
              <p className="text-xs text-slate-400 mt-1">支持 .zip, .tar, .csv 格式</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">备注说明</label>
            <textarea 
              rows={3}
              placeholder="可选填"
              className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3">
          <button 
            onClick={() => setView('list')}
            className="px-6 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-primary)]"
          >
            取消
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20">
            启动任务
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
        {subtitle && <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>}
      </div>
      
      <motion.div
        key={view}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {view === 'list' && renderList()}
        {view === 'detail' && renderDetail()}
        {view === 'create' && renderCreate()}
      </motion.div>
    </div>
  );
}
