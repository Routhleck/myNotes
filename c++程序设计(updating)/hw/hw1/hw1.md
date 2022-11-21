# 选择题

1. ABDE

2. CDE

3. AB

4. AC

5. ABCDE

# 实践题

## 6.

1. ①auto val1;
   声明没有初始化式
   ⑥auto val6 = new auto{1, 2};
   为auto类型初始化{}中只需要一个元素
   ⑧auto val9 = 0, val10 = 3.14;
   val9赋为int型，val10赋为double型，auto无法推断
2. val2: int
   val3: long
   val4: double
   val5: float*
   val7: int
   val8: int*
3. ⑨ for(auto val:vec) {}
   发生了额外的拷贝操作

***

## 7.

1. buffer 数组 **栈**
   p1 所指对象  **堆**
   p2 所指对象 **栈**
2. 不能，报错为退出代码 -1073741819 (0xC0000005)
   p1在堆上，可以使用delete释放，而p2在栈上，delete不能作用于栈上的对象
3. 因为要释放栈上的对象，需要显式调用析构函数来释放对象
