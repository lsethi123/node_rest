var express = require('express'),
bodyParser = require('body-parser'),
employees = require('./routes/employee'),
projects = require('./routes/project'),
os = require('os'),
cluster = require('cluster');
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < os.cpus().length; i++) {
  	cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
  	console.log('worker ' + worker.process.pid + ' died');
  	cluster.fork();
  	console.log("Spaning new worker");
  });
   // Handle uncaught exception
   process.on('uncaughtException', function (err) {
   	console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
   	console.error(err.stack);
   	process.exit(1);
   });
} 
else{
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

	//employee APIS
	app.get('/employee', employees.findAll);
	app.get('/employee/manager', employees.getAllManager);
	app.get('/employee/manager/:id', employees.getEmployeeByManager);
	app.get('/employee/:id', employees.findEmployee);
	app.post('/employee',employees.createEmployee);
	app.put('/employee/:id',employees.updateEmployee);
	app.delete('/employee/:id',employees.deleteEmployee);
	// project APIS
	app.get('/project',projects.findAll);
	app.post('/project',projects.createProject);
	app.get('/project/:id',projects.findProject);
	app.put('/project/:id',projects.updateProject);
	app.delete('/project/:id',projects.deleteProject);

	app.listen(3000);
	console.log('Listening on port 3000...');
}