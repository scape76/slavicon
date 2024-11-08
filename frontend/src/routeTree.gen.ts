/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as CollectionRouteImport } from './routes/collection/route'
import { Route as CRouteImport } from './routes/c/route'
import { Route as IndexImport } from './routes/index'
import { Route as CollectionIndexImport } from './routes/collection/index'
import { Route as CIndexImport } from './routes/c/index'
import { Route as CollectionGodNameImport } from './routes/collection/$godName'
import { Route as CChatIdImport } from './routes/c/$chatId'

// Create/Update Routes

const CollectionRouteRoute = CollectionRouteImport.update({
  id: '/collection',
  path: '/collection',
  getParentRoute: () => rootRoute,
} as any)

const CRouteRoute = CRouteImport.update({
  id: '/c',
  path: '/c',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const CollectionIndexRoute = CollectionIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => CollectionRouteRoute,
} as any)

const CIndexRoute = CIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => CRouteRoute,
} as any)

const CollectionGodNameRoute = CollectionGodNameImport.update({
  id: '/$godName',
  path: '/$godName',
  getParentRoute: () => CollectionRouteRoute,
} as any)

const CChatIdRoute = CChatIdImport.update({
  id: '/$chatId',
  path: '/$chatId',
  getParentRoute: () => CRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/c': {
      id: '/c'
      path: '/c'
      fullPath: '/c'
      preLoaderRoute: typeof CRouteImport
      parentRoute: typeof rootRoute
    }
    '/collection': {
      id: '/collection'
      path: '/collection'
      fullPath: '/collection'
      preLoaderRoute: typeof CollectionRouteImport
      parentRoute: typeof rootRoute
    }
    '/c/$chatId': {
      id: '/c/$chatId'
      path: '/$chatId'
      fullPath: '/c/$chatId'
      preLoaderRoute: typeof CChatIdImport
      parentRoute: typeof CRouteImport
    }
    '/collection/$godName': {
      id: '/collection/$godName'
      path: '/$godName'
      fullPath: '/collection/$godName'
      preLoaderRoute: typeof CollectionGodNameImport
      parentRoute: typeof CollectionRouteImport
    }
    '/c/': {
      id: '/c/'
      path: '/'
      fullPath: '/c/'
      preLoaderRoute: typeof CIndexImport
      parentRoute: typeof CRouteImport
    }
    '/collection/': {
      id: '/collection/'
      path: '/'
      fullPath: '/collection/'
      preLoaderRoute: typeof CollectionIndexImport
      parentRoute: typeof CollectionRouteImport
    }
  }
}

// Create and export the route tree

interface CRouteRouteChildren {
  CChatIdRoute: typeof CChatIdRoute
  CIndexRoute: typeof CIndexRoute
}

const CRouteRouteChildren: CRouteRouteChildren = {
  CChatIdRoute: CChatIdRoute,
  CIndexRoute: CIndexRoute,
}

const CRouteRouteWithChildren =
  CRouteRoute._addFileChildren(CRouteRouteChildren)

interface CollectionRouteRouteChildren {
  CollectionGodNameRoute: typeof CollectionGodNameRoute
  CollectionIndexRoute: typeof CollectionIndexRoute
}

const CollectionRouteRouteChildren: CollectionRouteRouteChildren = {
  CollectionGodNameRoute: CollectionGodNameRoute,
  CollectionIndexRoute: CollectionIndexRoute,
}

const CollectionRouteRouteWithChildren = CollectionRouteRoute._addFileChildren(
  CollectionRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/c': typeof CRouteRouteWithChildren
  '/collection': typeof CollectionRouteRouteWithChildren
  '/c/$chatId': typeof CChatIdRoute
  '/collection/$godName': typeof CollectionGodNameRoute
  '/c/': typeof CIndexRoute
  '/collection/': typeof CollectionIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/c/$chatId': typeof CChatIdRoute
  '/collection/$godName': typeof CollectionGodNameRoute
  '/c': typeof CIndexRoute
  '/collection': typeof CollectionIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/c': typeof CRouteRouteWithChildren
  '/collection': typeof CollectionRouteRouteWithChildren
  '/c/$chatId': typeof CChatIdRoute
  '/collection/$godName': typeof CollectionGodNameRoute
  '/c/': typeof CIndexRoute
  '/collection/': typeof CollectionIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/c'
    | '/collection'
    | '/c/$chatId'
    | '/collection/$godName'
    | '/c/'
    | '/collection/'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/c/$chatId' | '/collection/$godName' | '/c' | '/collection'
  id:
    | '__root__'
    | '/'
    | '/c'
    | '/collection'
    | '/c/$chatId'
    | '/collection/$godName'
    | '/c/'
    | '/collection/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CRouteRoute: typeof CRouteRouteWithChildren
  CollectionRouteRoute: typeof CollectionRouteRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CRouteRoute: CRouteRouteWithChildren,
  CollectionRouteRoute: CollectionRouteRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/c",
        "/collection"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/c": {
      "filePath": "c/route.tsx",
      "children": [
        "/c/$chatId",
        "/c/"
      ]
    },
    "/collection": {
      "filePath": "collection/route.tsx",
      "children": [
        "/collection/$godName",
        "/collection/"
      ]
    },
    "/c/$chatId": {
      "filePath": "c/$chatId.tsx",
      "parent": "/c"
    },
    "/collection/$godName": {
      "filePath": "collection/$godName.tsx",
      "parent": "/collection"
    },
    "/c/": {
      "filePath": "c/index.tsx",
      "parent": "/c"
    },
    "/collection/": {
      "filePath": "collection/index.tsx",
      "parent": "/collection"
    }
  }
}
ROUTE_MANIFEST_END */
