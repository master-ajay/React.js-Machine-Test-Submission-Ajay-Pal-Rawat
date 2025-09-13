import { Box, Container, Typography, Stack, Card, CardContent } from '@mui/material'
import { Dashboard as DashboardIcon } from '@mui/icons-material'

export function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack spacing={4} alignItems="center">
          <DashboardIcon sx={{ fontSize: 64, color: 'primary.main' }} />
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Todo Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ maxWidth: 600 }}>
            Manage your tasks efficiently with our modern todo application
          </Typography>

          <Card sx={{ maxWidth: 400, mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Welcome to Todo App
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start organizing your tasks and boost your productivity. Navigate to the todos
                section to get started.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  )
}
