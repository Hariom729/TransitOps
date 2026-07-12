type Permission = 'edit' | 'view' | 'none';
type Module = 'fleet' | 'driver' | 'trips' | 'fuel' | 'analytics';

export const RBAC: Record<string, Record<Module, Permission>> = {
  'Fleet Manager': { fleet: 'edit', driver: 'edit', trips: 'none', fuel: 'none', analytics: 'edit' },
  'Dispatcher': { fleet: 'view', driver: 'none', trips: 'edit', fuel: 'none', analytics: 'none' },
  'Safety Officer': { fleet: 'none', driver: 'edit', trips: 'view', fuel: 'none', analytics: 'none' },
  'Financial Analyst': { fleet: 'view', driver: 'none', trips: 'none', fuel: 'edit', analytics: 'edit' },
};

export function canView(role: string | undefined, module: Module): boolean {
  if (!role) return false;
  const perms = RBAC[role];
  if (!perms) return false;
  return perms[module] === 'view' || perms[module] === 'edit';
}

export function canEdit(role: string | undefined, module: Module): boolean {
  if (!role) return false;
  const perms = RBAC[role];
  if (!perms) return false;
  return perms[module] === 'edit';
}

export function hasAccess(role: string | undefined, path: string): boolean {
  if (path === '/vehicles' || path === '/maintenance') return canView(role, 'fleet');
  if (path === '/drivers') return canView(role, 'driver');
  if (path === '/' || path === '/trips') return canView(role, 'trips');
  if (path === '/finance') return canView(role, 'fuel');
  if (path === '/finance/reports') return canView(role, 'analytics');
  if (path === '/settings') return true;
  
  return false;
}

export function getRedirectPath(role: string | undefined): string {
  if (role === 'Fleet Manager') return '/vehicles';
  if (role === 'Dispatcher') return '/trips';
  if (role === 'Safety Officer') return '/drivers';
  if (role === 'Financial Analyst') return '/finance';
  return '/login';
}
