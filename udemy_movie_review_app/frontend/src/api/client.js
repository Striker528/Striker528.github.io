import axios from "axios";

//normally, in frontend/src/api/auth, when creating a user, have to do:
//await axios.post('http://localhost:8000/api/user/create')
//but because http://localhost:8000/api/ is so common, do what is done below to save time
//and just call client.post('/...')
const client = axios.create({ baseURL: 'http://localhost:8000/api' })

export default client;