# 订单系统bug 修复

## 1

### 问题

在订单页面，选择商品之后选择“洗好了”跳转至结账页面，其中商品内容未更新

### 解决

前端的`goBalance`函数并没有将购物车里的物品传输给后端，此处将`order_id, order_num, cartList`封装为`sendData`的JSON后POST给后端

```javascript
// 点击"选好了"，缓存购物车的值
  goBalance: function(e) {
    if (this.data.sumMonney == 0) {
      return
    }
    // 请求接口返回参数{error: 0（错误代码）, order_id: 1}}
    var order_id = this.data.order_id
    var order_num = this.data.cupNumber
    var cartList = this.data.cartList
    // 将cartList转为json字符串
    cartList = JSON.stringify(cartList)
    var method = "POST"
    var sendData = JSON.stringify({
      id: order_id,
      num: order_num,
      cartList: cartList
    })
    console.log(sendData)
    fetch("food/order", sendData, method).then(function(res) {
      if (res.data.error !== 0) {
        wx.showModal({
          title: '下单失败',
          content: '操作失败请重试',
        })
        return
      }
      // 请求成功后跳转到订单确认页面，把返回的order_id订单编号传过去
      wx.navigateTo({
        url: '../order/balance/balance?order_id=' + res.data.order_id
      })
    })
  }
```

后端处理前端的POST请求，处理好写入`order.json`

```javascript
//订单请求post
app.post("/api/food/order",function(req,res){
	// 前端传过来的是{id: order_id, num: order_num, cartList: cartList}, 将数据写入到order.json
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
```

现在可以正常显示了

## 2

### 问题

在结账页面，支付完之后，点击我的页面，没最新的一笔账单

### 解决

后端的`支付post请求`并没有写完整，将数据处理好后存到record.json中

```javascript
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
```

