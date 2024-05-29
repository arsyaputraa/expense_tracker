/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ProtectedImport } from './routes/_protected'
import { Route as AuthImport } from './routes/_auth'
import { Route as AboutIndexImport } from './routes/about/index'
import { Route as AuthIndexImport } from './routes/_auth/index'
import { Route as ProtectedExpensesIndexImport } from './routes/_protected/expenses/index'
import { Route as ProtectedExpensesCreateImport } from './routes/_protected/expenses/create'
import { Route as AuthAuthSignupImport } from './routes/_auth/auth/signup'
import { Route as AuthAuthLoginImport } from './routes/_auth/auth/login'

// Create/Update Routes

const ProtectedRoute = ProtectedImport.update({
  id: '/_protected',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AboutIndexRoute = AboutIndexImport.update({
  path: '/about/',
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  path: '/',
  getParentRoute: () => AuthRoute,
} as any)

const ProtectedExpensesIndexRoute = ProtectedExpensesIndexImport.update({
  path: '/expenses/',
  getParentRoute: () => ProtectedRoute,
} as any)

const ProtectedExpensesCreateRoute = ProtectedExpensesCreateImport.update({
  path: '/expenses/create',
  getParentRoute: () => ProtectedRoute,
} as any)

const AuthAuthSignupRoute = AuthAuthSignupImport.update({
  path: '/auth/signup',
  getParentRoute: () => AuthRoute,
} as any)

const AuthAuthLoginRoute = AuthAuthLoginImport.update({
  path: '/auth/login',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_protected': {
      preLoaderRoute: typeof ProtectedImport
      parentRoute: typeof rootRoute
    }
    '/_auth/': {
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof AuthImport
    }
    '/about/': {
      preLoaderRoute: typeof AboutIndexImport
      parentRoute: typeof rootRoute
    }
    '/_auth/auth/login': {
      preLoaderRoute: typeof AuthAuthLoginImport
      parentRoute: typeof AuthImport
    }
    '/_auth/auth/signup': {
      preLoaderRoute: typeof AuthAuthSignupImport
      parentRoute: typeof AuthImport
    }
    '/_protected/expenses/create': {
      preLoaderRoute: typeof ProtectedExpensesCreateImport
      parentRoute: typeof ProtectedImport
    }
    '/_protected/expenses/': {
      preLoaderRoute: typeof ProtectedExpensesIndexImport
      parentRoute: typeof ProtectedImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  AuthRoute.addChildren([
    AuthIndexRoute,
    AuthAuthLoginRoute,
    AuthAuthSignupRoute,
  ]),
  ProtectedRoute.addChildren([
    ProtectedExpensesCreateRoute,
    ProtectedExpensesIndexRoute,
  ]),
  AboutIndexRoute,
])

/* prettier-ignore-end */
