import type {
  AnalyticsReport,
  DashboardMetric,
  RidershipStats,
  RevenueStats,
  PerformanceStats,
  TimePeriod,
  MetricType,
  MetricDataPoint
} from '../types'

const STORAGE_KEY = "analytics";

let reports: AnalyticsReport[] = [];
let metrics: DashboardMetric[] = [];

// --- INIT ---
export const initReports = (data: AnalyticsReport[]): void => {
  reports = [...data];
};

export const initMetrics = (data: DashboardMetric[]): void => {
  metrics = [...data];
};

// --- REPORT READ Operations ---
export const getAllReports = (): AnalyticsReport[] => [...reports];

export const getReportById = (id: string): AnalyticsReport | undefined => {
  return reports.find((r) => r.id === id);
};

export const getReportsByPeriod = (period: TimePeriod): AnalyticsReport[] => {
  return reports.filter((r) => r.period === period);
};

export const getLatestReport = (): AnalyticsReport | undefined => {
  if (reports.length === 0) return undefined;
  return [...reports].sort((a, b) =>
    b.generatedAt.localeCompare(a.generatedAt),
  )[0];
};

export const getReportsInDateRange = (
  startDate: string,
  endDate: string,
): AnalyticsReport[] => {
  return reports.filter(
    (r) => r.startDate >= startDate && r.endDate <= endDate,
  );
};

// --- METRIC READ Operations ---
export const getAllMetrics = (): DashboardMetric[] => [...metrics];

export const getMetricById = (id: string): DashboardMetric | undefined => {
  return metrics.find((m) => m.id === id);
};

export const getMetricsByType = (type: MetricType): DashboardMetric[] => {
  return metrics.filter((m) => m.type === type);
};

export const getMetricsByPeriod = (period: TimePeriod): DashboardMetric[] => {
  return metrics.filter((m) => m.period === period);
};

export const getTrendingUpMetrics = (): DashboardMetric[] => {
  return metrics.filter((m) => m.trend === "up");
};

export const getTrendingDownMetrics = (): DashboardMetric[] => {
  return metrics.filter((m) => m.trend === "down");
};

// --- REPORT WRITE Operations ---
export const addReport = (report: AnalyticsReport): AnalyticsReport => {
  reports = [...reports, report];
  return report;
};

export const updateReport = (
  id: string,
  updates: Partial<AnalyticsReport>,
): AnalyticsReport | undefined => {
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) return undefined;
  reports[index] = { ...reports[index], ...updates };
  return reports[index];
};

export const deleteReport = (id: string): boolean => {
  const initialLength = reports.length;
  reports = reports.filter((r) => r.id !== id);
  return reports.length < initialLength;
};

// --- METRIC WRITE Operations ---
export const addMetric = (metric: DashboardMetric): DashboardMetric => {
  metrics = [...metrics, metric];
  return metric;
};

export const updateMetric = (
  id: string,
  updates: Partial<DashboardMetric>,
): DashboardMetric | undefined => {
  const index = metrics.findIndex((m) => m.id === id);
  if (index === -1) return undefined;
  metrics[index] = { ...metrics[index], ...updates };
  return metrics[index];
};

export const addDataPointToMetric = (
  id: string,
  dataPoint: MetricDataPoint,
): DashboardMetric | undefined => {
  const metric = getMetricById(id);
  if (!metric) return undefined;
  return updateMetric(id, { data: [...metric.data, dataPoint] });
};

export const deleteMetric = (id: string): boolean => {
  const initialLength = metrics.length;
  metrics = metrics.filter((m) => m.id !== id);
  return metrics.length < initialLength;
};

// --- AGGREGATION Helpers ---
export const calculateAverageMetricValue = (type: MetricType): number => {
  const typeMetrics = getMetricsByType(type);
  if (typeMetrics.length === 0) return 0;
  const sum = typeMetrics.reduce((acc, m) => acc + m.currentValue, 0);
  return sum / typeMetrics.length;
};

export const getPerformanceSummary = (): PerformanceStats | undefined => {
  const latest = getLatestReport();
  return latest?.performance;
};

export const getRidershipSummary = (): RidershipStats | undefined => {
  const latest = getLatestReport();
  return latest?.ridership;
};

export const getRevenueSummary = (): RevenueStats | undefined => {
  const latest = getLatestReport();
  return latest?.revenue;
};

// --- UTILITY Operations ---
export const getReportCount = (): number => reports.length;
export const getMetricCount = (): number => metrics.length;

// --- STORAGE KEY Export ---
export const ANALYTICS_STORAGE_KEY = STORAGE_KEY;
