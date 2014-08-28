var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("employeedb05");
    db.collection('projects', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'projects' collection doesn't exist. Creating it with sample data...");
            //populateDB();
        }
    });
});

//list all projects
exports.findAll = function(req, res) {
    db.collection('projects', function(error, project_collection) {
        project_collection.find().toArray(function(error, items) {
            res.jsonp(items);
        });
    });
};

//get particular project
exports.findProject = function(req, res) {
    console.log('req.params',req.params);
    var id = req.params.id;
    db.collection('projects',function(error, project_collection) {
      if( error ) res.jsonp(error)
      else {
        project_collection.findOne({_id: project_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) res.jsonp(error)
          else res.jsonp(result)
        });
      }
    });
};

//create new Project
exports.createProject = function(req,res){
    //console.log(req.body);
    db.collection('projects', function(error, project_collection) {
      if( error ) res.jsonp(error)
      else {
        project_collection.insert(req.body, function() {
          res.jsonp({status:"OK",message:"Project Added Sucessfully...."});
        });
      }
    });
};
// update the particular Project
exports.updateProject = function  (req,res) {
    var update_proj_object= req.body;
    var proj_id = update_proj_object['_id'];
    delete(update_proj_object['_id']);
    //console.log('update_emp_oject',update_emp_oject)
    db.collection('projects',function(error,project_collection){
        if(error) res.jsonp(error)
        else{
            project_collection.update({_id: project_collection.db.bson_serializer.ObjectID.createFromHexString(proj_id)},update_proj_object,
             function(){
                res.jsonp({status:"OK",message:"Employee updated Sucessfully...."});
            });
        }
    });
}
//delete employee
exports.deleteProject = function(req,res){
    //console.log('Delete',req.params.id);
    var delEmpId =req.params.id;
    db.collection('projects',function(error,project_collection){
        if(error) res.jsonp(error)
        else{
            project_collection.remove({_id: project_collection.db.bson_serializer.ObjectID.createFromHexString(delEmpId)},
             function(){
                res.jsonp({status:"OK",message:"Employee Deleted Sucessfully...."});
            });
        }
    });
};
exports.getAllManager = function(req,res){
    db.collection('projects', function(error, project_collection) {
        project_collection.find({ actAsManager : true },{ _id: 1, name: 1 }).toArray(function(error, items) {
            
            res.jsonp(items);
        });
    });
};


