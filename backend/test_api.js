const API_URL = 'http://localhost:5000/api';
let token = '';
let demoProductId = '';

async function testAll() {
  console.log('🏁 Starting End-to-End API Integration Tests (using native fetch)...\n');

  try {
    // 1. Test GET /products
    console.log('➡️ Testing: GET /products...');
    const productsRes = await fetch(`${API_URL}/products`);
    if (productsRes.status === 200) {
      const data = await productsRes.json();
      if (data.products && data.products.length > 0) {
        console.log(`✅ Success: Found ${data.products.length} products (Total: ${data.total})\n`);
        demoProductId = data.products[0]._id;
      } else {
        throw new Error('Products list is empty');
      }
    } else {
      throw new Error(`Failed to fetch products: ${productsRes.status}`);
    }

    // 2. Test GET /products/categories
    console.log('➡️ Testing: GET /products/categories...');
    const catsRes = await fetch(`${API_URL}/products/categories`);
    if (catsRes.status === 200) {
      const data = await catsRes.json();
      if (data.includes('Grocery')) {
        console.log(`✅ Success: Categories found: [${data.join(', ')}]\n`);
      } else {
        throw new Error('Grocery category missing in response');
      }
    } else {
      throw new Error(`Failed to fetch categories: ${catsRes.status}`);
    }

    // 3. Test GET /products/featured
    console.log('➡️ Testing: GET /products/featured...');
    const featRes = await fetch(`${API_URL}/products/featured`);
    if (featRes.status === 200) {
      const data = await featRes.json();
      if (data.length > 0) {
        console.log(`✅ Success: Found ${data.length} featured products\n`);
      } else {
        throw new Error('Featured products list is empty');
      }
    } else {
      throw new Error(`Failed to fetch featured products: ${featRes.status}`);
    }

    // 4. Test POST /auth/login
    console.log('➡️ Testing: POST /auth/login (Demo account)...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rahul.sharma@example.com',
        password: 'password123'
      })
    });
    if (loginRes.status === 200) {
      const data = await loginRes.json();
      if (data.token) {
        token = data.token;
        console.log(`✅ Success: Logged in as ${data.name}\n`);
      } else {
        throw new Error('Login did not return a JWT token');
      }
    } else {
      const errText = await loginRes.text();
      throw new Error(`Login failed with status ${loginRes.status}: ${errText}`);
    }

    // Configure headers for authenticated requests
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 5. Test GET /auth/me
    console.log('➡️ Testing: GET /auth/me...');
    const meRes = await fetch(`${API_URL}/auth/me`, { headers: authHeaders });
    if (meRes.status === 200) {
      const data = await meRes.json();
      if (data.email === 'rahul.sharma@example.com') {
        console.log(`✅ Success: Retrieved profile for ${data.name}\n`);
      } else {
        throw new Error('Profile email mismatch');
      }
    } else {
      const errText = await meRes.text();
      throw new Error(`Profile fetch failed with status ${meRes.status}: ${errText}`);
    }

    // 6. Test POST /auth/wishlist/:productId
    console.log(`➡️ Testing: POST /auth/wishlist/${demoProductId} (Toggle)...`);
    const wishRes = await fetch(`${API_URL}/auth/wishlist/${demoProductId}`, {
      method: 'POST',
      headers: authHeaders
    });
    if (wishRes.status === 200) {
      const data = await wishRes.json();
      if (Array.isArray(data.wishlist)) {
        const isAdded = data.wishlist.includes(demoProductId);
        console.log(`✅ Success: Product ${isAdded ? 'ADDED to' : 'REMOVED from'} wishlist. Current wishlist size: ${data.wishlist.length}\n`);
      } else {
        throw new Error('Wishlist format invalid');
      }
    } else {
      const errText = await wishRes.text();
      throw new Error(`Wishlist toggle failed with status ${wishRes.status}: ${errText}`);
    }

    // 7. Test POST /orders
    console.log('➡️ Testing: POST /orders (Place new order)...');
    const productsResData = await (await fetch(`${API_URL}/products`)).json();
    const targetProduct = productsResData.products[0];
    const orderPayload = {
      items: [
        {
          product: demoProductId,
          name: targetProduct.name,
          image: targetProduct.images[0] || 'https://picsum.photos/seed/product/500/500',
          quantity: 2,
          price: targetProduct.price
        }
      ],
      shippingAddress: {
        name: 'Rahul Sharma',
        phone: '9876543210',
        pincode: '560001',
        locality: 'MG Road Area',
        address: '123, MG Road, near Metro Station',
        city: 'Bengaluru',
        state: 'Karnataka',
        addressType: 'Home'
      },
      paymentMethod: 'COD'
    };

    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(orderPayload)
    });
    let createdOrderId = '';
    if (orderRes.status === 201) {
      const data = await orderRes.json();
      if (data.orderId) {
        createdOrderId = data.orderId;
        console.log(`✅ Success: Placed order successfully. OrderID: ${createdOrderId}\n`);
      } else {
        throw new Error('OrderID not found in order confirmation response');
      }
    } else {
      const errText = await orderRes.text();
      throw new Error(`Order placement failed with status ${orderRes.status}: ${errText}`);
    }

    // 8. Test GET /orders/:orderId
    console.log(`➡️ Testing: GET /orders/${createdOrderId}...`);
    const singleOrderRes = await fetch(`${API_URL}/orders/${createdOrderId}`, { headers: authHeaders });
    if (singleOrderRes.status === 200) {
      const data = await singleOrderRes.json();
      if (data.orderId === createdOrderId) {
        console.log(`✅ Success: Retrieved order details correctly.\n`);
      } else {
        throw new Error('Retrieved Order ID mismatch');
      }
    } else {
      const errText = await singleOrderRes.text();
      throw new Error(`Order details fetch failed with status ${singleOrderRes.status}: ${errText}`);
    }

    // 9. Test GET /orders/my (Order history)
    console.log('➡️ Testing: GET /orders/my (Order history)...');
    const historyRes = await fetch(`${API_URL}/orders/my`, { headers: authHeaders });
    if (historyRes.status === 200) {
      const data = await historyRes.json();
      if (data.length > 0) {
        console.log(`✅ Success: Found ${data.length} orders in history.\n`);
      } else {
        throw new Error('Order history is empty');
      }
    } else {
      const errText = await historyRes.text();
      throw new Error(`Order history fetch failed with status ${historyRes.status}: ${errText}`);
    }

    console.log('🏆 ALL TESTS PASSED SUCCESSFULLY! The backend API is fully functional. 🎉');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
    process.exit(1);
  }
}

testAll();
