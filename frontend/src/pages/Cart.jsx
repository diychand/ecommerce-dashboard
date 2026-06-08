import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, totalAmount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      await API.post('/orders', {
        userId: user.id,
        products: cartItems.map(item => ({ productId: item._id, quantity: item.quantity })),
        totalAmount
      });
      clearCart();
      alert('🎉 Order placed successfully!');
      navigate('/customer/my-orders');
    } catch (error) {
      alert('Failed to place order. Try again.');
    }
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
          }}>← Continue Shopping</button>
          <button onClick={() => navigate('/customer/my-orders')} style={{
            background: 'none', border: '1px solid #ddd', borderRadius: 8,
            padding: '7px 16px', cursor: 'pointer', fontSize: 14, color: '#333'
          }}>My Orders</button>
          <span style={{ fontSize: 14, color: '#555' }}>Hi, <strong>{user?.name}</strong></span>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            backgroundColor: '#1a1a2e', color: 'white', border: 'none',
            borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: 14
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ paddingTop: 90, maxWidth: 1100, margin: '0 auto', padding: '90px 24px 60px' }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a2e', margin: '0 0 8px' }}>Your Cart</h1>
          <p style={{ color: '#999', margin: 0 }}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            backgroundColor: 'white', borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>Your cart is empty</h3>
            <p style={{ color: '#999', margin: '0 0 28px' }}>Add some products to get started!</p>
            <button onClick={() => navigate('/')} style={{
              backgroundColor: '#1a1a2e', color: 'white', border: 'none',
              borderRadius: 10, padding: '13px 32px', fontSize: 15,
              fontWeight: 700, cursor: 'pointer'
            }}>Start Shopping →</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>

            {/* Cart Items */}
            <div style={{ flex: 2, minWidth: 300 }}>
              <div style={{ backgroundColor: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr',
                  padding: '14px 24px', backgroundColor: '#1a1a2e', color: 'white',
                  fontSize: 13, fontWeight: 700, letterSpacing: 0.5
                }}>
                  <span>PRODUCT</span>
                  <span style={{ textAlign: 'center' }}>PRICE</span>
                  <span style={{ textAlign: 'center' }}>QTY</span>
                  <span style={{ textAlign: 'center' }}>SUBTOTAL</span>
                  <span></span>
                </div>

                {/* Cart Rows */}
                {cartItems.map((item, index) => (
                  <div key={item._id} style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr',
                    padding: '18px 24px', alignItems: 'center',
                    borderBottom: index < cartItems.length - 1 ? '1px solid #f5f5f5' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 10, overflow: 'hidden',
                        backgroundColor: '#f8f8f8', flexShrink: 0
                      }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💎</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>{item.category}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 600, color: '#555' }}>${item.price}</div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: '#f5f5f5', borderRadius: 8,
                        padding: '4px 14px', fontWeight: 700, fontSize: 15
                      }}>{item.quantity}</span>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 16, color: '#1a1a2e' }}>
                      ${item.price * item.quantity}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <button onClick={() => removeFromCart(item._id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#e63946', fontSize: 18, padding: 4
                      }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={clearCart} style={{
                marginTop: 12, background: 'none', border: '1px solid #e63946',
                color: '#e63946', borderRadius: 8, padding: '8px 20px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>Clear Cart</button>
            </div>

            {/* Order Summary */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                backgroundColor: 'white', borderRadius: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '28px'
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800, color: '#1a1a2e' }}>Order Summary</h3>

                {cartItems.map(item => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                    <span style={{ color: '#555' }}>{item.name} <span style={{ color: '#999' }}>×{item.quantity}</span></span>
                    <span style={{ fontWeight: 600 }}>${item.price * item.quantity}</span>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid #f0f0f0', margin: '16px 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#555' }}>
                  <span>Subtotal</span><span>${totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#2d6a4f' }}>
                  <span>Shipping</span><span>{totalAmount >= 100 ? 'FREE' : '$9.99'}</span>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', margin: '16px 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{ fontWeight: 800, fontSize: 17, color: '#1a1a2e' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e' }}>
                    ${totalAmount >= 100 ? totalAmount : totalAmount + 9.99}
                  </span>
                </div>

                <button onClick={handlePlaceOrder} style={{
                  width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                  backgroundColor: '#1a1a2e', color: 'white',
                  fontSize: 16, fontWeight: 800, cursor: 'pointer', marginBottom: 10
                }}
                  onMouseEnter={e => e.target.style.backgroundColor = '#e63946'}
                  onMouseLeave={e => e.target.style.backgroundColor = '#1a1a2e'}
                >
                  Place Order 🎉
                </button>

                <div style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
                  🔒 Secure checkout — your data is safe
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#1a1a2e', color: 'white', padding: '30px', textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>💎 LuxeShop</div>
        <div style={{ opacity: 0.5, fontSize: 12 }}>© 2024 LuxeShop. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Cart;