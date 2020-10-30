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
  // Read JSON body
  console.log(req.body)
  const jsonString = JSON.stringify(req.body)
  fs.writeFile('./newCustomer.json', jsonString, err => {
    if (err) {
      return res.status(500).json({error: 'Server error'})
    } else {
      return res.json(req.body)
    }
  })
})

app.get('/', (req, res) => {
  fs.readFile(__dirname + "/newCustomer.json", "utf8", (err, jsonString) => {
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
