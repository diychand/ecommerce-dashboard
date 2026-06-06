import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../components/Layout';
import API from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    category: '', stock: '', image: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = (product = null) => {
    if (product) {
      setEditProduct(product);
      setForm(product);
    } else {
      setEditProduct(null);
      setForm({
        name: '', description: '', price: '',
        category: '', stock: '', image: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, form);
      } else {
        await API.post('/products', form);
      }
      fetchProducts();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Layout>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Category</TableCell>
              <TableCell sx={{ color: 'white' }}>Price</TableCell>
              <TableCell sx={{ color: 'white' }}>Stock</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <IconButton color="primary"
                    onClick={() => handleOpen(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error"
                    onClick={() => handleDelete(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          {editProduct ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          {['name', 'description', 'price', 'category', 'stock', 'image'].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={form[field]}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Products;