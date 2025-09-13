import { Box, Button, CircularProgress } from '@mui/material'
import { Save } from '@mui/icons-material'
import type { FormActionsProps } from './AddTodo.interface'

export function FormActions({ onCancel, isLoading, styles }: FormActionsProps) {
  return (
    <Box sx={styles.formActions}>
      <Button variant="outlined" onClick={onCancel} disabled={isLoading} sx={styles.cancelButton}>
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
        disabled={isLoading}
        sx={styles.submitButton}
      >
        {isLoading ? 'Creating...' : 'Create Todo'}
      </Button>
    </Box>
  )
}
