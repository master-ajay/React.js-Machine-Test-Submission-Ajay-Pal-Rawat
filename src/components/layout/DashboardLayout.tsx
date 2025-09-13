import { Outlet } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'
import Header from './Header'
import { AuthGuard } from 'components'
import { ErrorBoundary } from 'components/shared'
import { useStyles } from './styles'

const DashboardLayout = () => {
  const styles = useStyles()

  return (
    <AuthGuard>
      <ErrorBoundary>
        <Box sx={styles.root}>
          <CssBaseline />
          <Header />
          <Box component="main" sx={styles.main}>
            <Outlet />
          </Box>
        </Box>
      </ErrorBoundary>
    </AuthGuard>
  )
}

export default DashboardLayout
