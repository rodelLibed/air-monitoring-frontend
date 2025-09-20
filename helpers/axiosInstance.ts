import axios from 'axios'


// Create axios instance with base configuration (optional)
export const apiClient = axios.create({
  baseURL: 'https://air-monitoring-backend-production.up.railway.app',
//   timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})