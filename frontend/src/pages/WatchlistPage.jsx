import { Container, Box, Typography } from '@mui/material';
import MovieCard from '../components/movies/MovieCard';
import { useWatchlist } from '../context/WatchlistContext';

const WatchlistPage = () => {
  const { watchlist } = useWatchlist();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          My Watchlist
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Save movies you want to watch later.
        </Typography>
      </Box>

      {watchlist.length === 0 ? (
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
            Your watchlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse movies and click &quot;Watchlist&quot; to save them here.
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
          {watchlist.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default WatchlistPage;

