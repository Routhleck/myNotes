## 1. 什么是计算机图形学，它的主要研究内容有哪些?

计算机图形学是利用计算机研究图形的表示、生成、处理、显示的学科

如何在计算机中表示图形、以及利用计算机进行图形的计算、处理和显示，构成了计算机图形学的主要研究内容。

## 2. 请写出计算机图形学的主要应用领域（不少于5个），并选择一个应用领域谈谈你的理解。

影视，游戏，军事，科研仿真，增强显示

在影视制作中，通过三维建模、动画制作、特效合成等技术手段，可以创造出逼真的虚拟场景和角色，实现人物、物体、场景的数字化再现这些数字化的元素可以被加入到实景中，与真实拍摄的画面融合在一起，使得电影、电视剧等媒体的画面效果更加生动、震撼。

## 3. 虚拟现实与增强现实有什么区别，谈谈你的理解。

虚拟现实是利用电脑模拟产生一个三维空间的虚拟世界，提供用户关于视觉等感官的模拟，让用户感觉仿佛身历其境，可以即时、没有限制地观察三维空间内的事物。

而增强现实是透过摄影机影像的位置及角度精算并加上图像分析技术，让屏幕上的虚拟世界能够与现实世界场景进行结合与交互的技术。

总而言之虚拟现实是建立在虚拟世界之上的，而增强显示是建立在现实世界之上的。

## 4. 图形学之父是？请至少列举出3位他的学生，及他们各自对于图形学领域的主要贡献。

图形学之父是I. E. Sutherland

他的学生：

- Bob Sproull, 虚拟现实的发明人，第一本图形学教科书，美国工程院院士、美国艺术与科学院院士。
- Danny Cohen, 发明Cohen-Sutherland算法，美国工程院院士，在ARPANet上开发飞行模拟器。
- Alan Kay, 发明面向对象编程、窗口图形用户界面美国工程院院士、美国艺术与科学院院士，图灵奖获得者。 
- Edwin Catmull, 细分算法发明人，Z-buffer算法发明人，Coons奖，Oscar 奖，Pixar 动画，Disney动画的现任总裁
- HenriGouraud, Gouraud shading的发明人
- Frank Crow, 图形反走样算法的发明人

## 5. 二维空间中的线性变换的定义

**线性变换保持向量加法和标量乘法不变**

满足**可加性和齐次性**

设 ![V](https://wikimedia.org/api/rest_v1/media/math/render/svg/af0f6064540e84211d0ffe4dac72098adfa52845) 和 ![W](https://wikimedia.org/api/rest_v1/media/math/render/svg/54a9c4c547f4d6111f81946cad242b18298d70b7) 都是在域 ![K](https://wikimedia.org/api/rest_v1/media/math/render/svg/2b76fce82a62ed5461908f0dc8f037de4e3686b0) 上定义的向量空间，若函数![f:V\rightarrow W](https://wikimedia.org/api/rest_v1/media/math/render/svg/bd5c7a685c03396db375d098221baa9b71d76fd3) 对任二向量 ![{\displaystyle x,\,y\in V}](https://wikimedia.org/api/rest_v1/media/math/render/svg/606a0f63a925c9ba3283882d0134bd0f10dc958f) 与任何标量 ![{\displaystyle a\in K}](https://wikimedia.org/api/rest_v1/media/math/render/svg/f97d838bfcfb39f7a33ffe31cd1c2a989b8ca3f6)，满足：

可加性：  ![{\displaystyle f(x+y)=f(x)+f(y)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/11e072f8427aa606b95bad4d8fba9cb3da2c0b09)

齐次性:  ![{\displaystyle f(a\cdot x)=a\cdot f(x)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/2eeea715d963c53b5db41eeadb16f2b1ef61087d)

则![f](https://wikimedia.org/api/rest_v1/media/math/render/svg/132e57acb643253e7810ee9702d9581f159a1c61) 被称为是**线性映射**。