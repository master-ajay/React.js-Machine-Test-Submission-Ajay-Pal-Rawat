const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const apiRoutes = {
  auth: `${API_BASE_URL}/auth`,
  todos: {
    root: `${API_BASE_URL}/todo`,
    detail: (id: string): string => `${API_BASE_URL}/todo/${id}`,
    search: `${API_BASE_URL}/todo`,
  },
  users: {
    root: `${API_BASE_URL}/users`,
    detail: (id: string): string => `${API_BASE_URL}/users/${id}`,
    search: `${API_BASE_URL}/users`,
  },
}
