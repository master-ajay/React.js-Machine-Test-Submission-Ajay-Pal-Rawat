import type { SxProps, Theme } from '@mui/material'

export const useStyles = () => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  } as SxProps<Theme>,

  paper: {
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  } as SxProps<Theme>,

  title: {
    mb: 2,
  } as SxProps<Theme>,

  form: {
    width: '100%',
    mt: 1,
  } as SxProps<Theme>,

  submitButton: {
    mt: 3,
    mb: 2,
  } as SxProps<Theme>,

  loadingIcon: {
    width: '20px !important',
    height: '20px !important',
  } as SxProps<Theme>,

  alert: {
    mt: 2,
    mb: 2,
  } as SxProps<Theme>,
})
