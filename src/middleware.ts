import { defineMiddleware } from 'astro:middleware';
import { hasAccess, getRedirectPath } from './utils/auth';

export const onRequest = defineMiddleware((context, next) => {
  const role = context.cookies.get('user_role')?.value;
  const path = context.url.pathname;
  
  // Skip auth for login page
  if (path === '/login') return next();

  // Redirect to login if not authenticated
  if (!role) {
    return context.redirect('/login');
  }

  // If going to root and not Dispatcher, redirect to default path
  if (path === '/' && role !== 'Dispatcher') {
    return context.redirect(getRedirectPath(role));
  }

  // Enforce strict access boundaries
  if (path !== '/' && !hasAccess(role, path)) {
    return context.redirect(getRedirectPath(role));
  }

  return next();
});
