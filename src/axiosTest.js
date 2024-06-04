const axios = require('axios');

// Test API call
axios.get('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => {
    console.log('API call success:', response.data);
  })
  .catch(error => {
    console.error('API call error:', error);
  });