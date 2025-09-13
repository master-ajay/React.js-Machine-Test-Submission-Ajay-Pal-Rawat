import type { SxProps, Theme } from '@mui/material'

export const useStyles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  } as SxProps<Theme>,

  main: {
    flexGrow: 1,
    bgcolor: 'background.default',
    minHeight: 'calc(100vh - 64px)',
  } as SxProps<Theme>,

  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    cursor: 'pointer',
  } as SxProps<Theme>,

  userSection: {
    display: 'flex',
    alignItems: 'center',
    ml: 2,
  } as SxProps<Theme>,

  userName: {
    mr: 2,
    display: { xs: 'none', sm: 'block' },
  } as SxProps<Theme>,

  avatarButton: {
    p: 0,
  } as SxProps<Theme>,

  avatar: {
    width: 40,
    height: 40,
    bgcolor: 'secondary.main',
    color: 'secondary.contrastText',
  } as SxProps<Theme>,

  menu: {
    mt: 1,
  } as SxProps<Theme>,

  menuItem: {
    opacity: 1,
  } as SxProps<Theme>,
})
