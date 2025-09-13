import type { SxProps, Theme } from '@mui/material'

export const useStyles = () => ({
  container: {
    py: 3,
  } as SxProps<Theme>,

  headerContainer: {
    mb: 3,
  } as SxProps<Theme>,

  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
  } as SxProps<Theme>,

  filtersContainer: {
    p: 3,
    mb: 3,
  } as SxProps<Theme>,

  filterRow: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
  } as SxProps<Theme>,

  searchInput: {
    mb: 2,
  } as SxProps<Theme>,

  tableContainer: {
    mt: 2,
  } as SxProps<Theme>,

  emptyState: {
    textAlign: 'center',
    py: 8,
  } as SxProps<Theme>,

  emptyStateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: 6,
    textAlign: 'center',
    backgroundColor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
  } as SxProps<Theme>,

  emptyStateTitle: {
    mb: 2,
    fontWeight: 600,
  } as SxProps<Theme>,

  emptyStateDescription: {
    mb: 3,
    maxWidth: 400,
  } as SxProps<Theme>,

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    py: 4,
  } as SxProps<Theme>,

  errorContainer: {
    mb: 3,
  } as SxProps<Theme>,

  header: {
    mb: 2,
  } as SxProps<Theme>,
})
