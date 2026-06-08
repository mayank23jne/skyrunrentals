const http = require('http');

http.get('http://localhost:3000/plans', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("RESPONSE FROM API:");
    console.log(data);
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
