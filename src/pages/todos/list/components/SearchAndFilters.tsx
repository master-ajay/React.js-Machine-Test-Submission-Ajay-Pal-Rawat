import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import type { SearchAndFiltersProps } from './TodoList.interface'

export function SearchAndFilters({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  userFilter,
  onUserChange,
  sortValue,
  onSortChange,
  availableUsers,
  getUserName,
  styles,
}: SearchAndFiltersProps) {
  return (
    <Paper sx={styles.filtersContainer}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          placeholder="Search todos by title..."
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          sx={styles.searchInput}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        <Box sx={styles.filterRow}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={e => onStatusChange(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Assigned User</InputLabel>
            <Select
              value={userFilter}
              label="Assigned User"
              onChange={e => onUserChange(e.target.value)}
            >
              <MenuItem value="">All Users</MenuItem>
              {availableUsers?.filter(Boolean)?.map(userId => (
                <MenuItem key={userId} value={userId.toString()}>
                  {getUserName(userId)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortValue} label="Sort By" onChange={e => onSortChange(e.target.value)}>
              <MenuItem value="dueDate-asc">Due Date (Ascending)</MenuItem>
              <MenuItem value="dueDate-desc">Due Date (Descending)</MenuItem>
              <MenuItem value="title-asc">Title (A-Z)</MenuItem>
              <MenuItem value="title-desc">Title (Z-A)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Paper>
  )
}
