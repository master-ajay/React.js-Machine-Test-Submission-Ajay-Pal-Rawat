import { Paper, Typography, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import type { EmptyStateProps } from './TodoList.interface'

export function EmptyState({ onAddTodo, styles }: EmptyStateProps) {
  return (
    <Paper sx={styles.emptyStateContainer}>
      <Typography variant="h6" color="text.secondary" sx={styles.emptyStateTitle}>
        No todos found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={styles.emptyStateDescription}>
        Get started by creating your first todo item.
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddTodo}>
        Add Your First Todo
      </Button>
    </Paper>
  )
}
