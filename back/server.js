const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({extended: false}))
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
   'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
})

app.post('/register', (req, res) => {
  // Try to read customer file
  fs.readFile(__dirname + "/customer.json", "utf8", (errRead, jsonCustomer) => {
    if (errRead) {
      // If can't find file, create
      if (errRead.code == 'ENOENT') {
        const jsonBody = JSON.stringify({customers: [req.body]})
        fs.writeFile(__dirname + "/customer.json", jsonBody, errWrite => {
          if (errWrite) {
            return res.status(500).json({error: 'Server error first'})
          } else {
            return res.json(req.body)
          }
        })
      } else {
          return res.status(500).json({error: 'Server error second'})
      }
    } else {
      // If file already existis, update and save again
      try {
        var customer = JSON.parse(jsonCustomer);
        customer.customers = [...customer.customers, req.body]
        const updatedCustomer = JSON.stringify(customer)
        fs.writeFile(__dirname + "/customer.json", updatedCustomer, errWrite => {
          if (errWrite) {
            return res.status(500).json({error: 'Server error'})
          }
        })
        return res.json(customer);
      } catch(err){
        return res.status(500).json({error: 'Server error'})
      }
    }
  });
})

app.get('/', (req, res) => {
  fs.readFile(__dirname + "/customer.json", "utf8", (err, jsonString) => {
    if (err) {
      return res.status(500).json({error: 'Server error'})
    }
    try {
      const customer = JSON.parse(jsonString);
      return res.json(customer);
    } catch(err){
      return res.status(500).json({error: 'Server error'})
    }
  });
});

app.listen(8081, () => {
  console.log('App runing on port 8081');
})
