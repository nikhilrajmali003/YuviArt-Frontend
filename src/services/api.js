import axios from 'axios';

// ✅ Backend API base URL
const API_BASE_URL = 'http://localhost:8080/api';

// 🌈 Global Axios Config — handles CORS and JSON headers
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add response interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

//
// ==================== 🎨 ARTWORK API ====================
//
export const artworkAPI = {
  // ✅ Fetch artworks from backend + fallback to mock if backend fails
  getAll: async () => {
    try {
      const response = await axios.get('/artworks');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Backend unavailable — using mock artworks');
      return [
        {
          id: 1,
          title: 'Shree Krishn',
          imageUrl: '/images/shreeKrishn.jpg',
          category: 'paintings',
          price: 2000,
          description: 'A soulful depiction of Lord Krishna radiating divine charm, serenity, and eternal love.',
          rating: 5,
          available: true
        },
        {
          id: 2,
          title: 'Shree Radha Rani',
          imageUrl: '/images/radharani.jpg',
          category: 'sketches',
          price: 2000,
          description: 'Graceful and divine, this sketch captures Radha Rani\'s ethereal beauty and pure devotion.',
          rating: 5,
          available: true
        },
        {
          id: 3,
          title: 'Mahadev',
          imageUrl: '/images/Mahadev.jpg',
          category: 'paintings',
          price: 3000,
          description: 'A powerful portrayal of Lord Shiva, symbolizing calm amidst chaos and supreme strength.',
          rating: 5,
          available: true
        },
        {
          id: 4,
          title: 'Horses',
          imageUrl: '/images/hourses.jpg',
          category: 'sketches',
          price: 2000,
          description: 'Dynamic sketch showcasing the grace, freedom, and raw energy of galloping horses.',
          rating: 4,
          available: true
        },
        {
          id: 5,
          title: 'Shree Narshing Bhagwan',
          imageUrl: '/images/Narshing.jpg',
          category: 'custom',
          price: 2000,
          description: 'Mythical and divine — capturing Lord Narasimha\'s fierce power protecting his devotee Prahlad.',
          rating: 5,
          available: true
        },
        {
          id: 6,
          title: 'Durga Maa',
          imageUrl: '/images/Durgamaa.jpg',
          category: 'paintings',
          price: 3000,
          description: 'A stunning artwork of Goddess Durga, symbolizing courage, strength, and divine motherhood.',
          rating: 5,
          available: true
        }
      ];
    }
  },

  // FIXED: Changed template literal to function call
  getById: (id) => axios.get(`/artworks/${id}`),
  getByCategory: (category) => axios.get(`/artworks/category/${category}`),
  
  // Additional useful methods
  create: (artworkData) => axios.post('/artworks', artworkData),
  update: (id, artworkData) => axios.put(`/artworks/${id}`, artworkData),
  delete: (id) => axios.delete(`/artworks/${id}`)
};

//
// ==================== 🛒 ORDER API ====================
//
export const orderAPI = {
  create: (orderData) => axios.post('/orders', orderData),
  
  // FIXED: Changed template literal to function call
  getById: (id) => axios.get(`/orders/${id}`),
  getByEmail: (email) => axios.get(`/orders/customer/${email}`),
  getAll: () => axios.get('/orders'),

  // Payment integrations
  createRazorpayOrder: (amount) =>
    axios.post('/orders/payment/razorpay', { amount }),
  createStripePayment: (amount) =>
    axios.post('/orders/payment/stripe', { amount }),
  
  // Update order status
  updateStatus: (id, status) => 
    axios.put(`/orders/${id}/status`, { status })
};

//
// ==================== 🌟 TESTIMONIAL API ====================
//
export const testimonialAPI = {
  // ✅ Fetch backend testimonials + merge with mock data
  getAll: async () => {
    const mockTestimonials = [
      {
        id: 1,
        name: 'Priya Sharma',
        rating: 5,
        text: 'Absolutely breathtaking! Every stroke tells a story. The portrait exceeded my wildest expectations.',
        approved: true
      },
      {
        id: 2,
        name: 'Rahul Verma',
        rating: 5,
        text: 'Exceptional talent and professionalism. The attention to detail is simply remarkable.',
        approved: true
      },
      {
        id: 3,
        name: 'Anita Desai',
        rating: 5,
        text: 'A true artist with an incredible gift. The custom piece brought tears to my eyes.',
        approved: true
      }
    ];

    try {
      const response = await axios.get('/testimonials');
      const backendData = response.data || [];
      
      // Return backend data if available, otherwise use mock
      return backendData.length > 0 ? backendData : mockTestimonials;
    } catch (error) {
      console.warn('⚠️ Using mock testimonials (backend offline)');
      return mockTestimonials;
    }
  },

  create: (data) => axios.post('/testimonials', data),
  approve: (id) => axios.put(`/testimonials/${id}/approve`),
  delete: (id) => axios.delete(`/testimonials/${id}`)
};

//
// ==================== 💌 CONTACT / COMMISSION REQUEST API ====================
//
export const contactAPI = {
  submit: async (data) => {
    try {
      const response = await axios.post('/contact', data);
      console.log('✅ Commission Request Sent:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        '❌ Error sending commission request:',
        error.response?.data || error.message
      );
      throw error;
    }
  }
};

//
// ==================== 📊 ANALYTICS API (Optional) ====================
//
export const analyticsAPI = {
  getDashboardStats: () => axios.get('/analytics/dashboard'),
  getSalesReport: (startDate, endDate) => 
    axios.get(`/analytics/sales?start=${startDate}&end=${endDate}`)
};

//
// ==================== 👤 USER/AUTH API (For future use) ====================
//
export const authAPI = {
  login: (credentials) => axios.post('/auth/login', credentials),
  register: (userData) => axios.post('/auth/register', userData),
  logout: () => axios.post('/auth/logout'),
  getCurrentUser: () => axios.get('/auth/me')
};

// ✅ Export all APIs as one object
export default {
  artworkAPI,
  orderAPI,
  testimonialAPI,
  contactAPI,
  analyticsAPI,
  authAPI
};

// ✅ Also export individual APIs for named imports
export { artworkAPI, orderAPI, testimonialAPI, contactAPI, analyticsAPI, authAPI };