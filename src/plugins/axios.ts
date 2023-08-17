import { updateToast } from '../composables/useToast'
import axios from 'axios'

import router from '@/router'
const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: 'https://api.mahanls.com',
  // timeout: 15000,
  headers: { 'content-type': 'application/json' }
})

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use(config => {
  // Retrieve token from localStorage
  const token = localStorage.getItem('accessToken')

  // If token is found
  if (token) {
    // Set authorization header
    // ℹ️ JSON.parse will convert token to string
    config.headers.Authorization = `Bearer ${token}`
  }

  // Return modified config
  return config
})

axiosIns.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    const refresh = localStorage.getItem('refreshToken')

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error?.response?.status === 401) {
      axiosIns
        .post('/accounts/token/refresh/', {
          refresh: refresh
        })
        .then(r => {
          localStorage.setItem('accessToken', r.data.access)
          localStorage.setItem('refreshToken', r.data.refresh)
        })
        .catch(e => {
          localStorage.setItem('accessToken', '')
          localStorage.setItem('refreshToken', '')
          localStorage.setItem('userData', '')
          router.push({
            name: 'login'
          })
        })
    }

    // dont show errors if they are in this array

    const notShowErrors = ['Given token not valid for any token type']

    const errorMsg = error?.response?.data?.detail
    if (notShowErrors.includes(errorMsg)) {
      return Promise.reject(error)
    }

    if (error?.response?.data?.detail) {
      updateToast({
        color: 'error',
        text: error.response.data.detail
      })
    } else {
      updateToast({
        color: 'error',
        text: 'خطایی رخ داده است'
      })
    }
    return Promise.reject(error)
  }
)

export default axiosIns
