const auth = '/auth'
const login = `${auth}/login`

const todos = '/todos'
const todosAdd = `${todos}/add`

const root = '/'

export const ROUTES = {
  root,

  auth: {
    login,
  },

  todos: {
    root: todos,
    list: todos,
    add: todosAdd,
    edit: (todoId: string = ':todoId') => `${todos}/${todoId}/edit`,
    view: (todoId: string = ':todoId') => `${todos}/${todoId}`,
  },
} as const

export const ROUTE_PATTERNS = {
  auth: {
    login: '/auth/login',
  },
  todos: {
    list: '/todos',
    add: '/todos/add',
    edit: '/todos/:todoId/edit',
    view: '/todos/:todoId',
  },
} as const

export const PUBLIC_ROUTES = [ROUTES.auth.login] as const

export const DEFAULT_ROUTES = {
  afterLogin: ROUTES.todos.list,
  afterLogout: ROUTES.auth.login,
  notFound: ROUTES.auth.login,
} as const
