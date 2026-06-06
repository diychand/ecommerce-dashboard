import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead,
  TableRow, Paper, Select, MenuItem, Chip
} from '@mui/material';
import Layout from '../components/Layout';
import API from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'pending') return 'warning';
    if (status === 'shipped') return 'info';
    if (status === 'delivered') return 'success';
  };

  return (
    <Layout>
      <Typography variant="h4" mb={3}>Orders</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>Order ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Customer</TableCell>
              <TableCell sx={{ color: 'white' }}>Total</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Update Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    {order._id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {order.userId?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      size="small"
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default Orders;