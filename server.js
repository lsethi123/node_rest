var express = require('express'),
  bodyParser = require('body-parser'),
    employees = require('./routes/employee');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//app.get('/employee/:id/reports', employees.findByManager);
//app.get('/employee/:id', employees.findById);

app.get('/employee', employees.findAll);
app.get('/employee/:id', employees.findEmployee);
app.post('/employee',employees.createEmployee);
app.put('/employee/:id',employees.updateEmployee);
app.delete('/employee/:id',employees.deleteEmployee);
app.listen(3000);
console.log('Listening on port 3000...');
