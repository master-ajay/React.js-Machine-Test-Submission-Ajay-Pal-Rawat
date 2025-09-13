import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  IconButton,
  Chip,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import type { Todo } from 'types'
import type { TodosTableProps } from './TodoList.interface'

export function TodosTable({
  todos,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  onEditTodo,
  onDeleteTodo,
  getUserName,
  getStatusColor,
  getPriorityColor,
  styles,
}: TodosTableProps) {
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Assigned User</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((todo: Todo) => (
              <TableRow key={todo.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {todo.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {todo.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={todo.status}
                    color={getStatusColor(todo.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(todo.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{getUserName(todo.assignedUser)}</TableCell>
                <TableCell>
                  {todo.priority && (
                    <Chip
                      label={todo.priority}
                      color={getPriorityColor(todo.priority) as any}
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => onEditTodo(todo.id)}
                    color="primary"
                    sx={styles.actionButton}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDeleteTodo(todo.id)}
                    color="error"
                    sx={styles.actionButton}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalItems}
        rowsPerPage={itemsPerPage}
        page={currentPage}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={e => {
          onItemsPerPageChange(parseInt(e.target.value, 10))
          onPageChange(0)
        }}
      />
    </Paper>
  )
}
