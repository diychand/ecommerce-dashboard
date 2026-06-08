import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems, addToCart, totalAmount, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    API.get('/products').then(res => setProducts(res.data)).catch(console.log);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddToCart = (product) => {
    if (!user) { navigate('/register'); return; }
    addToCart(product);
    showToast(`✅ ${product.name} added to cart!`);
  };

  const handlePlaceOrder = async () => {
    if (!user) { navigate('/register'); return; }
    try {
      await API.post('/orders', {
        userId: user.id,
        products: cartItems.map(i => ({ productId: i._id, quantity: i.quantity })),
        totalAmount
      });
      clearCart();
      showToast('🎉 Order placed successfully!');
      setTimeout(() => navigate('/customer/my-orders'), 1500);
    } catch {
      showToast('❌ Failed to place order.');
    }
  };

  const categories = ['All', 'Jewelry', 'Dresses'];
  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#fafafa', minHeight: '100vh' }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1a1a2e', color: 'white', padding: '12px 28px',
          borderRadius: 50, zIndex: 9999, fontSize: 15, boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>{toast}</div>
      )}

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: 'white', boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        padding: '0 40px', height: 65,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>💎</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
            LuxeShop
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <span style={{ color: '#555', fontSize: 14 }}>Hi, <strong>{user.name}</strong></span>
              <button onClick={() => navigate('/customer/my-orders')} style={{
                background: 'none', border: '1px solid #ddd', borderRadius: 8,
                padding: '7px 16px', cursor: 'pointer', fontSize: 14, color: '#333'
              }}>My Orders</button>
              <button onClick={() => navigate('/customer/cart')} style={{
                background: 'none', border: '1px solid #ddd', borderRadius: 8,
                padding: '7px 16px', cursor: 'pointer', fontSize: 14, color: '#333',
                position: 'relative'
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
              <button onClick={() => { logout(); navigate('/'); }} style={{
                backgroundColor: '#1a1a2e', color: 'white', border: 'none',
                borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: 14
              }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/customer/login')} style={{
                background: 'none', border: '1px solid #ddd', borderRadius: 8,
                padding: '7px 20px', cursor: 'pointer', fontSize: 14, color: '#333'
              }}>Login</button>
              <button onClick={() => navigate('/register')} style={{
                backgroundColor: '#1a1a2e', color: 'white', border: 'none',
                borderRadius: 8, padding: '7px 20px', cursor: 'pointer', fontSize: 14
              }}>Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        marginTop: 65,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white', padding: '90px 40px', textAlign: 'center'
      }}>
        <div style={{ fontSize: 13, letterSpacing: 4, opacity: 0.6, marginBottom: 16, textTransform: 'uppercase' }}>
          Premium Collection 2024
        </div>
        <h1 style={{ fontSize: 58, fontWeight: 900, margin: '0 0 16px', letterSpacing: '-2px', lineHeight: 1.1 }}>
          Jewelry & Fashion
        </h1>
        <p style={{ fontSize: 18, opacity: 0.7, maxWidth: 500, margin: '0 auto 40px' }}>
          Discover timeless elegance. Handcrafted jewelry and designer dresses for every occasion.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: '#e63946', color: 'white', border: 'none',
              borderRadius: 50, padding: '14px 36px', fontSize: 16,
              fontWeight: 700, cursor: 'pointer'
            }}>
            Shop Now →
          </button>
          {!user && (
            <button onClick={() => navigate('/register')} style={{
              backgroundColor: 'transparent', color: 'white',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: 50, padding: '14px 36px', fontSize: 16,
              fontWeight: 600, cursor: 'pointer'
            }}>
              Create Account
            </button>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginTop: 60, flexWrap: 'wrap' }}>
          {[['500+', 'Products'], ['10K+', 'Customers'], ['4.9★', 'Rating'], ['Free', 'Shipping']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{val}</div>
              <div style={{ fontSize: 13, opacity: 0.5, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES BAR */}
      <div style={{ backgroundColor: 'white', padding: '28px 40px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
          {[['🚚','Free Shipping','On orders over $100'],['🔒','Secure Payment','100% safe & encrypted'],['↩️','Easy Returns','30-day return policy'],['⭐','Authentic','Certified products only']].map(([icon, title, desc]) => (
            <div key={title} style={{ textAlign: 'center', minWidth: 150 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{title}</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div id="products-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#1a1a2e', margin: '0 0 8px' }}>Our Collection</h2>
          <p style={{ color: '#999', fontSize: 16, margin: '0 0 28px' }}>
            {user ? 'Add items to cart and place your order' : 'Sign in to start shopping'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '9px 24px', borderRadius: 50, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                backgroundColor: activeCategory === cat ? '#1a1a2e' : 'white',
                color: activeCategory === cat ? 'white' : '#333',
                border: activeCategory === cat ? '2px solid #1a1a2e' : '2px solid #e0e0e0'
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {filtered.map(product => (
            <div key={product._id} style={{
              backgroundColor: 'white', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ height: 220, backgroundColor: '#f8f8f8', overflow: 'hidden', position: 'relative' }}>
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>💎</div>
                )}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  backgroundColor: '#1a1a2e', color: 'white',
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20
                }}>{product.category}</div>
              </div>
              <div style={{ padding: '18px 20px 20px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}>{product.name}</h3>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: '#999', lineHeight: 1.5 }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>${product.price}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: product.stock > 0 ? '#2d6a4f' : '#e63946',
                    backgroundColor: product.stock > 0 ? '#d8f3dc' : '#ffe0e0',
                    padding: '3px 10px', borderRadius: 20
                  }}>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</span>
                </div>
                <button
                  disabled={product.stock === 0}
                  onClick={() => handleAddToCart(product)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                    backgroundColor: product.stock === 0 ? '#ccc' : '#1a1a2e',
                    color: 'white', fontSize: 14, fontWeight: 700,
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={e => { if (product.stock > 0) e.target.style.backgroundColor = '#e63946'; }}
                  onMouseLeave={e => { if (product.stock > 0) e.target.style.backgroundColor = '#1a1a2e'; }}
                >
                  {user ? '🛒 Add to Cart' : '🔒 Login to Buy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING CART */}
      {cartItems.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          backgroundColor: '#1a1a2e', color: 'white',
          borderRadius: 16, padding: '20px 24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)', minWidth: 280, maxWidth: 320
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            🛒 Cart ({cartItems.length} items)
          </div>
          <div style={{ maxHeight: 150, overflowY: 'auto', marginBottom: 12 }}>
            {cartItems.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, opacity: 0.85, marginBottom: 6 }}>
                <span>{item.name} ×{item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 10, marginBottom: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
            <span>Total</span><span>${totalAmount}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/customer/cart')} style={{
              flex: 1, padding: '10px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: 'transparent', color: 'white',
              fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>View Cart</button>
            <button onClick={handlePlaceOrder} style={{
              flex: 2, padding: '10px', borderRadius: 8, border: 'none',
              backgroundColor: '#e63946', color: 'white',
              fontSize: 13, fontWeight: 700, cursor: 'pointer'
            }}>Place Order →</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#1a1a2e', color: 'white', padding: '40px', textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>💎 LuxeShop</div>
        <div style={{ opacity: 0.5, fontSize: 13 }}>© 2024 LuxeShop. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default HomePage;