const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    bookIssueId:{type:Schema.Types.ObjectId,ref:'bookIsuued'},
    bill:Number,
    status:{type:String, enum:['PAID','DUE'], default:'DUE'},
    createdOn:{type:Date, default:Date.now}
})

module.exports = mongoose.model('bill', billSchema)