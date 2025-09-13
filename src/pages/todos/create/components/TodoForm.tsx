import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Stack,
  Typography,
} from '@mui/material'
import type { TodoFormProps } from './AddTodo.interface'

export function TodoForm({
  formData,
  formErrors,
  isLoading,
  onInputChange,
  onSelectChange,
  onAddTag,
  onRemoveTag,
  onKeyPress,
  tagInput,
  onTagInputChange,
  availableUsers,
  usersLoading,
  styles,
}: TodoFormProps) {
  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Title *"
        value={formData.title}
        onChange={onInputChange('title')}
        error={!!formErrors['title']}
        helperText={formErrors['title']}
        disabled={isLoading}
      />

      <TextField
        fullWidth
        label="Description *"
        multiline
        rows={4}
        value={formData.description}
        onChange={onInputChange('description')}
        error={!!formErrors['description']}
        helperText={formErrors['description']}
        disabled={isLoading}
      />

      <Box sx={styles.formRow}>
        <TextField
          fullWidth
          label="Due Date *"
          type="date"
          value={formData.dueDate}
          onChange={onInputChange('dueDate')}
          error={!!formErrors['dueDate']}
          helperText={formErrors['dueDate']}
          disabled={isLoading}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: new Date().toISOString().split('T')[0],
            max: new Date(new Date().getFullYear() + 10, 11, 31).toISOString().split('T')[0],
          }}
        />

        <FormControl fullWidth error={!!formErrors['assignedUser']}>
          <InputLabel>Assigned User *</InputLabel>
          <Select
            value={formData.assignedUser}
            label="Assigned User *"
            onChange={onSelectChange('assignedUser')}
            disabled={isLoading || usersLoading}
          >
            {availableUsers.map(user => (
              <MenuItem key={user.id} value={parseInt(user.id)}>
                {user.name} ({user.email})
              </MenuItem>
            ))}
          </Select>
          {formErrors['assignedUser'] && (
            <Typography variant="caption" color="error" sx={styles.helperText}>
              {formErrors['assignedUser']}
            </Typography>
          )}
        </FormControl>
      </Box>

      <Box sx={styles.formRow}>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={formData.priority || ''}
            label="Priority"
            onChange={onSelectChange('priority')}
            disabled={isLoading}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            label="Status"
            onChange={onSelectChange('status')}
            disabled={isLoading}
          >
            <MenuItem value="todo">Todo</MenuItem>
            <MenuItem value="inProgress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box>
        <TextField
          fullWidth
          label="Add Tags"
          value={tagInput}
          onChange={e => onTagInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={isLoading}
          helperText="Press Enter to add a tag"
          InputProps={{
            endAdornment: (
              <Button onClick={onAddTag} disabled={!tagInput.trim() || isLoading} size="small">
                Add
              </Button>
            ),
          }}
        />

        {formData.tags && formData.tags.length > 0 && (
          <Box sx={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => onRemoveTag(tag)}
                disabled={isLoading}
              />
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  )
}
