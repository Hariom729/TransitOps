export const ROLE_PERMISSIONS = {
  'Fleet Manager': ['/vehicles', '/maintenance'],
  'Dispatcher': ['/', '/trips'],
  'Safety Officer': ['/drivers'],
  'Financial Analyst': ['/finance', '/api/export-analytics.csv']
};

export function hasAccess(role: string | undefined, path: string): boolean {
  if (!role) return false;
  if (role === 'Fleet Manager' && (path === '/vehicles' || path === '/maintenance')) return true;
  if (role === 'Dispatcher' && (path === '/' || path === '/trips')) return true;
  if (role === 'Safety Officer' && path === '/drivers') return true;
  if (role === 'Financial Analyst' && (path === '/finance' || path === '/api/export-analytics.csv')) return true;
  
  // Allow all roles to access root / to redirect them properly
  return false;
}

export function getRedirectPath(role: string | undefined): string {
  if (role === 'Fleet Manager') return '/vehicles';
  if (role === 'Dispatcher') return '/';
  if (role === 'Safety Officer') return '/drivers';
  if (role === 'Financial Analyst') return '/finance';
  return '/login';
}
