import { Alert } from '@mui/material'
import type { StatusMessagesProps } from './AddTodo.interface'

export function StatusMessages({ success, error, styles }: StatusMessagesProps) {
  return (
    <>
      {success && (
        <Alert severity="success" sx={styles.statusMessage}>
          Todo created successfully! Redirecting to todo list...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={styles.statusMessage}>
          {error}
        </Alert>
      )}
    </>
  )
}
