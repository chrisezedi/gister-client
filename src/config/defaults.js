const API_ENDPOINT = "http://localhost:5000";
const CLIENT_ENDPOINT = "http://localhost:3000";
const token = localStorage.getItem('x-auth-token');

const data = {API_ENDPOINT,CLIENT_ENDPOINT,token}

export default data;