

// npm install express --save
// npm install ejs --save

var fs = require('fs');
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

//get请求首页信息
app.get('/api/food/index',function (req,res) {
    console.log(req.query);
	fs.readFile('index.json', 'utf-8', function (err, data) {
	    if (err) {
	        console.log(err);
	    } else {
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
	        //res.end(data);
	        res.end(data);
	    }
	});
});

//get请求菜单列表
app.get('/api/food/list',function (req,res) {
    console.log(req.query);
	fs.readFile('list.json', 'utf-8', function (err, data) {
	    if (err) {
	        console.log(err);
	    } else {
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
	        //res.end(data);
	        res.end(data);
	    }
	});
});
//get请求订单列表
app.get('/api/food/orderlist',function (req,res) {
    console.log(req.query);

	var filename = 'orderlist-0.json';

   if (req.query.last_id === "10")  {
    	// 10 : 11~20
		filename = 'orderlist-10.json';

    }else if (req.query.last_id === "20")  {
    	// 20: 21~30
		filename = 'orderlist-20.json';

    }

	fs.readFile(filename, 'utf-8', function (err, data) {
	    if (err) {
	        console.log(err);
	    } else {
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
	        //res.end(data);
	        res.end(JSON.stringify(JSON.parse(data)));
	    }
	});
});



//订单请求post
app.post("/api/food/order",function(req,res){
	// 前端传过来的是{id: order_id, num: order_num}, 进行处理
	var order = req.body;
	
	console.log(order);
});




app.get("/api/food/order",function(req,res){
   fs.readFile('order.json', 'utf-8', function (err, data) {
	    if (err) {
	        console.log(err);
	    } else {
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
	        //res.end(data);
	        res.end(JSON.stringify(JSON.parse(data)[0]));
	        // 因为搭建服务器比较麻烦，这里采用模拟数据
	    }
	});
});


//支付post请求
app.post("/api/food/pay",function(req,res){
   res.json({error:0,order_id:3})
});

//get请求消费记录
app.get('/api/food/record',function (req,res) {
    console.log(req.query);
	fs.readFile('record.json', 'utf-8', function (err, data) {
	    if (err) {
	        console.log(err);
	    } else {
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
	        //res.end(data);
	        res.end(data);
	    }
	});
});

app.listen(8081);    



/*

//模板引擎
app.set("view engine","ejs");

app.get("/",function(req,res){
     res.render("form");
});
/*
//bodyParser API
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/",function(req,res){
    console.log(req.body);
});

*/
