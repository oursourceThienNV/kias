import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function testCart() {
  try {
    console.log('Testing cart functionality...');
    
    // Test adding item to cart
    const cartData = {
      sku: "TEST-001",
      qty: 2
    };

    console.log('Adding item to cart...');
    console.log('Cart data:', JSON.stringify(cartData, null, 2));

    const response = await axiosInstance.post('/api/cart/mine/items', cartData);

    console.log('Success! Item added to cart:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('Error with cart:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testCart();
