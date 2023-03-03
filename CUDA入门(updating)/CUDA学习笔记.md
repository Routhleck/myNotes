# [godweiyang/NN-CUDA-Example](https://github.com/godweiyang/NN-CUDA-Example)

- 最简单的CUDA算子的写法。
- 最简洁的PyTorch和TensorFlow封装CUDA算子的方法。
- 几种编译CUDA算子的方法。
- python调用CUDA算子的几种方式。
- python中统计CUDA算子运行时间的正确方法。
- PyTorch和TensorFlow自定义算子梯度的方法。

## 代码结构

```python
├── include
│   └── add2.h # cuda kernel的头文件
├── kernel
│   └── add2_kernel.cu # cuda kernel
├── pytorch
│   ├── add2_ops.cpp # pytorch的wrapper, 
│   ├── time.py # 使用cuda kernel和原始torch的时间比较
│   ├── train.py # 使用自定义cuda kernel来训练
│   ├── setup.py
│   └── CMakeLists.txt
├── tensorflow
│   ├── add2_ops.cpp # 使用cuda kernel的tensorflow的wrapper
│   ├── time.py # 使用cuda kernel和原始tensorflow的时间比较
│   ├── train.py # 使用自定义cuda kernel来训练
│   └── CMakeLists.txt
├── LICENSE
└── README.md
```

- pytorch 和 tensorflow 的wrapper 可以训练和评估神经网络模型、可视化训练过程、保存和加载模型等

## Pytorch

### 编译cpp和cuda

#### setup

```
python3 pytorch/setup.py install
```

#### Cmake

```
mkdir build
cd build
cmake ../pytorch
make
```



