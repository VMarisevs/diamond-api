// Import express to create and configure the HTTP server.
var express = require('express');
// Import body parser to work with POST data
var bodyParser = require('body-parser');
// Import sqlite3 
var sqlite3 = require('sqlite3').verbose();

// Create a HTTP server app.
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // 

var db = new sqlite3.Database(':memory:');

// get data from json into array
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('convertcsv.json','utf8'));

//console.log(data);

// Creating virtual database and table
db.serialize(function() {
  db.run("CREATE TABLE Diamonds"
  + "("
  + "'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'carat' FLOAT, 'cut' VARCHAR(255)," // 3
  + " 'color' CHARACTER(5), 'clarity' CHARACTER(5)," // 2
  + "'depth' FLOAT, 'table' FLOAT, 'price' FLOAT," // 3
  + "'x' FLOAT, 'y' FLOAT, 'z' FLOAT" // 3
  + ")");

  
    var stmt = db.prepare("INSERT INTO Diamonds"
						+ " ('carat','cut','color', 'clarity','depth','table','price','x','y','z')"
						+ " VALUES"
						+ " (?,?,?,?,?,?,?,?,?,?)");
	

	data.forEach( function (diamond){
		
      	  stmt.run( diamond.carat, diamond.cut, diamond.color, diamond.clarity, diamond.depth, diamond.table, diamond.price, diamond.x, diamond.y, diamond.z);

    });
	
	stmt.finalize();
	console.log("Database was created in memory, and table was loaded from file convertcsv.json");
  
/*
  db.each("SELECT * FROM Diamonds", function(err, row) {
      console.log("id :" + row.id + " carat: " + row.carat);
  });
*/
 });



//db.close();

var Diamond = function(id, carat, cut, color, clarity, depth, table, price, x, y, z){
	this.id = (id) ? id : 0;
	this.carat = (carat) ? carat : "0.00";
	this.cut = (cut) ? cut : "None";
	this.color = (color) ? color : "T"; // for transparent
	this.clarity = (clarity) ? clarity : "NULL";
	this.depth = (depth) ? depth : "0.00";
	this.table = (table) ? table : "0";
	this.price = (price) ? price : "0.00";
	this.x = (x) ? x : "0.00";
	this.y = (y) ? y : "0.00";
	this.z = (z) ? z : "0.00";
	
}


// When a user goes to /, return a small help string.
app.get('/', function(req, res) {
  //var text = readFileSync("index.html");
  //res.send("This is the Diamond API.");
  res.render('index.ejs', { put: true});
});



// GET a diamond by its id
// browser http://localhost:8000/GET/2
app.post('/diamond',
	function (req, res){
		var diamondId =  (req.body.id) ? req.body.id : 0;
		db.serialize(function(){
			db.each(
				"SELECT * FROM Diamonds WHERE id = " + diamondId, 
				function(err, row) {
					var diamond  = new Diamond(
									row.id , row.carat, row.cut, row.color, row.clarity, row.depth, row.table, row.price, row.x, row.y,row.z );
					
					
					if (typeof(row) == "object"){						
						return res.json(diamond);
					}						
					else{
						return res.json("Error");
					}
							
			  });
			
		});		
	}
);

app.get('/GET/:diamondID',
	function (req, res){
		var diamondId = (req.params.diamondID) ? req.params.diamondID :  req.body.id;
	
		db.serialize(function(){
			db.each(
				"SELECT * FROM Diamonds WHERE id = " + diamondId, 
				function(err, row) {
					var diamond  = new Diamond(
									row.id , row.carat, row.cut, row.color, row.clarity, row.depth, row.table, row.price, row.x, row.y,row.z );
					console.log(diamond);									
					res.json(diamond);			
			  });
			
		});		
	}
);

/*  = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = */
/* // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // */
/*  = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = */
/* // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // */
/*  = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = */

// POST a new diamond, which will respond with the new id of the diamond.
// curl command:
// curl.exe -X POST --data "carat=0.24&cut=Very Good&color=Y&clarity=SI1&depth=59.8&table=55&price=327&x=4.2&y=4.35&z=2.48" http://127.0.0.1:8000/POST
app.post('/POST',
	function (req, res){
		
		// creating an object type Diamond with id 0, because db will generate new id for us.
		// using body parcer, parsing POST values that have been passed
		var diamond  = new Diamond(
									'0', req.body.carat, req.body.cut, req.body.color, req.body.clarity, req.body.depth, req.body.table, req.body.price, req.body.x, req.body.y,req.body.z );
		
		
		db.serialize(function(){
			
			var stmt = db.prepare("INSERT INTO Diamonds"
						+ " ('carat','cut','color', 'clarity','depth','table','price','x','y','z')"
						+ " VALUES"
						+ " (?,?,?,?,?,?,?,?,?,?)");
			
			stmt.run( diamond.carat, diamond.cut, diamond.color, diamond.clarity, diamond.depth, diamond.table, diamond.price, diamond.x, diamond.y, diamond.z);
			
			
			// getting last inserted id and pulling whole record
			var rowid;
			db.each(
				"SELECT last_insert_rowid()", 
				function(err, row) {	
					rowid = row['last_insert_rowid()'];
						
						db.each(
							"SELECT * FROM Diamonds WHERE id = " + rowid,
							function(err, row){
								
								diamond = new Diamond(rowid, row.carat, row.cut, row.color, row.clarity, row.depth, row.table, row.price, row.x, row.y, row.z);
								
								console.log(diamond);
								res.json(diamond);
							}
						);				
				}
			  );
		});
	}
);


/*  = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = */
/* // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // */
/*  = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = */
/* // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // */
/*  = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = */

// PUT a new diamond at a given id.
// curl command:
// curl.exe -X PUT --data "id=44&carat=0.24&cut=Very Good&color=Y&clarity=SI1&depth=59.8&table=55&price=327&x=4.2&y=4.35&z=2.48" http://127.0.0.1:8000/PUT

app.put('/PUT',
	function (req, res){
		var diamond  = new Diamond(
									req.body.id, req.body.carat, req.body.cut, req.body.color, req.body.clarity, req.body.depth, req.body.table, req.body.price, req.body.x, req.body.y,req.body.z );
		
		db.serialize(function(){
			
			var stmt = db.prepare("UPDATE Diamonds"
						+ " SET carat = ?,cut = ?,color = ?, clarity = ?,depth = ?,'table' = ?,price = ?,x = ?,y = ?,z = ?"
						+ " WHERE"
						+ " id = ?");
			
			stmt.run( diamond.carat, diamond.cut, diamond.color, diamond.clarity, diamond.depth, diamond.table, diamond.price, diamond.x, diamond.y, diamond.z,diamond.id,
			function(err, row){
				if (this.changes == 1)
					res.json(diamond);
				else
					res.json("Error");
			});
			
			
			
		});
	}
);

/*  = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = */
/* // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // */
/*  = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = */
/* // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // */
/*  = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = // = */

// DELETE a diamond by its id.
// curl command:
// curl.exe -X DELETE --data "id=1" http://127.0.0.1:8000/DELETE
app.delete('/DELETE',
	function (req, res){
		var diamond = new Diamond(req.body.id);
		
		db.serialize(function(){
			var stmt = db.prepare("DELETE FROM Diamonds"
						+ " WHERE"
						+ " id = ?");
			
			stmt.run(diamond.id, function(err, row){
				
				if (this.changes == 1){
					return res.json("OK");
				}
				else{
					return res.json("Error");
				}
					
			});
			
		});
		
		//console.log(diamond);
	}
);


app.use(express.static(__dirname + '/public'));
// Start the server.
var server = app.listen(8000);