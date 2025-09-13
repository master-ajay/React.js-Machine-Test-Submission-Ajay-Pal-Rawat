import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material'
import { Lock as LockIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'hooks'
import { ROUTES } from 'utils/routes'
import { loginFormSchema, type LoginFormData } from 'utils/validators'
import { type FormErrors } from 'types'
import { useStyles } from './components/styles'

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()
  const styles = useStyles()

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  const handleInputChange =
    (field: keyof LoginFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }))

      if (formErrors[field]) {
        setFormErrors(prev => ({
          ...prev,
          [field]: undefined,
        }))
      }
    }

  const validateForm = (): boolean => {
    try {
      loginFormSchema.parse(formData)
      setFormErrors({})
      return true
    } catch (error: any) {
      if (error.errors) {
        const errors: FormErrors = {}
        error.errors.forEach((err: any) => {
          const field = err.path[0] as string
          errors[field] = err.message
        })
        setFormErrors(errors)
      }
      return false
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const isAuthenticated = await login(formData.username, formData.password)

    if (isAuthenticated) {
      setSuccess(true)

      setTimeout(() => {
        navigate(ROUTES.todos.list)
      }, 1000)
    }
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={styles.container}>
        <Paper elevation={3} sx={styles.paper}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <LockIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography component="h1" variant="h4" fontWeight="bold" sx={styles.title}>
              Todo App
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Sign in to your account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleInputChange('username')}
              disabled={isLoading}
              error={!!formErrors['username']}
              helperText={formErrors['username']}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={isLoading}
              error={!!formErrors['password']}
              helperText={formErrors['password']}
            />

            {error && (
              <Alert severity="error" sx={styles.alert}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={styles.alert}>
                Login successful! Welcome back, {formData.username}!
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={styles.submitButton}
              disabled={isLoading}
              startIcon={isLoading && <CircularProgress sx={styles.loadingIcon} color="inherit" />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              <strong>Demo Credentials:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Username: admin
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Password: 123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export function SignInPage() {
  return <LoginForm />
}

export default LoginForm
