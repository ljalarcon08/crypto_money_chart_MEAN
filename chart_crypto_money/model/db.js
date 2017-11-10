'use strict'

var mongoose=require('mongoose');
var dbOptions=require('./db.json');

var Schema=mongoose.Schema;
var ObjectId=Schema.ObjectId;
mongoose.Promise = global.Promise;
var us_graf=new Schema({
	time_:"date",
	close:"string",
	high:"string",
	low:"string",
	open:"string",
	volumefrom:"string",
	volumeto:"string",
	money_type:"string"
},
{
	collection:"priceindicator"
});
var PriceModel=mongoose.model('Priceindicator',us_graf);
mongoose.connect(`mongodb://${dbOptions.mongo.host}/${dbOptions.mongo.db}`,{ useMongoClient: true });


module.exports=PriceModel;