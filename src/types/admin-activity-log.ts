export interface ActivityLogItem {
  id: string;
  user: string;
  action: string;
  date: string;
  time: string;
}

export interface ActivityLogResponse {
  data: ActivityLogItem[];
  meta: { total: number; page: number; limit: number };
}
