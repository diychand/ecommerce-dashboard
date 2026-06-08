import { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, CardActions,
  Typography, Button, Box, TextField
} from '@mui/material';
import CustomerLayout from '../components/CustomerLayout';
import { useCart } from '../context/CartContext';
import API from '../services/api';

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CustomerLayout>
      <Typography variant="h4" mb={3}>Our Products</Typography>
      <TextField
        label="Search products..."
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Grid container spacing={3}>
        {filtered.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography color="textSecondary" mb={1}>
                  {product.category}
                </Typography>
                <Typography mb={1}>
                  {product.description}
                </Typography>
                <Typography variant="h5" color="primary" mb={1}>
                  ${product.price}
                </Typography>
                <Typography color={
                  product.stock > 0 ? 'success.main' : 'error'
                }>
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : 'Out of Stock'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product)}
                  sx={{ backgroundColor: '#2e7d32' }}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </CustomerLayout>
  );
};

export default CustomerProducts;