import type { SxProps, Theme } from '@mui/material'

export const useStyles = () => ({
  container: {
    py: 4,
    maxWidth: 'md',
  } as SxProps<Theme>,

  header: {
    mb: 4,
  } as SxProps<Theme>,

  backButton: {
    mb: 3,
    color: 'primary.main',
  } as SxProps<Theme>,

  title: {
    fontWeight: 600,
    color: 'text.primary',
  } as SxProps<Theme>,

  paper: {
    p: 4,
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  } as SxProps<Theme>,

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    mt: 2,
  } as SxProps<Theme>,

  formRow: {
    display: 'flex',
    gap: 2,
    '& > *': {
      flex: 1,
    },
  } as SxProps<Theme>,

  formActions: {
    display: 'flex',
    gap: 2,
    justifyContent: 'flex-end',
    mt: 4,
    pt: 3,
    borderTop: '1px solid',
    borderColor: 'divider',
  } as SxProps<Theme>,

  submitButton: {
    minWidth: 120,
  } as SxProps<Theme>,

  cancelButton: {
    minWidth: 120,
  } as SxProps<Theme>,

  deleteButton: {
    minWidth: 120,
    mr: 'auto',
  } as SxProps<Theme>,

  tagChip: {
    m: 0.5,
  } as SxProps<Theme>,

  addTagButton: {
    mt: 1,
  } as SxProps<Theme>,

  statusMessage: {
    mb: 3,
  } as SxProps<Theme>,

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
  } as SxProps<Theme>,

  errorContainer: {
    textAlign: 'center',
    py: 4,
  } as SxProps<Theme>,
})
