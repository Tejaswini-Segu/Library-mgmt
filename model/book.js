const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn: { type: Number , unique:true},
    author: { type: String },
    name: { type: String },
    price: { type: Number },
    edition: { type: String },
    bookType: { type: String },
    totalCopies:{type:Number}
})

module.exports = mongoose.model('Book', bookSchema);