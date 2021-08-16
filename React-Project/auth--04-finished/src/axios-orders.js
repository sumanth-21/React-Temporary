import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-project-524e4-default-rtdb.firebaseio.com/'
});

export default instance;