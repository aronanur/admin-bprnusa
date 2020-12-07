import axios from 'axios';

// export const bprNusaServer = axios.create({ baseURL: 'http://localhost:3000' });
export const bprNusaServer = axios.create({ baseURL: 'https://bprnusa-dev.herokuapp.com' });
export const apiWilayah = axios.create({ baseURL: 'https://x.rajaapi.com' });