import { Box, Typography } from '@mui/material'
import type { LoadingAndErrorProps } from './TodoList.interface'

export function LoadingAndError({ isLoading, error, styles }: LoadingAndErrorProps) {
  if (isLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <Typography>Loading todos...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={styles.errorContainer}>
        <Typography color="error">
          {error instanceof Error ? error.message : 'Failed to fetch todos'}
        </Typography>
      </Box>
    )
  }

  return null
}
