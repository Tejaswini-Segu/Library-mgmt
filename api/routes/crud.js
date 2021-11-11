const books=require('../../model/book');
const librarian=require('../../model/librarian');
const user=require('../../model/user');
const bookIssued=require('../../model/bookIssued');
const { response } = require('express');

module.exports = function (router) {

    router.use(function(req, res, next) {
        res.invalidInput = function(err) {
            return res.status(400).json({"error": err});
        };
        next();
    });
    router.use(function(req, res, next) {
        res.success = function(resp) {
            return res.status(400).json(resp);
        };
        next();
    });
    router.use(function(req, res, next) {
        res.exists = function() {
            return res.json({"msg":"Already exists"});
        };
        next();
    });

    //for creating book record
    router.post('/addBook', async function (req, res) {    
        let bookData = await books.findOne({isbn:req.body.isbn});
        if(bookData == null){
            let newBook = new books(req.body);
            newBook.save(function (err, newBook) {
                if (err) {
                    res.invalidInput(err);
                }
                else {
                    res.success(newBook);
                }
            })
        }
        else{
            res.exists();
        }
    })

    //for creating new users
   router.post('/addUser', async function (req, res) {
        let userData = await user.findOne({allocId:req.body.allocId});
        if(userData == null){
            let newUser = new user(req.body);
            newUser.save(function (err, newUser) {
                if (err) {
                    res.invalidInput(err)
                }
                else {
                    res.success(newUser);
                }
            })
        }
        else{
            res.exists();
        }
    }) 


    //Get book by isbn
   router.get('/books/:isbn',async function (req, res) {
        try{
            let bookData=await books.find({isbn:req.params.isbn});
            return res.success(bookData);
        }
        catch(err){
            res.invalidInput(err)
        }
    })

    //Get book by isbn
   router.get('/book/:name',async function (req, res) {
       try{
           let bookData=await books.find({name:req.params.name});
           return res.success(bookData);
        }
        catch(err){
            res.invalidInput(err)
        }
    })

    //for updation after issuing a book
    router.post('/issueBooks', async function(req, res) {
            try{
                let userData=await user.findOne({allocId:req.body.allocId});
                let bookData=await books.findOne({isbn:req.body.isbn});
                let issuedData =new bookIssued();
                issuedData.userId=userData._id;
                issuedData.bookId=bookData._id;
                var date = new Date(); // Now
                date.setDate(date.getDate() + 30); // Set now + 30
                issuedData.dueDate=date;
                issuedData.save((err,response)=>{
                    if (err) {
                        res.invalidInput(err)
                    }
                    else {
                        res.success(response)
                    }
                })
            }
            catch(err){
                res.invalidInput(err);
            }
    })

    router.put('/returnbooks/:id',async function (req, res) {
        try{
            let book=await bookIssued.findByIdAndUpdate({_id:req.params.id},{$set:{status:'INACTIVE'}});
            return res.success(book);
        }
        catch(err){
            res.invalidInput(err)
        }
    });

    router.get('/:userId',async function (req, res) {
        try{
            let userData=await user.findOne({allocId:req.params.allocId});
            return res.success(bookData);
        }
        catch(err){
            res.invalidInput(err)
        }
    })


}