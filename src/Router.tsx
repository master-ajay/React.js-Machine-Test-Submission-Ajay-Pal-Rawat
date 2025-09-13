import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from './utils/routes'

import { DashboardLayout } from './components/layout'

import { HomePage, LoginForm, TodoList, AddTodo, EditTodo } from './pages'

export const router = createBrowserRouter([
  {
    path: ROUTES.auth.login,
    element: <LoginForm />,
  },

  {
    path: ROUTES.root,
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: ROUTES.todos.list,
        element: <TodoList />,
      },
      {
        path: ROUTES.todos.add,
        element: <AddTodo />,
      },
      {
        path: ROUTES.todos.edit(':todoId'),
        element: <EditTodo />,
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to={ROUTES.auth.login} replace />,
  },
])
