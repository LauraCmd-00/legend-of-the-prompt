export function log(category: string, message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${category}] ${message}`, data ?? '');
}

export function logError(category: string, message: string, error?: unknown) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${category}] ${message}`, error ?? '');
}
