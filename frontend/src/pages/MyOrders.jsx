import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  useEffect(() => {
    API.get('/orders/myorders')
      .then(res => setOrders(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    pending: { bg: '#fff3cd', color: '#856404', dot: '#ffc107' },
    shipped: { bg: '#cce5ff', color: '#004085', dot: '#007bff' },
    delivered: { bg: '#d4edda', color: '#155724', dot: '#28a745' }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#fafafa', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: 'white', boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        padding: '0 40px', height: 65,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <span style={{ fontSize: 28 }}>💎</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>LuxeShop</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: '1px solid #ddd', borderRadius: 8,
            padding: '7px 16px', cursor: 'pointer', fontSize: 14, color: '#333'
          }}>← Shop</button>
          <button onClick={() => navigate('/customer/cart')} style={{
            background: 'none', border: '1px solid #ddd', borderRadius: 8,
            padding: '7px 16px', cursor: 'pointer', fontSize: 14, color: '#333', position: 'relative'
          }}>
            🛒 Cart
            {cartItems.length > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -8,
                backgroundColor: '#e63946', color: 'white',
                borderRadius: '50%', width: 20, height: 20,
                fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{cartItems.length}</span>
            )}
          </button>
          <span style={{ fontSize: 14, color: '#555' }}>Hi, <strong>{user?.name}</strong></span>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            backgroundColor: '#1a1a2e', color: 'white', border: 'none',
            borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: 14
          }}>Logout</button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ paddingTop: 90, paddingBottom: 60, maxWidth: 1000, margin: '0 auto', padding: '90px 24px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a2e', margin: '0 0 8px' }}>My Orders</h1>
          <p style={{ color: '#999', fontSize: 15, margin: 0 }}>Track and manage all your orders</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            backgroundColor: 'white', borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛍️</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>No orders yet</h3>
            <p style={{ color: '#999', margin: '0 0 28px' }}>Browse our collection and place your first order!</p>
            <button onClick={() => navigate('/')} style={{
              backgroundColor: '#1a1a2e', color: 'white', border: 'none',
              borderRadius: 10, padding: '13px 32px', fontSize: 15,
              fontWeight: 700, cursor: 'pointer'
            }}>Start Shopping →</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order) => {
              const sc = statusColors[order.status] || statusColors.pending;
              return (
                <div key={order._id} style={{
                  backgroundColor: 'white', borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  padding: '24px 28px', border: '1px solid #f0f0f0'
                }}>
                  {/* Order Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <span style={{ fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>ORDER ID</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>
                        #{order._id.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>DATE</span>
                      <span style={{ fontWeight: 600, color: '#333' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>TOTAL</span>
                      <span style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e' }}>${order.totalAmount}</span>
                    </div>
                    <div style={{
                      backgroundColor: sc.bg, color: sc.color,
                      padding: '6px 16px', borderRadius: 50,
                      fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: 6
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: sc.dot, display: 'inline-block' }}></span>
                      {order.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid #f5f5f5', margin: '16px 0' }}></div>

                  {/* Products */}
                  <div>
                    <span style={{ fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Items Ordered</span>
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {order.products.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 8,
                              backgroundColor: '#f0f0f0', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', fontSize: 16
                            }}>💎</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>
                                {p.productId?.name || 'Product'}
                              </div>
                              <div style={{ fontSize: 12, color: '#999' }}>Qty: {p.quantity}</div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, color: '#1a1a2e' }}>
                            ${(p.productId?.price || 0) * p.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#1a1a2e', color: 'white', padding: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>💎 LuxeShop</div>
        <div style={{ opacity: 0.5, fontSize: 12 }}>© 2024 LuxeShop. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default MyOrders;