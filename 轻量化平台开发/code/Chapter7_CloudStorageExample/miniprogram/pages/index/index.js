const db = wx.cloud.database();
const skills = db.collection('skills');
let tempFilePath = "";

Page({
  data: {
  },

  onLoad: function (options) {
    skills.get({
      success: res => {
        console.log(res)
        this.setData(res.data[0])
      },
      fail: res => {
        console.log(res);
      }
    })
  },

  uploadFile: function () {
    var thisBlock = this; // this指针问题，success函数实际是一个闭包，无法直接使用this.setdata
    wx.chooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        tempFilePath = res?.tempFiles?.[0].tempFilePath;
        thisBlock.setData({ fileId: tempFilePath });
        wx.showToast({
          title: '添加成功',
        })
      },
      fail: error => {
        wx.showToast({
          title: '添加失败'
        })
      }
    })
  },

  submit: function (e) {
    this.data.name = e.detail.value.name;
    this.data.gender.forEach(element => {
      if (element.value == e.detail.value.gender) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
    this.data.skills.forEach(element => {
      if (e.detail.value.skills.indexOf(element.value) !== -1) {
        element.checked = true;
      }
      else {
        element.checked = false;
      }
    });
    this.data.opinion = e.detail.value.opinion;
    if (tempFilePath) {
      //如果用户选择了照片，上传图片后，再保存
      const fileName = this.data._id + "." + tempFilePath.split('.').pop();
      wx.cloud.uploadFile({
        cloudPath: fileName, // 上传至云端的文件名
        filePath: tempFilePath, // 小程序临时文件路径
        success: res => {
          this.saveDataToDb(res.fileID);
        },
        fail: e => {
          console.log(e)
        }
      })
    } else {
      this.saveDataToDb("")
    }
  },

  saveDataToDb: function (fileId) {
    skills.doc(this.data._id).update({
      data: {
        name: this.data.name,
        gender: this.data.gender,
        skills: this.data.skills,
        opinion: this.data.opinion,
        fileID: fileId
      },
      success: function (res) {
        wx.showToast({
          title: '提交成功',
        })
        console.log(res.data)
      }
    })
  }
})