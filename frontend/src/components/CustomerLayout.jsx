import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography,
  Button, Badge, IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CustomerLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  return (
    <Box>
      <AppBar position="fixed" sx={{ backgroundColor: '#2e7d32' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/customer/products')}>
            🛒 ShopEasy
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              color="inherit"
              onClick={() => navigate('/customer/products')}>
              Products
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/customer/my-orders')}>
              My Orders
            </Button>
            <IconButton
              color="inherit"
              onClick={() => navigate('/customer/cart')}>
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Typography>{user?.name}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 8, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default CustomerLayout;