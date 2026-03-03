import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MousePointer2,
  Square,
  Undo2,
  Redo2,
  Save,
  FileOutput,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Layers,
  Image as ImageIcon,
  Video as VideoIcon,
  Database,
  ArrowLeft,
  X,
  Maximize2,
  Minimize2,
  Settings2,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DataAnnotationProps {
  activeSubTab: string;
}

type AnnotationView = 'list' | 'imageEditor' | 'videoEditor' | 'export' | 'datasetMgmt';

interface Rect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
}

export default function DataAnnotation({ activeSubTab }: DataAnnotationProps) {
  const [view, setView] = useState<AnnotationView>('list');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Filter States
  const [imgSearch, setImgSearch] = useState('');
  const [imgStatusFilter, setImgStatusFilter] = useState('所有状态');
  
  const [vidSearch, setVidSearch] = useState('');
  const [vidStatusFilter, setVidStatusFilter] = useState('所有状态');

  // Mock Data - Changed to Tasks (Datasets)
  const [imageTasks, setImageTasks] = useState([
    { id: 'IMG-TASK-001', name: '人脸识别评测集', total: 500, completed: 420, status: 'annotating', time: '2026-03-01 10:00' },
    { id: 'IMG-TASK-002', name: '车辆特征库', total: 1000, completed: 1000, status: 'completed', time: '2026-03-01 10:05' },
    { id: 'IMG-TASK-003', name: '行人属性标注', total: 200, completed: 0, status: 'pending', time: '2026-03-01 10:10' },
  ]);

  const [videoTasks, setVideoTasks] = useState([
    { id: 'VID-TASK-001', name: '交通违法行为识别', total: 50, completed: 12, status: 'annotating', time: '2026-03-01 09:00' },
    { id: 'VID-TASK-002', name: '安防监控异常检测', total: 20, completed: 20, status: 'completed', time: '2026-03-01 11:15' },
  ]);

  const [taskModalConfig, setTaskModalConfig] = useState<{ open: boolean; type?: 'image' | 'video' }>({ open: false });

  const filteredImageTasks = React.useMemo(() => {
    return imageTasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(imgSearch.toLowerCase()) || 
                           task.id.toLowerCase().includes(imgSearch.toLowerCase());
      const statusMap: Record<string, string> = {
        '未开始': 'pending',
        '标注中': 'annotating',
        '已完成': 'completed'
      };
      const matchesStatus = imgStatusFilter === '所有状态' || task.status === statusMap[imgStatusFilter];
      return matchesSearch && matchesStatus;
    });
  }, [imageTasks, imgSearch, imgStatusFilter]);

  const filteredVideoTasks = React.useMemo(() => {
    return videoTasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(vidSearch.toLowerCase()) ||
                           task.id.toLowerCase().includes(vidSearch.toLowerCase());
      const statusMap: Record<string, string> = {
        '未开始': 'pending',
        '标注中': 'annotating',
        '已完成': 'completed'
      };
      const matchesStatus = vidStatusFilter === '所有状态' || task.status === statusMap[vidStatusFilter];
      return matchesSearch && matchesStatus;
    });
  }, [videoTasks, vidSearch, vidStatusFilter]);
  
  // Editor State
  const [rects, setRects] = useState<Rect[]>([
    { id: '1', x: 100, y: 150, width: 200, height: 150, label: '人脸', color: '#3b82f6' },
    { id: '2', x: 400, y: 300, width: 120, height: 80, label: '车辆', color: '#10b981' },
  ]);
  const [selectedRectId, setSelectedRectId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'rect'>('select');
  const [zoom, setZoom] = useState(100);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [labels, setLabels] = useState([
    { name: '人脸', color: '#3b82f6' },
    { name: '车辆', color: '#10b981' },
    { name: '车牌', color: '#f59e0b' },
    { name: '行人', color: '#ef4444' },
  ]);
  const [activeLabel, setActiveLabel] = useState('人脸');

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (tool === 'rect') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoom / 100);
      const y = (e.clientY - rect.top) / (zoom / 100);
      
      const newRect: Rect = {
        id: Math.random().toString(36).substr(2, 9),
        x: x - 50,
        y: y - 50,
        width: 100,
        height: 100,
        label: activeLabel,
        color: labels.find(l => l.name === activeLabel)?.color || '#3b82f6'
      };
      setRects([...rects, newRect]);
      setTool('select');
    }
  };

  // Video State
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalFrames = 120;

  useEffect(() => {
    setView('list');
  }, [activeSubTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 font-medium">已完成</span>;
      case 'annotating': return <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 font-medium">标注中</span>;
      default: return <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium">未标注</span>;
    }
  };

  // --- Render Functions ---

  const renderImageAnnotationList = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">图片标注</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">数据标注 / 图片标注任务列表</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)]">
            <Upload className="w-4 h-4 mr-2" /> 导入数据集
          </button>
          <button 
            onClick={() => setTaskModalConfig({ open: true, type: 'image' })}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4 mr-2" /> 新建标注任务
          </button>
        </div>
      </div>

      <div className="card p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input 
            type="text" 
            placeholder="搜索任务名称、ID..." 
            value={imgSearch}
            onChange={(e) => setImgSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
          />
        </div>
        <select 
          value={imgStatusFilter}
          onChange={(e) => setImgStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[var(--text-primary)]"
        >
          <option>所有状态</option>
          <option>未开始</option>
          <option>标注中</option>
          <option>已完成</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">任务名称</th>
              <th className="px-6 py-4 font-semibold">任务ID</th>
              <th className="px-6 py-4 font-semibold">数据总量</th>
              <th className="px-6 py-4 font-semibold">已完成</th>
              <th className="px-6 py-4 font-semibold">进度</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">创建时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {filteredImageTasks.length > 0 ? filteredImageTasks.map((task) => (
              <tr key={task.id} className="hover:bg-[var(--bg-primary)] transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{task.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{task.id}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.total}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.completed}</td>
                <td className="px-6 py-4">
                  <div className="w-24">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(task.completed / task.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.time}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setSelectedItem(task); setView('imageEditor'); }}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    开始标注
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                  未找到匹配的标注任务
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVideoAnnotationList = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">视频标注</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">数据标注 / 视频标注任务列表</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)]">
            <Upload className="w-4 h-4 mr-2" /> 导入数据集
          </button>
          <button 
            onClick={() => setTaskModalConfig({ open: true, type: 'video' })}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4 mr-2" /> 新建标注任务
          </button>
        </div>
      </div>

      <div className="card p-4 flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input 
            type="text" 
            placeholder="搜索任务名称、ID..." 
            value={vidSearch}
            onChange={(e) => setVidSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
          />
        </div>
        <select 
          value={vidStatusFilter}
          onChange={(e) => setVidStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[var(--text-primary)]"
        >
          <option>所有状态</option>
          <option>未开始</option>
          <option>标注中</option>
          <option>已完成</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">任务名称</th>
              <th className="px-6 py-4 font-semibold">任务ID</th>
              <th className="px-6 py-4 font-semibold">视频总量</th>
              <th className="px-6 py-4 font-semibold">已完成</th>
              <th className="px-6 py-4 font-semibold">进度</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">创建时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {filteredVideoTasks.length > 0 ? filteredVideoTasks.map((task) => (
              <tr key={task.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{task.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{task.id}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.total}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.completed}</td>
                <td className="px-6 py-4">
                  <div className="w-24">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(task.completed / task.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.time}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setSelectedItem(task); setView('videoEditor'); }}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    进入标注
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                  未找到匹配的标注任务
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnnotationManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">标注管理</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setView('datasetMgmt')}
            className="flex items-center px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)]"
          >
            <Database className="w-4 h-4 mr-2" /> 数据集管理
          </button>
          <button 
            onClick={() => setView('export')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <FileOutput className="w-4 h-4 mr-2" /> 批量导出
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">任务名称</th>
              <th className="px-6 py-4 font-semibold">数据类型</th>
              <th className="px-6 py-4 font-semibold">数据总量</th>
              <th className="px-6 py-4 font-semibold">已标注数</th>
              <th className="px-6 py-4 font-semibold">标注进度</th>
              <th className="px-6 py-4 font-semibold">创建时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[
              { name: '人脸识别评测集', type: '图片', total: 5000, count: 4200, progress: 84, time: '2026-02-15' },
              { name: '车辆特征库', type: '图片', total: 2000, count: 120, progress: 6, time: '2026-02-28' },
              { name: '交通违章视频标注', type: '视频', total: 50, count: 12, progress: 24, time: '2026-03-01' },
            ].map((task, i) => (
              <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{task.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.type}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.total}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.count}</td>
                <td className="px-6 py-4">
                  <div className="w-32">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-blue-500 font-medium">{task.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.time}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <button className="text-xs font-medium text-blue-500 hover:text-blue-600">查看</button>
                    <button className="text-xs font-medium text-slate-500 hover:text-slate-600">导出</button>
                    <button className="text-xs font-medium text-red-500 hover:text-red-600">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderImageEditor = () => (
    <div className="h-full flex flex-col -m-6">
      {/* Editor Toolbar */}
      <div className="h-14 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-2">
          <button onClick={() => setView('list')} className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-[var(--border-color)] mx-2" />
          <div className="flex items-center px-3 py-1 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] mr-4">
            <span className="text-xs font-bold text-blue-500 mr-2">任务:</span>
            <span className="text-xs font-medium truncate max-w-[120px]">{selectedItem?.name}</span>
          </div>
          <button 
            onClick={() => setTool('select')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'select' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]")}
          >
            <MousePointer2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setTool('rect')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'rect' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]")}
          >
            <Square className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setRects([])}
            className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-red-500"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-[var(--border-color)] mx-2" />
          <button className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)]">
            <Undo2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)]">
            <Redo2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] px-2">
            <button onClick={() => setZoom(z => Math.max(10, z - 10))} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <Minimize2 className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(500, z + 10))} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" /> 保存标注
          </button>
          <button className="flex items-center px-4 py-1.5 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-primary)]">
            <FileOutput className="w-4 h-4 mr-2" /> 导出
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Image List */}
        <div className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col shrink-0">
          <div className="p-4 border-b border-[var(--border-color)]">
            <h3 className="text-sm font-bold flex items-center">
              <ImageIcon className="w-4 h-4 mr-2 text-blue-500" /> 待标注图片 (12)
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i, idx) => (
              <div 
                key={i} 
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  "p-2 rounded-lg border transition-all cursor-pointer group",
                  currentImageIndex === idx ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-transparent hover:bg-[var(--bg-primary)]"
                )}
              >
                <div className="aspect-video rounded bg-slate-200 dark:bg-slate-800 mb-2 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${idx + 100}/200/120`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate font-medium">IMG_00{i}.jpg</span>
                  {idx < 2 ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center">
          <div 
            onClick={handleCanvasClick}
            className={cn(
              "relative bg-white shadow-2xl transition-transform duration-200",
              tool === 'rect' ? 'cursor-crosshair' : 'cursor-default'
            )}
            style={{ 
              width: '800px', 
              height: '600px', 
              transform: `scale(${zoom / 100})`,
              backgroundImage: `url(https://picsum.photos/seed/${currentImageIndex + 100}/800/600)`,
              backgroundSize: 'cover'
            }}
          >
            {/* Rects */}
            <div className="absolute inset-0">
              {rects.map((rect) => (
                <div 
                  key={rect.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedRectId(rect.id); }}
                  className={cn(
                    "absolute border-2 transition-all",
                    selectedRectId === rect.id ? "ring-2 ring-white ring-offset-2 ring-offset-blue-500" : ""
                  )}
                  style={{ 
                    left: `${rect.x}px`, 
                    top: `${rect.y}px`, 
                    width: `${rect.width}px`, 
                    height: `${rect.height}px`,
                    borderColor: rect.color,
                    backgroundColor: `${rect.color}20`
                  }}
                >
                  <span 
                    className="absolute -top-6 left-0 text-white text-[10px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: rect.color }}
                  >
                    {rect.label}
                  </span>
                  {selectedRectId === rect.id && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setRects(rects.filter(r => r.id !== rect.id));
                        setSelectedRectId(null);
                      }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Canvas Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--border-color)] rounded-full px-6 py-2 shadow-xl">
            <button 
              disabled={currentImageIndex === 0}
              onClick={() => setCurrentImageIndex(prev => prev - 1)}
              className="p-1.5 hover:bg-white rounded-full disabled:opacity-30"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold">{currentImageIndex + 1} / 12</span>
            <button 
              disabled={currentImageIndex === 11}
              onClick={() => setCurrentImageIndex(prev => prev + 1)}
              className="p-1.5 hover:bg-white rounded-full disabled:opacity-30"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-[var(--border-color)] mx-1" />
            <button className="p-1.5 hover:bg-white rounded-full"><Settings2 className="w-4 h-4" /></button>
            <div className="h-4 w-px bg-[var(--border-color)] mx-1" />
            <span className="text-xs font-mono">x: 422, y: 156</span>
          </div>
        </div>

        {/* Right: Properties */}
        <div className="w-72 border-l border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col shrink-0">
          <div className="p-4 border-b border-[var(--border-color)]">
            <h3 className="text-sm font-bold flex items-center">
              <Layers className="w-4 h-4 mr-2 text-blue-500" /> 标注属性
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Label Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">标签管理</span>
                <button className="text-blue-500 hover:text-blue-600"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {labels.map((l) => (
                  <button 
                    key={l.name}
                    onClick={() => setActiveLabel(l.name)}
                    className={cn(
                      "flex items-center px-2 py-1.5 rounded border text-xs transition-all",
                      activeLabel === l.name ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-[var(--border-color)] hover:bg-[var(--bg-primary)]"
                    )}
                  >
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: l.color }} />
                    <span className="truncate">{l.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Rect Info */}
            {selectedRectId && (
              <div className="space-y-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-blue-500/20">
                <span className="text-xs font-bold text-blue-500 uppercase">当前标注坐标</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--text-secondary)]">X 坐标</label>
                    <input type="number" value={Math.round(rects.find(r => r.id === selectedRectId)?.x || 0)} className="w-full px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-xs" readOnly />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--text-secondary)]">Y 坐标</label>
                    <input type="number" value={Math.round(rects.find(r => r.id === selectedRectId)?.y || 0)} className="w-full px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-xs" readOnly />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--text-secondary)]">宽度</label>
                    <input type="number" value={Math.round(rects.find(r => r.id === selectedRectId)?.width || 0)} className="w-full px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-xs" readOnly />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--text-secondary)]">高度</label>
                    <input type="number" value={Math.round(rects.find(r => r.id === selectedRectId)?.height || 0)} className="w-full px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-xs" readOnly />
                  </div>
                </div>
              </div>
            )}

            {/* Annotation List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">已标注列表 ({rects.length})</span>
              <div className="space-y-2">
                {rects.map((r) => (
                  <div 
                    key={r.id} 
                    onClick={() => setSelectedRectId(r.id)}
                    className={cn(
                      "flex items-center justify-between p-2 rounded border transition-all cursor-pointer group",
                      selectedRectId === r.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : "bg-[var(--bg-primary)] border-[var(--border-color)]"
                    )}
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: r.color }} />
                      <span className="text-xs font-medium">{r.label}_{r.id.slice(0, 4)}</span>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:text-red-500" onClick={(e) => { e.stopPropagation(); setRects(rects.filter(item => item.id !== r.id)); }}><X className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVideoEditor = () => (
    <div className="h-full flex flex-col -m-6">
      {/* Video Toolbar */}
      <div className="h-14 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-2">
          <button onClick={() => setView('list')} className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-[var(--border-color)] mx-2" />
          <div className="flex items-center px-3 py-1 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] mr-4">
            <span className="text-xs font-bold text-blue-500 mr-2">任务:</span>
            <span className="text-xs font-medium truncate max-w-[120px]">{selectedItem?.name}</span>
          </div>
          <button className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)]"><MousePointer2 className="w-5 h-5" /></button>
          <button className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 rounded-lg"><Square className="w-5 h-5" /></button>
          <div className="h-6 w-px bg-[var(--border-color)] mx-2" />
          <span className="text-xs font-medium text-[var(--text-primary)]">TRAFFIC_MONITOR_001.mp4</span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">保存</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video List */}
        <div className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col shrink-0">
          <div className="p-4 border-b border-[var(--border-color)]">
            <h3 className="text-sm font-bold flex items-center">
              <VideoIcon className="w-4 h-4 mr-2 text-blue-500" /> 视频列表 (5)
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {[1, 2, 3, 4, 5].map((i, idx) => (
              <div 
                key={i} 
                className={cn(
                  "p-2 rounded-lg border transition-all cursor-pointer group",
                  idx === 0 ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-transparent hover:bg-[var(--bg-primary)]"
                )}
              >
                <div className="aspect-video rounded bg-slate-200 dark:bg-slate-800 mb-2 flex items-center justify-center">
                  <VideoIcon className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate font-medium">VIDEO_00{i}.mp4</span>
                  {idx === 0 ? <Clock className="w-3 h-3 text-blue-500" /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Player & Canvas */}
        <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950">
          <div className="flex-1 relative flex items-center justify-center p-8">
            <div className="relative aspect-video w-full max-w-4xl bg-black shadow-2xl overflow-hidden rounded-lg">
              <img src="https://picsum.photos/seed/video/1280/720" alt="" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center">
                {!isPlaying && <Play className="w-16 h-16 text-white/50" />}
              </div>
              {/* Rect Overlay */}
              <div className="absolute border-2 border-blue-500 bg-blue-500/10" style={{ left: '20%', top: '30%', width: '15%', height: '25%' }}>
                <span className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">车辆 #1</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-32 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] p-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="p-1 hover:text-blue-500"><SkipBack className="w-5 h-5" /></button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button className="p-1 hover:text-blue-500"><SkipForward className="w-5 h-5" /></button>
                <span className="text-xs font-mono text-[var(--text-secondary)]">00:01:24 / 00:05:20</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[var(--text-secondary)]">当前帧: {currentFrame}</span>
              </div>
            </div>
            
            <div className="relative h-8 bg-[var(--bg-primary)] rounded border border-[var(--border-color)] overflow-hidden">
              {/* Frame Indicator */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10" 
                style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
              />
              {/* Keyframes */}
              <div className="absolute top-0 bottom-0 w-1 bg-emerald-500" style={{ left: '10%' }} />
              <div className="absolute top-0 bottom-0 w-1 bg-emerald-500" style={{ left: '25%' }} />
              <div className="absolute top-0 bottom-0 w-1 bg-emerald-500" style={{ left: '60%' }} />
            </div>
          </div>
        </div>

        {/* Right: Properties */}
        <div className="w-72 border-l border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
          <h3 className="text-sm font-bold mb-4">标注属性</h3>
          <div className="space-y-6">
             <div className="space-y-2">
               <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">标签</label>
               <select className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm">
                 <option>车辆</option>
                 <option>行人</option>
                 <option>非机动车</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">关键帧设置</label>
               <button className="w-full py-2 border border-blue-500 text-blue-500 rounded-lg text-xs font-medium hover:bg-blue-50">
                 标记为关键帧
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExport = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">标注导出</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">将标注数据导出为标准格式</p>
      </div>

      <div className="card p-8 space-y-8">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-[var(--text-primary)]">选择标注任务</label>
          <select className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm">
            <option>人脸识别评测集 (4200/5000)</option>
            <option>车辆特征库 (120/2000)</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-[var(--text-primary)]">选择导出格式</label>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-left transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-600">PASCAL VOC</span>
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-[var(--text-secondary)]">XML 格式，包含详细的目标边界框和类别信息。</p>
            </button>
            <button className="p-6 border-2 border-[var(--border-color)] hover:border-blue-500 rounded-xl text-left transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[var(--text-primary)]">YOLO</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">TXT 格式，归一化坐标，适用于 YOLO 系列算法训练。</p>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center">
            <Download className="w-5 h-5 mr-2" /> 开始导出标注数据
          </button>
        </div>
      </div>
    </div>
  );

  const renderDatasetMgmt = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">数据集管理</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> 新建数据集
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: '标准人脸库-V1', count: 5000, type: '图片', time: '2026-02-15' },
          { name: '城市交通监控-夜间', count: 1200, type: '视频帧', time: '2026-02-20' },
          { name: '违停车辆抓拍集', count: 800, type: '图片', time: '2026-03-01' },
        ].map((ds, i) => (
          <div key={i} className="card p-6 hover:border-blue-500 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <Database className="w-6 h-6" />
              </div>
              <button className="p-1 text-[var(--text-secondary)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-1">{ds.name}</h3>
            <div className="flex items-center text-xs text-[var(--text-secondary)] space-x-3">
              <span>{ds.type}</span>
              <span>•</span>
              <span>{ds.count} 条数据</span>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-secondary)]">创建于 {ds.time}</span>
              <button className="text-xs font-medium text-blue-500 hover:text-blue-600">管理数据</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TaskModal = ({ config, onClose, onAdd }: { config: any; onClose: () => void; onAdd: (task: any) => void }) => {
    const [name, setName] = useState('');
    const [dataset, setDataset] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onAdd({
        id: `${config.type === 'image' ? 'IMG' : 'VID'}-TASK-${Math.floor(Math.random() * 1000)}`,
        name,
        total: 100,
        completed: 0,
        status: 'pending',
        time: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].slice(0, 5)
      });
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
            <h3 className="text-lg font-bold">新建{config.type === 'image' ? '图片' : '视频'}标注任务</h3>
            <button onClick={onClose} className="p-1 hover:bg-[var(--bg-primary)] rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">任务名称</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入标注任务名称"
                className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">源数据集</label>
              <select 
                required
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">请选择数据集</option>
                <option value="ds1">标准人脸库-V1 (5000条)</option>
                <option value="ds2">城市交通监控-夜间 (1200条)</option>
                <option value="ds3">违停车辆抓拍集 (800条)</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--bg-primary)]"
              >
                取消
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                创建任务
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  const renderContent = () => {
    if (view === 'imageEditor') return renderImageEditor();
    if (view === 'videoEditor') return renderVideoEditor();
    if (view === 'export') return renderExport();
    if (view === 'datasetMgmt') return renderDatasetMgmt();

    return (
      <>
        {taskModalConfig.open && (
          <TaskModal 
            config={taskModalConfig}
            onClose={() => setTaskModalConfig({ open: false })}
            onAdd={(task) => {
              if (taskModalConfig.type === 'image') {
                setImageTasks([task, ...imageTasks]);
              } else {
                setVideoTasks([task, ...videoTasks]);
              }
            }}
          />
        )}
        {(() => {
          switch (activeSubTab) {
            case 'img-anno': return renderImageAnnotationList();
            case 'video-anno': return renderVideoAnnotationList();
            case 'export-anno': return renderExport();
            default: return renderAnnotationManagement();
          }
        })()}
      </>
    );
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
