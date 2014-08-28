var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("employeedb05");
    db.collection('employees', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'employees' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});

//list all employess
exports.findAll = function(req, res) {
    
    db.collection('employees', function(error, employee_collection) {
        employee_collection.find().toArray(function(error, items) {
            res.jsonp(items);
        });
    });
};

//get particular employee
exports.findEmployee = function(req, res) {
    console.log('req.params',req.params);
    console.log("new url");
    var id = req.params.id;
    db.collection('employees',function(error, employee_collection) {
      if( error ) res.jsonp(error)
      else {
        employee_collection.findOne({_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) res.jsonp(error)
          else res.jsonp(result)
        });
      }
    });
};

//create new employee
exports.createEmployee = function(req,res){
    console.log(req.body);
    db.collection('employees', function(error, employee_collection) {
      if( error ) res.jsonp(error)
      else {

        employee_collection.insert(req.body, function() {
          res.jsonp({status:"OK",message:"Employee Added Sucessfully...."});
        });
      }
    });
};
// update the particular employee
exports.updateEmployee = function  (req,res) {
    var update_emp_object= req.body;
    var emp_id = update_emp_object['_id'];
    delete(update_emp_object['_id']);
    //console.log('update_emp_object',update_emp_object)
    db.collection('employees',function(error,employee_collection){
        if(error) res.jsonp(error)
        else{
            employee_collection.update({_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(emp_id)},update_emp_object,
             function(){
                res.jsonp({status:"OK",message:"Employee updated Sucessfully...."});
            });
        }
    });
}
//delete employee
exports.deleteEmployee = function(req,res){
    //console.log('Delete',req.params.id);
    var delEmpId =req.params.id;
    db.collection('employees',function(error,employee_collection){
        if(error) res.jsonp(error)
        else{
            employee_collection.remove({_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(delEmpId)},
             function(){
                res.jsonp({status:"OK",message:"Employee Deleted Sucessfully...."});
            });
        }
    });
};
exports.getAllManager = function(req,res){
    db.collection('employees', function(error, employee_collection) {
        employee_collection.find({ actAsManager : true },{ _id: 1, name: 1 }).toArray(function(error, items) {
           
            res.jsonp(items);
        });
    });
};

exports.getEmployeeByManager = function(req,res){
    var managerId =req.params.id;
    //console.log("managerId",managerId);
    db.collection('employees', function(error, employee_collection) {
        employee_collection.find({ "manager._id" : managerId },{ _id: 1, name: 1,designation: 1 }).toArray(function(error, items) {
            //console.log('items',items);
            res.jsonp(items);
        });
    });
};
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    console.log("Populating employee database...");
    // var employees = [
    //     {"id": 1, "name": "James King", "managerId": 0, managerName: "", "designation": "President and CEO", "phone": "617-000-0001",  "email": "jking@fakemail.com", "address": "Boston, MA"},
    //     {"id": 2, "name": "Julie Taylor", "managerId": 1, managerName: "James King", "designation": "VP of Marketing",  "phone": "617-000-0002", "email": "jtaylor@fakemail.com", "address": "Boston, MA"},
    //     {"id": 3, "name": "Eugene Lee", "managerId": 1, managerName: "James King", "designation": "CFO",  "phone": "617-000-0003",  "email": "elee@fakemail.com", "address": "Boston, MA"},
    //     {"id": 4, "name": "John Williams", "managerId": 1, managerName: "James King", "designation": "VP of Engineering", "phone": "617-000-0004", "email": "jwilliams@fakemail.com", "address": "Boston, MA"},
    //     {"id": 5, "name": "Ray Moore", "managerId": 1, managerName: "James King", "designation": "VP of Sales",  "phone": "617-000-0005", "email": "rmoore@fakemail.com", "address": "Boston, MA"},
    //     {"id": 6, "name": "Paul Jones", "managerId": 4, managerName: "John Williams", "designation": "QA Manager",  "phone": "617-000-0006", "email": "pjones@fakemail.com", "address": "Boston, MA"},
    //     {"id": 7, "name": "Paula Gates", "managerId": 4, managerName: "John Williams", "designation": "Software Architect",  "phone": "617-000-0007", "email": "pgates@fakemail.com", "address": "Boston, MA"},
    //     {"id": 8, "name": "Lisa Wong", "managerId": 2, managerName: "Julie Taylor", "designation": "Marketing Manager", "phone": "617-000-0008",  "email": "lwong@fakemail.com", "address": "Boston, MA"},
    //     {"id": 9, "name": "Gary Donovan", "managerId": 2, managerName: "Julie Taylor", "designation": "Marketing Manager",  "phone": "617-000-0009", "email": "gdonovan@fakemail.com", "address": "Boston, MA"},
    //     {"id": 10, "name": "Kathleen Byrne", "managerId": 5, managerName: "Ray Moore", "designation": "Sales Representative", "phone": "617-000-0010",  "email": "kbyrne@fakemail.com", "address": "Boston, MA"},
    //     {"id": 11, "name": "Amy Jones", "managerId": 5, managerName: "Ray Moore", "designation": "Sales Representative", "phone": "617-000-0011", "email": "ajones@fakemail.com", "address": "Boston, MA"},
    //     {"id": 12, "name": "Steven Wells", "managerId": 4, managerName: "John Williams", "designation": "Software Architect", "phone": "617-000-0012",  "email": "swells@fakemail.com", "address": "Boston, MA"}
    // ];
    var employees =[

        {"name": "James King", "manager":{}, "designation": "President and CEO", "phone": "617-000-0001",  "email": "jking@fakemail.com", "address": "Boston, MA",actAsManager:true}
    
    ];
 
    db.collection('employees', function(err, collection) {
        collection.insert(employees, {safe:true}, function(err, result) {});
    });
 
};
