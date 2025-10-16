// 云函数入口函数
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
exports.main = async (event, context) => {
  return data;
};
