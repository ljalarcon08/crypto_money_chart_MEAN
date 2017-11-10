'use strict'

var connection=require('./db.js');
var PriceModel=()=>{};

PriceModel.getAll=(cb)=>{
	connection.find().exec((err,rows)=>{
		if(err)throw err;
		else{
			cb(rows);
		}
	});
};

PriceModel.countAll=(cb)=>{
	connection.count().exec((err,count)=>{
		if(err)throw err;
		else{
			cb(count);
		}
	});
};

PriceModel.getAllByType=(type,cb)=>{
	connection.find({money_type:type}).select('close high low open volumefrom volumento time_ -_id').sort({time_:-1}).limit(60).exec((err,rows)=>{
		if(err)throw err;
		else{
			cb(rows);
		}
	});
};

PriceModel.get=(id,money,cb)=>{
		connection.findOne({time_:id,money_type:money}).exec((err,rows)=>{
		if(err)throw err;
		else{
			cb(rows);
		}
	});
};


PriceModel.insert=(data,cb)=>{
	connection.count({time_:data.time_ , money_type:data.money_type}).exec((err,count)=>{
		if(err)throw err;
		else{
			if(count==0){
				connection.create(data,(err)=>{
					if(err)throw err;
					cb();
				})
			}
			else{
				cb();
			}
		}
	});
};

PriceModel.update=(data,cb)=>{
	connection.count({time_:data.time_ , money_type:data.money}).exec((err,count)=>{
		if(err)throw err;
		else{
			if(count==0){
				cb();
			}	
			else{
				connection.findOneAndUpdate(
					{time_:data.time_,money_type:data.money},
					{
						time_:data.time_,
						usd_value:data.usd_value,
						money_type:data.money_type
					},
					(err)=>{
						if(err)throw(err);
						cb();
					}
					)
				}
			}
		})
};

PriceModel.delete=(id,money,cb)=>{
	connection.findOneAndRemove({time_:id,money_type:money},(err)=>{
		if(err)throw(err);
		cb();
	})
};

module.exports=PriceModel;