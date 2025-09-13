import { Box, Typography, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import type { PageHeaderProps } from './TodoList.interface'

export function PageHeader({ onAddTodo, styles }: PageHeaderProps) {
  return (
    <Box sx={styles.headerRow}>
      <Typography variant="h4" component="h1">
        Todo Management
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddTodo}>
        Add Todo
      </Button>
    </Box>
  )
}
