export function formattedServerUptime(): string{
  const uptime = process.uptime();
  return `${Math.floor(uptime/(60*60))}hrs ${Math.floor((uptime%(60*60))/60)}mins ${Math.floor(uptime%60)}secs`;
}