const express=require('express')
const app=express()
const api=require('./api')
const morgan=require('morgan')
const cors=require('cors');
var user = require('./model/user');
var jsonwebtoken = require("jsonwebtoken");

app.set('port',(process.env.PORT||8081))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use('/api',api)
app.use(express.static('static'))
app.use(morgan('dev'))
app.use(function (req,res){
    const err=new Error('Not Found')
    err.status=404
    res.json(err);
})

app.use(function(req, res, next) {
	if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
	  jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
		if (err) req.user = undefined;
		req.user = decode;
		next();
	  });
	} else {
	  req.user = undefined;
	  next();
	}
}); 

//  MongoDB connection 
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
	console.log('Connected to MongoDB')
	app.listen(app.get('port'), function () {
		console.log('API Server Listening on port ' + app.get('port') + '!')
	})
})

module.exports = app;