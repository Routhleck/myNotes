const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

// 处理POST请求
app.post('/', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})

var data = {
  name: '张三',
  gender: [
    { name: '男', value: '0', checked: true },
    { name: '女', value: '1', checked: false }
  ],
  skills: [
    { name: 'HTML', value: 'html', checked: true },
    { name: 'CSS', value: 'css', checked: true },
    { name: 'JavaScript', value: 'js', checked: false },
    { name: 'Photoshop', value: 'ps', checked: false },
  ],
  opinion: '测试'
}

// 处理GET请求
app.get('/', (req, res) => {
  res.json(data)
})

// 监听3000端口
app.listen(3000, () => {
  console.log('server running at http://127.0.0.1:3000')
})
