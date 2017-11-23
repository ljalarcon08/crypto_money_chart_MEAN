'use strict'
var express=require('express');
var app=express();
var path=require('path');

var PriceModel=require('./model/price-model');
var request = require('request');
var morgan=require('morgan');
var types=['ETH','BTC','DASH'];
var chartjson=require('./public/chart.json');
var fs=require('fs');
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));


//pagina
app.get('/',(req,res,next)=>{
	res.sendFile("./public/index.html");
});

//permite a angular obtener json con datos del grafico
app.get('/type/:type',(req,res,next)=>{
	var type=req.params.type;
			PriceModel.getAllByType(type,(rows)=>{
		 		var chart_json=chart(rows,type);
		 		res.json(chart_json);
		});
})

//obtiene los datos de 1 minuto
function getUsdOfType(type){
	var date = new Date();
	request.get('https://min-api.cryptocompare.com/data/histominute?fsym='+type+'&tsym=USD&limit=1&aggregate=1&e=CCCAGG',
		(error, response,body) =>{
	  if (!error && response.statusCode == 200) {
	  		var json_=JSON.parse(body);
	  		var usds=[];
	  		for(var i in json_.Data){
	  			var utc=json_.Data[i].time;
	  			var d=new Date(0);
	  			var gtm=d.setUTCSeconds(utc);
	  			gtm=d.toLocaleString("es-CL", {timeZone: "America/Santiago"});
		  		var usd={
					time_:gtm,
					close:json_.Data[i].close,
					high:json_.Data[i].high,
					low:json_.Data[i].low,
					open:json_.Data[i].open,
					volumefrom:json_.Data[i].volumefrom,
					volumeto:json_.Data[i].volumeto,
					money_type:type
		  		};
		  		usds[i]=usd;
		  		PriceModel.insert(usd,(err)=>{
		  			if(err)console.log(err);
		  		});
	  		}
	  }
	  else{
	  	console.log(error);
	  }
	});
}

setInterval(()=>{
	for(var i in types){
		getUsdOfType(types[i]);
	}
},60000);



//crea json con datos
function chart(rows,type){
	var serie=JSON.parse(fs.readFileSync(__dirname+'/public/serie.json', 'utf8'));
	serie.data=[];
	for(var i in rows){
		var arr=[];
		var tim=Date.parse(rows[i].time_);
		var tim=tim-10800000;
		arr[0]=tim;
		arr[1]=parseFloat(rows[i].open);
		arr[2]=parseFloat(rows[i].high);
		arr[3]=parseFloat(rows[i].low);
		arr[4]=parseFloat(rows[i].close);
		serie.data[i]=arr;
	}
	if(type=='BTC')serie.title='Precio de Bitcoin en U$';
	if(type=='ETH')serie.title='Precio de Etherium en U$';
	if(type=='DASH')serie.title='Precio de DASH en U$';
	return serie;
}

//revisa si existen datos en la base
function checkData(){
		PriceModel.countAll((count)=>{
 		if(count<60){
 			for(var i in types){
				initialData(types[i]);
			}
 		}
	});
}

//obtiene los datos de los ultimos 60 minutos
function initialData(type){
	var date = new Date();
	request.get('https://min-api.cryptocompare.com/data/histominute?fsym='+type+'&tsym=USD&limit=60&aggregate=1&e=CCCAGG',
		(error, response,body) =>{
	  if (!error && response.statusCode == 200) {
	  		var json_=JSON.parse(body);
	  		var usds=[];
	  		for(var i in json_.Data){
	  			var utc=json_.Data[i].time;
	  			var d=new Date(0);
	  			var gtm=d.setUTCSeconds(utc);
	  			gtm=d.toLocaleString("es-CL", {timeZone: "America/Santiago"});
		  		var usd={
					time_:gtm,
					close:json_.Data[i].close,
					high:json_.Data[i].high,
					low:json_.Data[i].low,
					open:json_.Data[i].open,
					volumefrom:json_.Data[i].volumefrom,
					volumeto:json_.Data[i].volumeto,
					money_type:type
		  		};
		  		usds[i]=usd;
		  		PriceModel.insert(usd,(err)=>{
		  			if(err)console.log(err);
		  		});
	  		}
	  }
	  else{
	  	throw error;
	  }
	});
}

io.on('connection',(socket)=>{
	var type='ETH';
	//console.log('!!');
	socket.on('act_type',(data)=>{
		//console.log('TYPE:');
		//console.log(data);
		type=data;
		setInterval(()=>{
			//console.log(type);
			PriceModel.getAllByType(type,(rows)=>{
		 		var chart_json=chart(rows,type);
				socket.emit('update',chart_json);
			});
		},30000);
		/*PriceModel.getAllByType(type,(rows)=>{
		 	var chart_json=chart(rows,type);
			socket.emit('update',chart_json);
		});*/
	});
});

server.listen(3000,()=>{
	//carga inicial
	checkData();
});