export const getStatusColor = (type: 'Station' | 'Vehicle', status: string, battery?: number) => {
  if (status === 'MAINTENANCE' || status === 'OUT_OF_SERVICE') return '#ef4444';
  if (type === 'Station' && status === 'NEARLY_EMPTY') return '#f59e0b';
  if (type === 'Vehicle' && battery && battery < 20) return '#f59e0b';
  if (type === 'Vehicle' && status === 'IN_USE') return '#3b82f6';
  return '#10b981';
};