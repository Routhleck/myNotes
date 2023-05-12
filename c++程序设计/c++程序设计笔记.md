[TOC]



# 课程结构

<img src="D:\Typora_CACHE\image-20220903101707898.png" alt="image-20220903101707898" style="zoom: 18%;" />

<img src="D:\Typora_CACHE\image-20220903101758734.png" alt="image-20220903101758734" style="zoom: 18%;" />

<img src="D:\Typora_CACHE\image-20221022115512345.png" alt="image-20221022115512345" style="zoom:50%;" />

<img src="D:\Typora_CACHE\image-20221022115535685.png" alt="image-20221022115535685" style="zoom:50%;" />

<img src="D:\Typora_CACHE\image-20221022115845142.png" alt="image-20221022115845142" style="zoom:50%;" />

# 1. C++基本概念

**高内聚低耦合**

## C++程序编译过程

<img src="D:\Typora_CACHE\image-20221126024409245.png" alt="image-20221126024409245" style="zoom:50%;" />

## 对象：

使用类生成的实例

## 类：

用户定义的一个数据类型

## 抽象：

对象只暴露必要的外部信息，将复杂的内部细节和背景信息隐藏在对象内部

## 封装：

将相关联的数据和函数绑定在同一实体中，保证数据安全

## 继承：

对类的功能进行拓展，有效实现代码复用，使代码结构更清晰移动
是重要多态性的实现方式之一

## 多态：

在类等级的不同层次中可以共享一个行为的名字，不同层级每个类按自己的需求来实现

## 如何评价

<img src="D:\Typora_CACHE\image-20220903113519118.png" alt="image-20220903113519118" style="zoom:67%;" />

<img src="D:\Typora_CACHE\image-20220903115839135.png" alt="image-20220903115839135" style="zoom:80%;" />

# 2. 初识C++程序

## 2.1 环境配置

编译器：g++(gcc)、 clang++（clang）、msvc

## 2.2 C++基本代码结构

C++注释：

1. 不嵌套使用注释
2. 对接口函数、难理解代码进行注释
3. 临时或需优化逻辑使用TODO(yourself)注释标记
4. 不使用的代码直接删除，不要注释

预处理器编译指令#include：
引入系统库或自定义头文件，在预处理阶段会被覆盖替换

包含C++标准库时不写.h扩展名
#include <iostream.h> // 错误
包含自定义头文件时要写扩展名
#include “myheader.h”
包含C语言标准头文件时有两种写法
#include <cmath>
#include <math.h>

**C++的基本单元：语句**
每一条语句必须以分号作为结束标识，不可省略

**函数结构：**
函数名、函数头、函数定义、函数体、结束函数

## 2.3 main函数

C++函数和C中函数主要区别体现在两点：默认参数和函数重载

1、一个函数可以包含多个默认参数
2、如果一个参数包含默认值，那么该参数之后的所有参数都必须包含默认值
3、在同一个作用域内，可以声明几个功能类似的同名函数，但是这些同名函数的形式参数（指参数的个数、类型或者顺序）必须不同。编译器能够根据调用过程的不同参数类型决定具体的调用函数

**慎用函数默认参数与函数重载**

1. main函数可接受外部参数，本节以无参数main为例
   无参版本：int main(void);    有参版本：int main(int argc, char* argv[]);
2. main函数须返回int值，不应返回空
   void main() // 错误
3. main函数末尾无返回语句隐含return 0;
4. 特殊场景下主函数名不为main，实际存在隐含main

## 2.4 标准输入输出

- cout支持多个流插入符连续插入
- cout默认支持int/float/doule等内置类型重载，也支持string

**std::endl**有两个功能：

1. 相当于换行符’\n’
2. flush输出缓存，保证打印输出数据

<img src="D:\Typora_CACHE\image-20220924103148969.png" alt="image-20220924103148969" style="zoom:50%;" />

<img src="D:\Typora_CACHE\image-20220924103209276.png" alt="image-20220924103209276" style="zoom:50%;" />

C++中简单类型如int/float/double等在定义时一定要手动初始化

尽量不要用using namespace的方式，团队开发时容易造成明明冲突，也不利于代码阅读。

如果必须使用using namespace时（多个命名空间嵌套较深），**不要将using namespace语句放入头文件中**

# 3. C++数值、变量、关键字

C++是一种静态语言

C++变量初始语法：

- C语言初始化语法
- 小括号参数初始化语法
- 列表初始化语法

**若没有定初值，变量被默认初始化：**

- 全局变量为0
- 局部变量不被初始化（函数存在在stack中，全局变量在data中）

extern关键字，从别的模块获得局部变量

## 3.4 指针

&取地址、*解地址

动态内存分配 new delete 

不用NULL，指针使用nullptr

**引用&**

不是一个对象，引用不能定义引用的引用

## 3.5 数组

定义同时初始化 e.g.int data1[4] = {1,2,3,4};
定义 int data2[4];

## 3.6 vector

## 3.7 结构体

字节补充
#pragma pack（n）制定对齐位数

## 3.8 共用体

union 常用于节省内存

## 3.9 枚举

enum 定义符号常量的方式，从0开始自增

## 3.10 const关键字

描述不可修改的变量，声明时初始化

## 3.11 类型转换

# 4. 函数

## 4.1 内联函数

定义在header中

## 4.2 引用参数

& 避免传参数据拷贝，修改后实参也会改变

左值 lvalue 能够取内存地址，不能移动的值

右值 rvalue 表达式的中间结果，函数返回值

**const引用参数可以接受右值**，给函数传递右值参数后，编译器自动生成了一个临时左值变量作为函数参数额

左值引用&

右值引用&&

常值引用 const type&

**右值引用能够避免参数拷贝，提高执行效率**
std::move()将左值转换为右值

## 4.3 函数默认参数

必须全部设为默认参数

只允许在声明中出现

必须从左往右写，不允许跳过

## 4.4 函数重载

静态多态性的体现

慎用，可以尝试自定义数据结构作为函数参数，避免定义多种重载函数

## 4.5 函数的内存模型

栈帧是指为一个函数调用单独分配的那部分栈空间

ebp帧指针指向底部
esp栈指针指向顶部

# 5. 类

## 面向对象

**成员变量**一般在后加下划线 _ 或前加字符_
**成员函数**会用c的方式(以下划线分割)

C++中class和struct大括号要加分号
因为需要大量定义后就声明

无特殊理由，class的成员变量不设计为public访问

函数作为接口来读写可以继续在函数中实现一些功能（如给多线程加锁）

**成员函数可以直接访问成员变量**

**const**成员变量在初始化后不允许修改
**const**成员函数不允许修改一般成员变量
mutable修饰的变量在const成员函数中仍可被修改

class默认访问权限和继承时默认访问权限是private，struct为public	

## 特殊成员函数

### 构造函数

- 与类名相同
- 无返回值
- 初始化
- 支持重载

**私有构造函数-工厂模式**

存在默认构造函数可以直接初始化，也可以使用{}列表初始化

方法1： 参数初始化列表

```c++
People::People(int age, int height)
    :age_(age), height_(height){
        
    }
```

**必须使用初始值列表的应用场景：**

- const成员变量初始化
- 引用成员变量初始化
- 对象成员变量初始化

**初始值列表的初始化顺序：**

- 初始化列表仅说明用于初始化成员的值，不限定具体的执行顺序
- 

**explicit关键字显式抑制**

### 析构函数

- ~类名
- 对象销毁时自动调用
- 不接受任何参数
- 没有重载

销毁

### 静态成员

- 需要定义
- 无需static关键字
- 静态成员函数无法访问非静态成员
- 静态成员变量允许出现不完整类型（**只有声明没有定义的类型**）

### this指针

**普通成员函数**可以通过this关键字获取当前对象的指针

# 6. 运算符重载与友元

## 6.1 运算符重载

通过运算符重载实现自定义类型的计算

```c++
returnType operatorOP(arg list); //OP为重载的运算符

//运算符重载示例
operator+(...)
operator*(...)
    
// cargo.h
class Cargo {
public:
  Cargo(int c, int  b, int m)
  : car_(c), bike_(b), motor(m) {}
  Cargo operator+(const Cargo& c) const;
private:
  int car_;
  int bike_;
  int motor_;
};

Cargo Cargo::operator+(const Cargo& c) const {
  Cargo ret(0, 0, 0);
  ret.bike_ = this->bike_ + c.bike_;
  ret.motor = this->motor_ + c.motor_;
  ret.car = this->car_ + c.car_;
  return ret;
}

// main.cc

Cargo c1(10, 2, 1);
Cargo c2(1, 12, 9);

// + 运算符重载
Cargo c3 = c1 + c2;

c1 = c2 + c3;
c2 = c2 + c2 + c1;
```

运算符重载也可以显式调用

**运算符重载的限定条件：**

- 有些运算符是不可重载的
- 重载运算符不能改变运算符的使用方式
- 不能改变运算顺序

运算符重载的两种方式：

- 成员函数重载
- 非成员函数重载（友元函数）
  **即使不是友元，对于全局变量、结构体等等仍可以使用**

c++ 流运算符只支持成员函数重载

**常用运算符重载场景：**

- 自定义容器类根据下标访问元素
  operator[] (...)
- 仿函数(functor)
  operator()(...)

## 6.2 友元

### 6.2.1 友元函数

友元函数不是类的成员函数，而是独立于类的**外部函数**。能够通过友元函数**访问类中的所有成员变量和成员函数**。
友元函数无法访问this指针
永远是public
参数中通常包含当前对象（指针、引用）

### 6.2.2 友元类

该类的成员函数将可以访问目标类的所有成员变量

- 友元类的所有成员函数都可以访问目标类的所有成员
- 友元类的关系是单向的
- 友元类的关系不具备传递性
- 友元关系不能被继承

### 6.2.3 友元的使用场景

- 单元测试
- 降低代码复杂度
- 运算符重载
- 友元工厂

### 6.2.4 类相关类型转换

通过**构造函数**实现隐式类型转换

构造函数只有在不产生歧义的时候才能进行隐式类型转换

内置类型 -> 自定义类型：构造函数
自定义类型 -> 内置类型：重载运算符
自定义类型 -> 自定义类型：构造函数/重载运算符

### C++函数和一等公民

- 函数指针
- 仿函数
- std::function

```c++
// std::function
struct Functor{
	int operator()(int i) {return i * i;}
} functor;

void estimate(std::function<int(int)> func);

estimate(functor)
```

# 7. 类的拷贝控制

## 7.1 拷贝构造函数

当类具有不能拷贝、赋值或析构的成员时，类的合成拷贝函数是删除(=delete)的，删除函数意味着被声明但不可使用。

**类包含指针时，需要自定义类**

### 函数原型

```c++
//常见构造函数原型
className(const className& obj);
```

**必须有&引用，否则递归拷贝**

### 调用场景

```c++
//拷贝构造函数的调用场景
StringBad s1;

StringBad s2(s1);
StringBad s3 = s1;
StringBad s4 = 
```

2 当函数参数为自定义类型的值传递时

```c++
void Print(StringBad s);

StringBad s1;
Print(s1); //发生拷贝
Print(StringBad()); //不发生拷贝
```

3 某些情况下编译器出现临时变量

### 浅拷贝

**浅拷贝会调用默认构造函数，共享数据**
会出现指针悬挂的问题

### 深拷贝

深拷贝需要自己动态申请内存，并进行内存拷贝

## 7.2 拷贝赋值函数

与拷贝构造函数的方式类似，都需要重新申请内存
区别在于 **重载赋值操作符需要释放原有内存，否则会出现内存泄漏**
返回自身引用

**为防止自赋值需要在最开始判断（判断会进行分支预测，需要记录原指针或copy and swap策略）**

```c++
//stringbad.cc
StringBad& StringBad::operator=(const StringBad& s) {
	len_ = s.len_;
	char* temp = str_; //记录原指针
	str_ = new char[s.len_ + 1]; //重新申请内存
	strcpy(str_, s.str_); //拷贝指针指向内容
	delete[] temp; //释放原有内存
	return *this; //返回自身引用
}

StringBad& StringBad::operator=(StringBad s) {
	len_ = s.len_;
    // copy-and-swap策略，传值调用拷贝构造函数
    char* tmp = str_;
	str_ = s.str_; //交换指针,资源释放及哦啊给析构处理
    s.str_ = tmp;
	return *this; //返回自身引用
}

StringBad& StringBad::operator=(StringBad s){
    swap(*this, s);
    return *this; //返回自身引用
}
void swap(StringBad& s1, StringBad& s2) { //友元函数
    using std::swap;
    swap(s1.len_, s2.len_); //不能直接写std::swap
    swap(s1.str_, s2.str_); //不加限定的swap函数可进行最优匹配
}
```

**c++连续赋值运算满足右结合律**，可以通过括号改变结合顺序

**new和delete操作必须一致**, 如果new [], 析构时也必须delete[]

> 针对简单类型 使用new分配后的不管是数组还是非数组形式内存空间用两种方式均可
>
> 针对类Class，两种方式体现出具体差异
>
> 关键在于调用析构函数上。此程序的类没有使用操作系统的系统资源（比如：`Socket、File、Thread`等），所以不会造成明显恶果。**如果你的类使用了操作系统资源，单纯把类的对象从内存中删除是不妥当的，因为没有调用对象的析构函数会导致系统资源不被释放**，如果是 Socket 则会造成 Socket 资源不被释放，最明显的就是端口号不被释放，系统最大的端口号是 65535 (216 _ 1，因为还有0)，如果端口号被占用了，你就不能上网了，呵呵。如果 File 资源不被释放，你就永远不能修改这个文件，甚至不能读这个文件(除非注销或重启系统)。如果线程不被释放，这它总在后台运行，浪费内存和 CPU 资源。这些资源的释放必须依靠这些类的析构函数。所以，在用这些类生成对象数组的时候，用 `delete[]` 来释放它们才是王道。

## 7.3 移动构造函数

移动构造函数实现移动语义，直接将对象资源控制权进行转移
注意：**移动后需保证来源对象可以正常析构**

```c++
// stringbad.cpp
StringBad::StringBad(StringBad&& s):len_(s.len_), str_(s.str_) {
	s.str_ = nullptr 
}
```

## 7.4 移动赋值函数

```c++
// stringbad.cpp
StringBad& StringBad::operator=(StringBad&& s) {
	if(this == &s) {return *this;} //处理自赋值
	len_ = s.len_;
	delete[] str_; //先释放原有内存
	str_ = s.str_; //接管s资源
	s.str_ = nullptr;
	return *this; //返回自身引用
};

// copy-and-swap策略
StringBad::operator=(StringBad s) { //生成值会调用相应左/右值版本
    swap(*this, s);
    return *this;
};

StringBad::StringBad(const StringBad& s) ...
StringBad::StringBad(StringBad&& s) ...
```

# 8. 类的继承

## 8.1 什么是继承

继承是C++面向对象的重要特性，继承允许用户在原始类的基础上构建新类。通过继承，开发者能够实现**代码/功能复用，以及多态**

```c++
class 派生类名 : 访问限定符  基类名 {};

```

三种继承

> public 公有继承
> private 私有继承
> protected 保护继承

|          | public    | protected | private |
| -------- | --------- | --------- | ------- |
| 公有继承 | public    | protected | 不可见  |
| 私有继承 | private   | private   | 不可见  |
| 保护继承 | protected | protected | 不可见  |

函数覆盖(overriding)和函数重载(overloading)
函数覆盖：

- 发生在派生过程中
- 函数签名相同会隐藏基类的函数
- 派生类的 **同名函数（非同签名）**也会覆盖

函数重载：

- 函数签名不同（函数名相同，参数不同）
- 同一个类中的多个同名函数可以重载

函数覆盖的优先级高于函数重载，所以基类里的所有同名函数都会被隐藏
派生类中可以通过 **基类名::函数名** 的方式调用被覆盖的基类函数

## 8.2 派生对象的创建和销毁

派生类对象的内存结构：

<img src="D:\Typora_CACHE\image-20221112104617289.png" alt="image-20221112104617289" style="zoom:50%;" />

派生类的初始化流程：

<img src="D:\Typora_CACHE\image-20221112104655508.png" alt="image-20221112104655508" style="zoom:50%;" />

**在派生类构造函数的初始化列表中直接调用基类的构造函数**

在派生类构造函数的初始化列表中，基类构造函数一定要**放在最前面**

如果派生类构造函数列表里没有基类构造函数，则调用基类的默认构造函数（如果基类不存在默认构造函数，编译错误）

- 派生对象的销毁过程与创建正好相反：先销毁派生类新添加的成员，再销毁基类的成员
- 派生对象析构时先调用派生类的析构函数，再自动调用基类的析构函数，无需人工干预
- 派生类的析构函数只需要释放派生类新增的资源，基类申请的资源由基类的析构函数自动释放

## 8.3 派生类的使用

派生类是基类的功能扩展，它和基类的联系不仅仅体现在代码复用层面，更重要的是体现在多态性方面

- 派生类的地址能够赋值给指向基类的指针
- 派生类能够初始化基类类型的引用

```c++
RatedPlayer player (100, “john”, “cart”, false);

TableTennisPlayer* p = &player;	// 基类指针赋值
TableTennisPlayer& r = player;	// 基类引用初始化

p->Name();			// 基类Name函数
r.Name();				// 基类Name函数
r.Rating();			// 错误
```

我们把这种特性称为基类和派生类的**引用兼容性**

- 引用兼容性是**单向的**，派生类型的指针或者引用不允许指向基类对象
- 引用兼容性**只对公有继承有效**，私有继承和保护继承是无效的

引用兼容性的使用场景：

- **基类指针作为函数参数参数，统一函数接口**

  ```c++
  void SetTable(TableTennisPlayer& player, bool isTrue) {
      player.ResetTable(isTrue);
  }
  
  TableTennisPlayer player1(“Jack”, “Sparrow”, false);
  RatedPlayer player2(100,“Mac”, “donna”, true);
  
  SetTable(player1, true);	// 基类引用参数传递
  SetTable(player2, false);	// 基类引用参数传递
  ```

- **用派生类对象初始化基类对象**

  ```c++
  class TableTennisPlayer {
  public:
      TableTennisPlayer(const TableTennisPlayer& tp);
  };
  
  RatedPlayer player1(212, “Jane”, “Eyre”, false);	// 派生类对象
  TableTennisPlayer player2(player1);	// 用派生类对象初始化基类对象
  ```

## 8.4 公有继承

适用范围：

- 我们也可以将基类和派生类的关系描述为is-a-kind-of关系，因为派生类通常是会在基类的基础上添加新功能（属性）
- 公有继承并不能表征**全部**is-a关系
- 公有继承不适用于描述is-like-a关系
- 公有继承不适用于描述is-implemented-as关系
- 公有继承不适用于描述use-a关系

# 9. 多态

## 9.1 概念与使用场景

### 9.1.1 概念

**静态多态**
编译时多态，包含函数重载、模板

**动态多态**
运行时多态，公有继承和虚函数

多态：调用相同的函数，根据对象类型的不同产生不同的行为

### 9.1.2 使用场景

方法1：
不同多态性，直接调用参数控制函数引用

方法2：
利用共有继承类的多态性

<img src="D:\Typora_CACHE\image-20221112102800949.png" alt="image-20221112102800949" style="zoom:50%;" />

<img src="D:\Typora_CACHE\image-20221112103003136.png" alt="image-20221112103003136" style="zoom:50%;" />

公有继承实现多态性的三个条件：

- 在派生类中重新定义需要实现多态性的成员函数
- 将这些实现多态性的函数定义为虚函数(virtual)
- 使用**基类**的**指针**或者**引用**调用这些虚函数

<img src="D:\Typora_CACHE\image-20221112103702454.png" alt="image-20221112103702454" style="zoom:50%;" />

## 9.2 虚函数与动态绑定

Virtual关键字实现

C++编译器通过 **虚函数表**来实现动态绑定

### 9.2.1 动态绑定原理

<img src="D:\Typora_CACHE\image-20221112105743971.png" alt="image-20221112105743971" style="zoom:25%;" />

https://zhuanlan.zhihu.com/p/216258189

### 9.2.2 override和final关键字

override关键字显式声明该函数重写基类的虚函数，而非新定义的函数

<img src="D:\Typora_CACHE\image-20221112113502475.png" alt="image-20221112113502475" style="zoom:50%;" />

final关键字告知编译器...
也可以声明该类型不能够被继承

### 9.2.3 虚函数特性

<img src="D:\Typora_CACHE\image-20221112113739304.png" alt="image-20221112113739304" style="zoom:50%;" />

## 9.3 纯虚函数与虚基类

C++允许基类中的虚函数只有声明而无需定义函数逻辑，纯虚函数的声明方式为在函数末尾添加=0

包含纯虚函数的类为虚基类，虚基类只能作为抽象接口（类似interface）使用，无法实例化对象

# 10. 代码复用

## 10.1 组合与继承

需要复用部分功能性代码时：

- 继承：构建功能向导的基类，在此基础上构建攀升体系
- 组合：将不同模块...

迭代器一般用 **auto关键字**

**多数情况组合更适用**

> 继承联系表格

### 多继承

有两个以上的父类

多继承和菱形继承
问题1：出现菱形继承时...

虚继承使用 **virtual关键字**

# 11. IO

## 11.1 文件输入输出

输出流ofstream
输入流ifstream

> 使用前#include <fstream>
> 输出流 ofstream
> 输入流 ifstream
> 输入输出流 fstream

```c++
#include <iostream>
#include <fstream>
using namespace std;
int main() {
    char fname[20];
    cout <<“input the file name: ” << endl;
    cin >> fname; //读取文件名
    ofstream ofs(fname); //打开文件
    string line;
    cout <<“input the file content” << endl;
    getline(cin,line); //读取写入内容
    ofs << line; //写入文件
}
```



# 12. 模板

实现**数据类型和业务逻辑解耦合**的技术，允许我们针对“通用”类型进行开发

## 12.1 模板函数

```c++
template <class T>
template <typename T, class U>
```

既可以用class也可以用typename
class主要的应用是定义类
typename关键字除了定义模板参数外，主要作用是声明关键字后面的符号是一个类型名称，避免编译器混淆（此时不可使用class关键字）

**自己主导开发推荐采用typename关键字**

```c++
template <typename T>
void swap(T &v1, T &v2) {
	T tmp = v1;
	v1 = v2;
	v2 = tmp;
}
```

除定义类型参数外，还可在模板中定义非类型参数，此时通过类型名指定

模板函数的调用过程和普通函数没有区别
**注意：函数调用参数类型应该和模板类型保持一致**

## 12.2 模板实例化

模板实例化不存在类型转换，编译器会严格根据调用参数类型实例化模板，要做到调用参数类型与模板参数匹配
无法 **隐式类型转换**

编译器无法推断模板参数类型，允许用户指定类型。对于模板参数已经显示指定的实参，可以支持类型转换

```
template <typename T1, typename T2, typename T3>
T1 sum(T2 left, T3 right) {
	return static_cast<T1>(left + right);
}

int a = 1;
double b = 2.0;
long long c = sum<long long>(a,b);
```

### 控制实例化

**根据调用函数的参数实例化，所以模板函数通常在.h头文件例定义而非cc源文件**

将模板定义写入头文件虽然比较轻便，但也存在一个明显的劣势：在不同编译单元中同一个模板可能多次实例化，会极大地延长编译时间
为了解决这个问题，我们可以通过技术将模板的声明和定义分离 **显式模板实例化**

```c++
// swap.h
template <typename T>
void swap(T &a, T&b); //模板声明

// sawp.cc
template <typename T> //模板定义
void swap(T &a, T &b) {
	T tmp = a;
	a = b;
	b = tmp;
}
template void swap<int>(int&, int&);			//显式实例化
template void swap<float>(float&, float&);		//显式实例化
template void swap<double>(double&, double&);	//显式实例化
```

## 12.3 模板类

利用模板类定义对象时

## 12.4 模板特化与偏特化

### 模板特化

模板特化函数的定义方式和普通模板函数类似,都需要template关键字, 但是 **特化模板函数无需模板参数**

```c++
template <typename T> // 通用类型模板
bool IsEqual(T a, T b) {
	return a == b;
}

template<> // 特化木板函数无需模板参数
bool IsEqual(double a, double b) {
	return abs(a-b) < 1e-6;
}
```

函数重载优先级高于模板特化的优先级
**编译器函数搜索优先级：函数重载->函数特化模板->函数通用模板**

### 偏特化

当模板类存在多个模板参数时,只特化其中部分模板参数

<img src="D:\Typora_CACHE\image-20221126113003544.png" alt="image-20221126113003544" style="zoom:50%;" />

## 12.5 模板默认参数

- **模板参数**的默认值
- **函数参数**的默认值

```c++ '
template <typename T = int>
void Print(T i = 1.1) {
	cout << i << endl;
}
```

