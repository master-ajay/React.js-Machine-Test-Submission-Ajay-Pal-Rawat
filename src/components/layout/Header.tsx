import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import { AccountCircle, Logout, Person } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'hooks'
import { ROUTES } from 'utils/routes'
import { useStyles } from './styles'

const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const styles = useStyles()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.auth.login)
    handleClose()
  }

  const handleProfile = () => {
    handleClose()
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="h1"
          sx={styles.title}
          onClick={() => navigate(ROUTES.todos.list)}
        >
          Todo App
        </Typography>
        <Box sx={styles.userSection}>
          {user && (
            <>
              <Typography variant="body2" sx={styles.userName}>
                Welcome, {user.username}
              </Typography>

              <IconButton
                size="large"
                aria-label="user account menu"
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={styles.avatarButton}
              >
                <Avatar sx={styles.avatar}>
                  {user.username ? getInitials(user.username) : <AccountCircle />}
                </Avatar>
              </IconButton>
            </>
          )}

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={styles.menu}
          >
            <MenuItem disabled sx={styles.menuItem}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText
                primary={user?.username || 'User'}
                secondary={user?.email || 'user@example.com'}
              />
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
