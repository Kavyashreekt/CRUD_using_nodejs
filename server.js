/*
This node js file has all the API's coded (Create, Read, Update and Delete)
*/

/*Including the required dependncy files*/
var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
Below code is used to connect to DB
DB used : Mongo DB
As I am using the free DB cluster of MongoDB generated only to be used on my system, for thi code to work please replace the connect 
link. mongoose.connect("Replace your connect link here");
For more details on how to create mongo cluster please find the requirements.txt
*/
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://kavyashree:wKNokmuvatoHBCUi@cluster0.33hkf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

//Defining the DB schema, format for accepting data. Our Schema consists of ID, firstname and lastname of User
var nameSchema = new mongoose.Schema({
    IDnum:Number,
    firstName: String,
    lastName: String
});
//Instance of model defined above
var User = mongoose.model("User", nameSchema);

//CREATE OPERATION

//This get API is to display AddUSer HTML page which accepts USer data
app.get("/addnewuser", (req, res) => {
    res.sendFile(__dirname + "/AddUser.html");
});
//API which saves the user data to DB, called by addUser HTML page after accepting data
app.post("/adduser", (req, res) => {
    console.log("req = " +req)
    var myData = new User(req.body);
    console.log("myData = " + myData)
    myData.save()
        .then(item => {
            res.send("User saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

//READ OPERATION
//This get API is to display all the user data stores in DB
app.get("/getdataall", (req, res) => {
    User.find().lean().exec(function (err, users) {
         res.send(JSON.stringify(users));
    })
});

//Below code is to get specific user data based on UserID
//API to display HTML page getdatabyID which accepts UserID to pull User data
app.get("/getdata", (req, res) => {
    res.sendFile(__dirname + "/getdatabyID.html");

});
//API which gets the data from DB, called by getdatabyID HTML page after accepting ID
app.post("/getdatabyID", (req, res) => {
    User.findOne({IDnum: req.body.IDnum}, function (err, user) { 
         res.send(JSON.stringify(user));
    });
});

//UPDATE OPERATION
//API to display HTML page UpdatebyID which accepts UserID to of user to update
app.get("/updatefirstname", (req, res) => {
    res.sendFile(__dirname + "/UpdatebyID.html");
});   
//API which gets updates the DB, called by UpdatebyID HTML page after accepting ID(UserID whose data has to be update) 
//and Firstname(data to be updated to)
app.post('/updatebyID', function(req, res) {
    let firstname=req.body.firstName

    console.log("Firstname" + firstname)
    User.findOne({IDnum: req.body.IDnum}, function (err, user) { 


        user.firstName=firstname
        user.save()
        .then(item => {
            res.send("Updated database");
        })
        .catch(err => {
            res.status(400).send("Unable to update database");
        });

   });
});

//DELETE OPERATION
//API to display HTML page DeleteByID which accepts UserID to of user to be deleted
app.get("/deletebyID", (req, res) => {
    res.sendFile(__dirname + "/DeleteByID.html");
});
//API which deletes Use data of provided ID
app.post("/DeletebyID", (req, res) => {
    let idtoremove=req.body.IDnum
    User.remove({IDnum:req.body.IDnum}, 
        function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                res.send("User deleted");
            }
        });  
    });


app.listen(port, () => {
    console.log("Server listening on port " + port);
});