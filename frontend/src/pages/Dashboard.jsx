import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Layout from '../components/Layout';
import API from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const products = await API.get('/products');
        const users = await API.get('/users');
        const orders = await API.get('/orders');

        const revenue = orders.data.reduce(
          (sum, order) => sum + order.totalAmount, 0
        );

        setStats({
          products: products.data.length,
          users: users.data.length,
          orders: orders.data.length,
          revenue: revenue
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Products', value: stats.products,
      icon: <InventoryIcon fontSize="large" />, color: '#1976d2' },
    { title: 'Total Users', value: stats.users,
      icon: <PeopleIcon fontSize="large" />, color: '#388e3c' },
    { title: 'Total Orders', value: stats.orders,
      icon: <ShoppingCartIcon fontSize="large" />, color: '#f57c00' },
    { title: 'Revenue', value: `$${stats.revenue}`,
      icon: <AttachMoneyIcon fontSize="large" />, color: '#7b1fa2' },
  ];

  return (
    <Layout>
      <Typography variant="h4" mb={4}>Dashboard</Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between"
                  alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Dashboard;