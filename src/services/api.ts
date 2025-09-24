import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.2.2:3335', // ip que o android studio usa para acesar meu localhost (funcionando )
});

export default api;












//import axios from 'axios';

//const api = axios.create({
    //baseURL:'http://10.53.52.44:3335',
//})

//export default api;