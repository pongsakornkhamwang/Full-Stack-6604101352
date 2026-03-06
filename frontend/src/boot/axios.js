import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000/api'
})

export default ({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
}

export { api }
