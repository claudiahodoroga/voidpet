export function calculateTimeDifference(lastTime: string): string {
  const now = new Date();
  const lastDate = new Date(lastTime);
  const diffMs = now.getTime() - lastDate.getTime();
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  }
}