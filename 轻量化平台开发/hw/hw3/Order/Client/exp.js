

// npm install express --save
// npm install ejs --save

var fs = require('fs');
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
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
	// console.log(req.body);
	// 前端传过来的是{id: order_id, num: order_num, cartList: cartList}, 将数据写入到order.json\
	/*
		存储的结构类似
		{
		"order_id": "1",
		"foods": [
			{
				"name": "鲜枣馍",
				"price": 12,
				"num": 2
			},
			{
				"name": "小炒菜",
				"price": 16,
				"num": 3
			}
		],
		"promotion": {
			"name": "满50减10元",
			"discount": "10"
		},
		"taken": false,
		"orderinfo": "WD100321342354351356",
		"ordertime": "2017-10-10 14:51:25",
		"ordernum": "WD100321342354351356",
		"meunnumber": "A66",
		"status": 1
	}
	*/
	// 传入的cartList有name, price, num, 现在promotion与上面的相同, taken为false
	// orderinfo 为订单号, ordertime为下单时间, ordernum为订单号, meunnumber为餐牌号, status为订单状态
	// 随机生成orderinfo, ordertime为当前时间, 随机生成ordernum, 随机生成meunnumber, status为1
	
	var order = req.body;
	console.log(order.num);
	cartList = JSON.parse(order.cartList);
	var orderinfo = "WD" + Math.floor(Math.random() * 1000000000000000000);
	var ordertime = new Date().toLocaleString();
	var ordernum = orderinfo;
	var meunnumber = "A" + Math.floor(Math.random() * 100);
	var status = 1;
	var foods = [];
	var promotion = {
		"name": "满50减10元",
		"discount": "10"
	};
	var taken = false;
	for (var i = 0; i < order.num; i++) {
		var food = {
			"name": cartList[i].name,
			"price": cartList[i].price,
			"num": cartList[i].number,
		};
		foods.push(food);
	}
	console.log(foods);
	var write_order = {
		"order_id": order.id,
		"foods": foods,
		"promotion": promotion,
		"taken": taken,
		"orderinfo": orderinfo,
		"ordertime": ordertime,
		"ordernum": ordernum,
		"meunnumber": meunnumber,
		"status": status
	};
	fs.readFile('order.json', 'utf-8', function (err, data) {
		if (err) {
			console.log(err);
		}
		else {
			var orderlist = JSON.parse(data);
			// 删除orderlist里的所有元素
			orderlist.splice(0, orderlist.length);
			orderlist.push(write_order);
			fs.writeFile('order.json', JSON.stringify(orderlist), function (err) {
				if (err) {
					console.log(err);
				}
				else {
					res.json({error:0,order_id:write_order.order_id});
				}
			});
		}
	});
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
	order_id = req.body.order_id;
	res.json({error:0,order_id:order_id})
	var summoney = 0;
	var date = '0';
	var time = '0';
	// 查看order.json, 计算总价summoney和时间ordertime, 同时时间格式为"ordertime": "2023/5/29 10:08:13"需要解析为date和time
	fs.readFile('order.json', 'utf-8', function (err, data) {
		if (err) {
			console.log(err);
		}
		else {
			var orderlist = JSON.parse(data);
			console.log(orderlist[0]);
			console.log(orderlist[0].foods);
			// 通过每个foods的price和num计算summoney, 最后减去promotion的discount
			for (var i = 0; i < orderlist[0].foods.length; i++) {
				summoney += orderlist[0].foods[i].price * orderlist[0].foods[i].num;
			}
			summoney -= orderlist[0].promotion.discount;
			// 计算时间
			var ordertime = orderlist[0].ordertime;
			date = ordertime.split(" ")[0];
			time = ordertime.split(" ")[1];
			time = time.split(":")[0] + ":" + time.split(":")[1];
		}
	});


	// 查看record.json, 获取record中的record_id的最大值, 将record_id + 1, 写入到record.json中
	fs.readFile('record.json', 'utf-8', function (err, data) {
		if (err) {
			console.log(err);
		}
		else {
			var recordlist = JSON.parse(data);
			record = recordlist.record;
			var record_id = record[record.length - 1].record_id + 1;
			var single_record = {
				"record_id": record_id,
				"summoney":  summoney,
				"date": date,
				"time": time
			};
			record.push(single_record);
			recordlist.record = record;
			fs.writeFile('record.json', JSON.stringify(recordlist), function (err) {
				if (err) {
					console.log(err);
				}
				else {
					res.json({error:0,order_id:order_id});
				}
			});
		}
	});


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
