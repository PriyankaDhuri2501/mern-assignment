import { Container, Box, Typography } from '@mui/material';
import MovieCard from '../components/movies/MovieCard';
import { useWatchlist } from '../context/WatchlistContext';

const RecentlyViewedPage = () => {
  const { recentlyViewed } = useWatchlist();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Recently Viewed
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Movies you&apos;ve opened recently.
        </Typography>
      </Box>

      {recentlyViewed.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No recently viewed movies yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start exploring movies and they will appear here.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
              xl: 'repeat(6, 1fr)',
            },
            gap: 3,
          }}
        >
          {recentlyViewed.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default RecentlyViewedPage;

