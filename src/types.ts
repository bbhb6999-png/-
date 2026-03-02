export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Task {
  id: string;
  name: string;
  type: string;
  status: TaskStatus;
  progress: number;
  creator: string;
  createTime: string;
}

export interface SystemStat {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: string;
}

export interface ResourceUsage {
  time: string;
  cpu: number;
  memory: number;
  gpu: number;
}
