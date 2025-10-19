import axios from 'axios';

// Create axios instance with cookie jar
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store cookies manually
let cookies = '';

async function loginAdmin() {
  try {
    console.log('Logging in as admin...');

    const loginData = {
      email: 'admin@evershop.io',
      password: '123456789'
    };

    const response = await axiosInstance.post('/admin/user/login', loginData);

    // Extract cookies from response headers
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      cookies = setCookieHeader.join('; ');
      console.log('Cookies received:', cookies);
    }

    console.log('Login successful!');
    console.log('Session ID:', response.data.data.sid);

    return response.data.data.sid;
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function testCreateProduct() {
  try {
    // First login
    await loginAdmin();

    const productData = {
      name: "Test Product",
      description: [],
      short_description: "This is a test product",
      sku: "TEST-001",
      url_key: "test-product",
      price: 29.99,
      status: 1,
      weight: 1.0,
      manage_stock: true,
      stock_availability: true,
      qty: 100,
      group_id: 1,
      visibility: 1
    };

    console.log('\nTesting product creation...');
    console.log('Product data:', JSON.stringify(productData, null, 2));

    // Add cookies to the request
    const response = await axiosInstance.post('/api/products', productData, {
      headers: {
        'Cookie': cookies
      }
    });

    console.log('Success! Product created:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('Error creating product:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testCreateProduct();
