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
│   └── add2.h # cuda kernel的头文件, 函数声明
├── kernel
│   └── add2_kernel.cu # cuda kernel, 函数实现
├── pytorch
│   ├── add2_ops.cpp # torch和cuda连接的地方,将cuda程序封装成了python可调用的库
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

### add2.h

```cpp
void launch_add2(float *c,
                 const float *a,
                 const float *b,
                 int n);
```

### add2.cu 

```c++
__global__ void add2_kernel(float* c,
                            const float* a,
                            const float* b,
                            int n) {
    for (int i = blockIdx.x * blockDim.x + threadIdx.x; \
            i < n; i += gridDim.x * blockDim.x) {
        c[i] = a[i] + b[i];
    }
}

void launch_add2(float* c,
                 const float* a,
                 const float* b,
                 int n) {
    dim3 grid((n + 1023) / 1024);
    dim3 block(1024);
    add2_kernel<<<grid, block>>>(c, a, b, n);
}	
```

实现为两个长度为n的tensor相加，`add2_kernel`为kernel函数，运行在gpu端，而`launch_add2`是cpu端的执行函数

### add2.cpp

```cpp
#include <torch/extension.h>
#include "add2.h"

void torch_launch_add2(torch::Tensor &c,
                       const torch::Tensor &a,
                       const torch::Tensor &b,
                       int n) {
    launch_add2((float *)c.data_ptr(),
                (const float *)a.data_ptr(),
                (const float *)b.data_ptr(),
                n);
}

PYBIND11_MODULE(TORCH_EXTENSION_NAME, m) {
    m.def("torch_launch_add2",
          &torch_launch_add2,
          "add2 kernel warpper");
}
```

`torch_launch_add2`函数传入c++版本的torch tensor，转换为c++指针数组，然后调用CUDA函数launch_add2来执行核函数

用pybind11来对`torch_launch_add2`函数封装

### python调用

```python
import time
import numpy as np
import torch
from torch.utils.cpp_extension import load

cuda_module = load(name="add2",
                   sources=["add2.cpp", "add2.cu"],
                   verbose=True)

# c = a + b (shape: [n])
n = 1024 * 1024
a = torch.rand(n, device="cuda:0")
b = torch.rand(n, device="cuda:0")
cuda_c = torch.rand(n, device="cuda:0")

ntest = 10

def show_time(func):
    times = list()
    res = list()
    # GPU warm up
    for _ in range(10):
        func()
    for _ in range(ntest):
        # sync the threads to get accurate cuda running time
        torch.cuda.synchronize(device="cuda:0")
        start_time = time.time()
        r = func()
        torch.cuda.synchronize(device="cuda:0")
        end_time = time.time()

        times.append((end_time-start_time)*1e6)
        res.append(r)
    return times, res

def run_cuda():
    cuda_module.torch_launch_add2(cuda_c, a, b, n)
    return cuda_c

def run_torch():
    # return None to avoid intermediate GPU memory application
    # for accurate time statistics
    a + b
    return None

print("Running cuda...")
cuda_time, _ = show_time(run_cuda)
print("Cuda time:  {:.3f}us".format(np.mean(cuda_time)))

print("Running torch...")
torch_time, _ = show_time(run_torch)
print("Torch time:  {:.3f}us".format(np.mean(torch_time)))
```

`torch.utils.cpp_extension.load`函数用来自动编译cpp和cu，注意`sources`参数指定了需要编译的文件列表，然后可以通过`cuda_module.torch_launch_add2`来调用

# Block-sparse 源码学习

- blocksparse--python对cuda函数的进一步封装
  - \_\_init\_\_.py
  - conv.py
  - embed.py
  - ewops.py
  - grads.py
  - lstm.py
  - matmul.py
  - nccl.py
  - norms.py
  - optimize.py
  - quantize.py
  - transformer.py
  - utils.py
- examples--案例
  - lstm
    - layers.py
    - masks.py
    - memory_util.py
    - train.py
    - utils.py
  - transformer
    - enwik8.py
    - mnist_mpi.py
  - simple.py
- src--cuda与cc源码
  - dev
  - sass
  - batch_norm_op_gpu.cc
  - batch_norm_op.cc
  - blocksparse_hgemm_cn_64_op_gpu.cu
  - blocksparse_hgemm_cn_128_op_gpu.cu
  - blocksparse_hgemm_nc_op_gpu.cu
  - blocksparse_kernels.cc
  - blocksparse_l2_norm_op_gpu.cu
  - blocksparse_l2_norm_op.cc
  - blocksparse_matmul_gated_op_gpu.cu
  - blocksparse_matmul_op_gpu.cu
  - blocksparse_matmul.h
  - bst_hgemm_op_gpu.cu
  - bst_op.cc
  - bst_sgemm_op_gpu.cu
  - bst_softmax_op_gpu.cu
  - cwise_linear_op_gpu.cu
  - cwise_linear_op.cc
  - edge_bias_op_gpu.cu
  - edge_bias_op.cc
  - embedding_op_gpu.cu
  - embedding_op.cc
  - ew_op_gpu.h
  - ew_op.cc
  - gpu_hmma.h
  - gpu_types.cc
  - gpu_types.h
  - layer_norm_cn_op_gpu.cu
  - layer_norm_op.cc
  - lstm_op_gpu.cu
  - lstm_op.cc
  - matmul_op_gpu.cu
  - matmul_op.cc
  - nccl_op.cc
  - optimize_op_gpu.cu
  - optimize_op.cc
  - quantize_op_gpu.cu
  - quantize_op.cc
  - transformer_op_gpu.cu
  - transformer_op.cc
- test--最终测试
- vendor--厂商代码

## Task List

- [ ] batch_norm_op_gpu.cu GPU加速的批归一化（batch normalization）操作的实现
- [ ] batch_norm_op.cc 为GPU加速的批归一化进一步封装
- [ ] blocksparse_conv_op.cc 卷积算子封装
- [ ] blocksparse_hgemm_cn_64_op_gpu.cu “cn”可能代表的是“column-wise norm”的缩写，表示对输入矩阵的每一列进行范数计算？64为将矩阵分成64x64的小块来进行blocksparse操作
- [ ] blocksparse_hgemm_cn_128_op_gpu.cu 同理将矩阵分成128x128的小块来进行blocksparse操作
- [ ] blocksparse_hgemm_nc_op_gpu.cu 非连续压缩矩阵的half-precision 矩阵乘法实现 
- [ ] blocksparse_kernels.cc 加载CUDA kernel?
- [ ] blocksparse_l2_norm_op_gpu.cu GPU上并行计算输入向量的L2范数
- [ ] blocksparse_l2_norm_op.cc 并行计算输入向量的L2范数的封装
- [ ] blocksparse_matmul_gated_op_gpu.cu 使用GPU的矩阵乘法的实现，且使用了gate
- [ ] blocksparse_matmul_op_gpu.cu 使用GPU的矩阵乘法的实现
- [ ] blocksparse_matmul_op.cc 矩阵乘法的封装
- [ ] blocksparse_matmul.h 通过blocksparse技术实现矩阵乘法的的header
- [ ] bst_hgemm_op_gpu.cu GPU半精度浮点数的矩阵乘法
- [ ] bst_op.cc 处理稀疏张量的算子的封装
- [ ] bst_sgemm_op_gpu.cu GPU单精度浮点数的矩阵乘法
- [ ] bst_softmax_op_gpu.cu GPU在稀疏数据上计算softmax
- [ ] cwise_linear_op_gpu.cu GPU稀疏矩阵乘法的元素级线性操作
- [ ] cwise_linear_op.cc 稀疏矩阵乘法的元素级线性操作封装
- [ ] edge_bias_op_gpu.cu GPU对输入稀疏张量进行偏置加法的操作
- [ ] edge_bias_op.cc 对输入稀疏张量进行偏置加法封装
- [ ] embedding_op_gpu.cu GPU实现了稀疏嵌入操作
- [ ] embedding_op.cc 稀疏嵌入封装
- [ ] ew_op_gpu.h 逐元素操作的header
- [ ] ew_op.cc 逐元素操作以及各种基础操作的封装
- [ ] ew_op_gpu.cu GPU逐元素操作以及各种基础操作
- [ ] gpu_hmma.h 包含了 GPU 矩阵乘法加速器（HMMA）操作的头文件
- [ ] gpu_types.cc gpu_types.h的具体实现
- [ ] gpu_types.h 内存对齐、benchmark等
- [ ] layer_norm_cn_op_gpu.cu 用于在GPU上计算矩阵的Layer Normalization
- [ ] layer_norm_nc_op_gpu.cu 跟上面的就是`nc`和`cn`的差别，不懂？
- [ ] layer_norm_op.cc 为Layer Normalization进行封装
- [ ] lstm_op_gpu.cu GPU使用blocksparse来进行lstm的训练与推理
- [ ] lstm_op.cc blocksparse实现lstm的封装
- [ ] matmul_op_gpu.cu GPU实现矩阵乘法
- [ ] matmul_op.cc 矩阵乘法的封装
- [ ] nccl_op.cc 使用 NCCL（NVIDIA Collective Communications Library）进行通信的一些函数和操作
- [ ] optimize_op_gpu.cu GPU稀疏矩阵优化操作(优化器？)
- [ ] optimize_op.cc 稀疏矩阵优化操作封装
- [ ] quantize_op_gpu.cu GPU稀疏矩阵量化操作
- [ ] quantize_op.cc 稀疏矩阵量化操作封装
- [ ] transformer_op_gpu.cu GPU实现 Transformer 模型
- [ ] transformer_op.cc 实现 Transformer 模型封装

## gpu_types.h & gpu_types.cc

```c++
typedef struct __align__(2) ehalf {
    __device__ __forceinline__ ehalf() {}
    __device__ __forceinline__ ehalf(ushort v) : x(v) {}
    ushort x;
} ehalf;
```

ehalf是为了支持`IEEE half floating point内存`都是为对齐内存所服务的，用于提升运行效率
bhalf同理，但是是为了支持`tf.bfloat16 half floating point内存`
vhalf为了支持`Adam运行梯度方差`
mhalf为了支持`Adam运行梯度平均值`

```c++
typedef struct bsmm_params
{
    const int* Lut;
    const float* Gate;
    int* Lock;
    //float4* Scratch;
    int blocks;
    int bsize;
    int segments;
    int locks;
    int C;
    int K;
    int N;
    int shared;
    int pcount;
    uint blk_a;
    uint blk_A;
    uint blk_b;
    uint blk_B;
    float alpha;
    float beta;
    CUstream stream;
} bsmm_params;
```

用于矩阵乘法操作的变量值？

```c++
class Benchmark
{
  public:
    Benchmark(CUstream stream, const char* name, float mem_size, float num_flops, int repeat, bool isgpu=true);
    ~Benchmark();
    CUstream stream_;
    const char* name_;
    float mem_size_, num_flops_, repeat_;
    CUevent hStart_, hStop_;
    bool isgpu_;
    double us_start_;
};
```

基准测试类

```c++
typedef struct QuantStats
{
    float mean;
    float stdv;
    float sat_pct;
    float ftz_pct;
    float max_val;
} QuantStats;
```

记录量化操作的统计信息，可以帮助用户了解量化后数据的分布情况，评估量化操作的效果以及调整量化参数等

```c++
#define CUDA_CHECK( fn ) do { \
    CUresult status = (fn); \
    if ( CUDA_SUCCESS != status ) { \
        const char* errstr; \
        cuGetErrorString(status, &errstr); \
        printf("CUDA Driver Failure (line %d of file %s):\n\t%s returned 0x%x (%s)\n", __LINE__, __FILE__, #fn, status, errstr); \
    } \
} while (0)
```

在 CUDA Driver API 调用中检查返回状态是否为 CUDA_SUCCESS
打印出错误信息，包括发生错误时的文件和行号，调用的函数名，以及 CUDA Driver API 返回的错误码和错误字符串

## ew_op_gpu.h

一、二、三、四元运算及各种变量类型的转换
从GPU设备的全局内存中获取数据

主要为汇编代码，对寄存器的操作，对指针偏移量的计算
基础加减乘除、基础函数、梯度计算

加载函数

## ew_op.cc

```c++
Status UnchangedShape(shape_inference::InferenceContext* ctx) {
  ctx->set_output(0, ctx->input(0));
  return Status::OK();
}
```

将输入张量的形状传递给输出张量，即输出张量的形状与输入张量的形状相同。

与gpu类似，都是基础的实现

## blocksparse_matmul.h

定义了一系列函数，都是用于 GPU 计算的矩阵乘法

- `BsmmXprop_CN` 和 `BsmmUpdat_CN` 是用于计算前向传播和反向传播的基本矩阵乘法。
- `BsmmGatedXprop_CN` 和 `BsmmGatedUpdat_CN` 是用于计算前向传播和反向传播的门控矩阵乘法。
- `hgemm_blocksparse_xn_sdd` 是用于计算 $X^TW$ 的矩阵乘法，其中 $X$ 和 $W$ 是稀疏矩阵。
- `hgemm_blocksparse_nt_dds` 是用于计算 $X^TE$ 的矩阵乘法，其中 $X$ 和 $E$ 是稀疏矩阵，用于反向传播计算梯度。

## blocksparse_matmul_op_gpu.cu

矩阵乘法在神经网络中的作用是将**输入数据**和**连接权重**进行计算，从而得到**神经元的输出**。具体来说，输入数据可以表示为一个矩阵，每行代表一个输入样本，每列代表一个特征。连接权重也可以表示为一个矩阵，每行代表一个神经元的连接权重，每列代表上一层神经元的输出。这样，将输入数据矩阵乘以连接权重矩阵就可以得到输出矩阵，其中每行代表一个神经元的输出。

`xprop`与`updat`的区别为一个是正向传播，一个是反向传播

### gemm_blocksparse_08x64x08x8\_xprop

```c++
template <bool Fprop, typename TW, typename TX, typename TY>
__global__ void __launch_bounds__(32) gemm_blocksparse_08x64x08x8_xprop(
    const  int2* __restrict__ Lut,
    const    TW* __restrict__ W,
    const    TX* __restrict__ X,
    TY* Y, int* Lock, int locks, int N /* N is in units of groups of 8 elements each (N/8) */)
```

这个函数实现了一个 08x64x08x8 的矩阵乘法，其中输入的稀疏矩阵 Lut 以及稠密矩阵 W 和 X 的维度和数据类型分别为 int2, TW, TX，输出矩阵 Y 的维度和数据类型为 TY, `xprop`代表cross propagation(交叉传播)
在前向传播中，输入数据通过神经网络的一系列计算得到输出结果。在反向传播中，梯度从输出结果开始向前传播，逐层计算每个参数的梯度。**在交叉传播中，前向传播和反向传播交替进行，用于更新神经网络的参数**。

- Fprop: 布尔类型，表示是否进行前向传播（即计算矩阵乘积 W * X），如果为 true，则进行前向传播，否则进行反向传播。
  **正向传播**是指将输入数据通过神经网络进行前向计算的过程，输出最终结果。在这个过程中，输入数据通过多个层进行处理，每个层都使用权重矩阵进行计算，并将计算结果传递到下一层。最终输出的结果可以与目标输出进行比较以计算损失函数。
  **反向传播**是指根据损失函数的结果，使用链式法则计算对每个权重矩阵的梯度，并使用梯度下降算法来更新权重矩阵。在这个过程中，每个权重矩阵的梯度都通过反向传播从输出层传播到输入层，以便更新权重矩阵。反向传播的结果是更新后的权重矩阵，以便在下一次正向传播中使用。
- Lut: 输入的稀疏矩阵，类型为 int2*，其中 int2 表示包含两个 int 类型的结构体。
  具体来说，输入稀疏矩阵中只包含非零元素，因此在矩阵乘法计算中，我们只需要计算非零元素的乘积。而查找表（`Lut`）是一个映射表，它将输入稀疏矩阵的每个非零元素的索引映射到一个线性索引，从而方便进行乘积计算。
  该查找表（`Lut`）是一个指向 `int2` 类型常量的指针，其中 `int2` 是一个 CUDA 内置的数据类型，表示包含两个整数的结构体。在该函数中，`Lut` 参数的作用是告诉函数在哪里可以找到查找表，并利用查找表来计算输入稀疏矩阵中的非零元素对应的权重矩阵中的值。
- W: 输入的权重矩阵 W，类型为 TW*。
- X: 输入的稠密矩阵 X，类型为 TX*。
- Y: 输出的稠密矩阵 Y，类型为 TY*。
- Lock: 锁的数组，类型为 int*，用于并发控制。
- locks: 锁的数量，类型为 int。
- **N: 表示输入矩阵中元素的数量，以8个元素为一组。。**

### gemm_blocksparse_08x64x08x4_xprop

```c++
template <bool Fprop, typename TW, typename TX, typename TY>
__global__ void __launch_bounds__(32) gemm_blocksparse_08x64x08x4_xprop(
    const  int2* __restrict__ Lut,
    const    TW* __restrict__ W,
    const    TX* __restrict__ X,
    TY* Y, int* Lock, int locks, int N)
```

与前面的函数不同的是，输入的稠密矩阵 X 的大小为 08x64x08x4，而不是 08x64x08x8

gemm_blocksparse_16x64x16x8_xprop

```c++
template <bool Fprop, typename TW, typename TX, typename TY>
__global__ void __launch_bounds__(64) gemm_blocksparse_16x64x16x8_xprop(
    const  int2* __restrict__ Lut,
    const    TW* __restrict__ W,
    const    TX* __restrict__ X,
    TY* Y, int* Lock, int locks, int N /* N is in units of groups of 8 elements each (N/8) */)
```

输入稀疏矩阵的大小为 `(N, 16)`，权重矩阵的大小为 `(16, 64)`，输出矩阵的大小为 `(N, 64)`。其中，每个输入稀疏矩阵的行（或称为“组”）包含 8 个元素。

`16x64x16x8` 中的第一个数字 `16` 表示权重矩阵的行数，也就是每个输入稀疏矩阵组的大小。第二个数字 `64` 表示权重矩阵的列数，也就是输出矩阵中每行的大小。第三个数字 `16` 表示输入稀疏矩阵组中的元素个数，也就是每个输入稀疏矩阵组的大小。最后一个数字 `8` 表示每个输入稀疏矩阵中包含的“组”数。

### gemm_blocksparse_16x64x16x4_xprop

```c++
template <bool Fprop, typename TW, typename TX, typename TY>
__global__ void __launch_bounds__(64) gemm_blocksparse_16x64x16x4_xprop(
    const  int2* __restrict__ Lut,
    const    TW* __restrict__ W,
    const    TX* __restrict__ X,
    TY* Y, int* Lock, int locks, int N)
```

### gemm_blocksparse_08x64x08x8_updat

```c++
template <typename TX, typename TE, typename TU>
__global__ void __launch_bounds__(32) gemm_blocksparse_08x64x08x8_updat(
    struct Plist<TX,8> X, struct Plist<TE,8> E,
    const  int2* __restrict__ Lut,
    TU* U,
    int params8, int N, int loops, float alpha, float beta)
```

这个函数与上面的函数不同，因为它是用于反向传播（backpropagation）过程中的神经网络参数更新，而不是前向传播过程中的输出计算。

“08x64x08x8”表示当前层神经元的数量是 8，输入数据的特征数量是 64，连接权重的数量也是 8，每次更新的数据块大小是 8。

- struct Plist<TX,8> X,          // 输入数据 X    
- struct Plist<TE,8> E,          // 输出误差 E    
- const int2* __restrict__ Lut,  // 连接索引 
- Lut    TU* U,                         // 当前层的参数矩阵 U   
- int params8,                   // 参数数量（每次更新的数据块大小）    
- int N,                         // 神经元数量     
- int loops,                     // 循环次数     
- float alpha,                   // 乘数 alpha     
- float beta                     // 乘数 beta 

### gemm_blocksparse_16x64x16x4_updat

```c++
template <typename TX, typename TE, typename TU>
__global__ void __launch_bounds__(64) gemm_blocksparse_16x64x16x4_updat(
    struct Plist<TX,8> X, struct Plist<TE,8> E,
    const  int2* __restrict__ Lut,
    TU* U,
    int params8, int N, int loops, float alpha, float beta)
```

与上面的函数差别只有参数数值的改变

### gemm_blocksparse_16x64x16x8

```c++
template <typename TX, typename TE, typename TU>
__global__ void __launch_bounds__(64) gemm_blocksparse_16x64x16x8_updat(
    struct Plist<TX,8> X, struct Plist<TE,8> E,
    const  int2* __restrict__ Lut,
    TU* U,
    int params8, int N, int loops, float alpha, float beta)
```

同理只有参数数值的改变

### gemm_blocksparse_32x64x32x8_xprop

```c++
template <bool Fprop, typename TW, typename TX, typename TY>
__global__ void __launch_bounds__(128) gemm_blocksparse_32x64x32x8_xprop(
    const  int2* __restrict__ Lut,
    const    TW* __restrict__ W,
    const    TX* __restrict__ X,
    TY* Y, int* Lock, int locks, int N /* N is in units of groups of 8 elements each (N/8) */)
```

\_\_launch_bounds\_\_增加到128

### gemm_blocksparse_32x64x32x4_xprop

```c++
template <bool Fprop, typename TW, typename TX, typename TY>
__global__ void __launch_bounds__(128) gemm_blocksparse_32x64x32x4_xprop(
    const  int2* __restrict__ Lut,
    const    TW* __restrict__ W,
    const    TX* __restrict__ X,
    TY* Y, int* Lock, int locks, int N /* N is in units of groups of 4 elements each (N/4) */)
```

N变为4

### gemm_blocksparse_32x64x32x8_updat

```c++
template <typename TX, typename TE, typename TU>
__global__ void __launch_bounds__(256) gemm_blocksparse_32x64x32x8_updat(
    struct Plist<TX,8> X, struct Plist<TE,8> E,
    const  int2* __restrict__ Lut,
    TU* U,
    int params8, int N, int loops, float alpha, float beta)
```

\_\_launch_bounds__变为了256

### gemm_blocksparse_32x64x32x4_updat

```c++
template <typename TX, typename TE, typename TU>
__global__ void __launch_bounds__(256) gemm_blocksparse_32x64x32x4_updat(
    struct Plist<TX,8> X, struct Plist<TE,8> E,
    const  int2* __restrict__ Lut,
    TU* U,
    int params8, int N, int loops, float alpha, float beta)
```

N变为4

### BsmmXprop_CN

```c++
template <bool Fprop, CTYPE(T)>
cudaError_t BsmmXprop_CN(const T* X, const T* W, T* Y, bsmm_params* params)
```

执行基于 CUDA 的稀疏矩阵乘法（Block-sparse Matrix Multiplication，BSMM）操作，实现神经网络的前向传播

`CN` 通常代表卷积操作中的通道（channel）和批量（batch）维度，即 `C` 通道维度和 `N` 批量维度。例如，如果有一个形状为 `(N, C, H, W)` 的张量，其中 `N` 表示批量大小，`C` 表示通道数量，`H` 和 `W` 表示图像的高度和宽度，那么 `CN` 操作就是在 `C` 和 `N` 两个维度上做矩阵乘法。

- Fprop 表示前向传播
- T 是数据类型
- X 是输入数据
- W 是权重矩阵
- Y 是输出数据
- params 包含了一些 BSMM 的相关参数。
- 返回值是一个 CUDA 错误代码（cudaError_t 类型），用于指示 BSMM 操作是否成功执行。

```c++
template cudaError_t BsmmXprop_CN<true,  VTYPE(float)>(const float* X, const float* W, float* Y, bsmm_params* params);
template cudaError_t BsmmXprop_CN<true,  VTYPE(ehalf)>(const ehalf* X, const ehalf* W, ehalf* Y, bsmm_params* params);
template cudaError_t BsmmXprop_CN<true,  VTYPE(bhalf)>(const bhalf* X, const bhalf* W, bhalf* Y, bsmm_params* params);

template cudaError_t BsmmXprop_CN<false, VTYPE(float)>(const float* X, const float* W, float* Y, bsmm_params* params);
template cudaError_t BsmmXprop_CN<false, VTYPE(ehalf)>(const ehalf* X, const ehalf* W, ehalf* Y, bsmm_params* params);
template cudaError_t BsmmXprop_CN<false, VTYPE(bhalf)>(const bhalf* X, const bhalf* W, bhalf* Y, bsmm_params* params);
```

这些是变量类型`float, ehalf, bhalf`的排列组合

### BsmmUpdat_CN

```c++
template <CTYPE(T)>
cudaError_t BsmmUpdat_CN(const T* X, const T* E, T* U, bsmm_params* params)
```

执行基于 CUDA 的稀疏矩阵乘法（Block-sparse Matrix Multiplication，BSMM）操作，实现神经网络的反向传播

- T 是数据类型
- X 是输入数据
- E 是误差反向传播时的残差
- U 是需要更新的权重矩阵
- params 包含了一些 BSMM 的相关参数

```c++
template cudaError_t BsmmUpdat_CN<VTYPE(float)>(const float* X, const float* E, float* U, bsmm_params* params);
template cudaError_t BsmmUpdat_CN<VTYPE(ehalf)>(const ehalf* X, const ehalf* E, ehalf* U, bsmm_params* params);
template cudaError_t BsmmUpdat_CN<VTYPE(bhalf)>(const bhalf* X, const bhalf* E, bhalf* U, bsmm_params* params);
```

这些是变量类型`float, ehalf, bhalf`排列组合

### identity_init_CK

```c++
template <uint BSIZE, uint THREADS>
__global__ void __launch_bounds__(THREADS) identity_init_CK(float* W, const int2* __restrict__ lut, int CB, int KB, float scale)
```

`CK` 则通常代表卷积操作中的卷积核（kernel）和通道维度，即 `C` 通道维度和卷积核中的 `K` 维度。在卷积计算中，我们通常会使用形状为 `(K, C, H_k, W_k)` 的卷积核，其中 `K` 表示卷积核的数量，`C` 表示输入张量的通道数量，`H_k` 和 `W_k` 则表示卷积核的高度和宽度。因此，在 `CK` 操作中，我们需要将卷积核中的 `K` 维度展开，然后在 `C` 和 `K` 两个维度上做矩阵乘法。

- BSIZE：一个无符号整数，表示每个线程块（block）中包含的线程数。
- THREADS：一个无符号整数，表示每个线程块的数量。
- W：一个指向浮点数数组的指针，表示需要初始化的权重矩阵。
- lut：一个指向 int2 数组的指针，表示 Block-sparse 矩阵的 LUT（lookup table）数组，存储了 Block-sparse 矩阵中的索引信息。
- CB：一个整数，表示 Block-sparse 矩阵中的总行数。
- KB：一个整数，表示 Block-sparse 矩阵中的总列数。
- scale：一个浮点数，表示初始化权重矩阵的缩放比例。

主要的功能是**对权重矩阵进行初始化**。具体地，函数使用给定的 LUT 和权重矩阵的行列数，将权重矩阵的对角线元素设为缩放比例，其余元素设为零。

### IdentityInitCK

```c++
bool IdentityInitCK(CUstream stream, float* W, const int* lut, int CB, int KB, int blocks, int bsize, float scale)
```

第二个参数使用了 `const int*` 类型的 LUT（查找表），而不是 `const int2*` 类型。
返回值为bool型

增加了一个 `blocks` 参数，表示要初始化的块数。这个函数的作用是使用 LUT 将矩阵 `W` 中的对角线元素设置为 `scale`，并将其它元素设置为 0

## blocksparse_matmul_gated_op_gpu.cu

### LutEntry

```c++
typedef struct __align__(16) LutEntry
{
    int offsetX;
    int offsetW;
    float gate;
    float unused;
} LutEntry;
```

这个结构体通常用于卷积计算中的查表操作，通过 `offsetX` 和 `offsetW` 可以在输入矩阵和卷积核矩阵中找到对应的数据块，而 `gate` 可以用于控制是否使用该卷积核进行计算。

1. `offsetX`：表示输入矩阵中该卷积核对应的起始位置偏移量。
2. `offsetW`：表示卷积核矩阵中该卷积核对应的起始位置偏移量。
3. `gate`：表示该卷积核的激活门，即在计算过程中是否需要激活该卷积核。
4. `unused`：未使用的保留字段。

### gemm_blocksparse_gated_08x64x08x8_xprop

```c++
template <bool Fprop, typename TW, typename TX, typename TY>
__global__ void __launch_bounds__(32) gemm_blocksparse_gated_08x64x08x8_xprop(
    const  int2* __restrict__ Lut,
    const float* __restrict__ Gate,
    const    TW* __restrict__ W,
    const    TX* __restrict__ X,
    TY* Y, int* Lock, int locks, int N /* N is in units of groups of 8 elements each (N/8) */)
```

相较于之前的函数增加了一个名为`Gate`的参数，其含义是用于控制门限的权重矩阵。在循环神经网络 (RNN) 中，门限机制可以用于控制信息的流动，比如长短期记忆网络 (LSTM) 和门控循环单元 (GRU) 等都使用了门限机制。在这里，`Gate`即为控制门限的权重矩阵。

### gemm_blocksparse_gated_08x64x08x4_xprop

```c++
template <bool Fprop, typename TW, typename TX, typename TY>
__global__ void __launch_bounds__(32) gemm_blocksparse_gated_08x64x08x4_xprop(
    const  int2* __restrict__ Lut,
    const float* __restrict__ Gate,
    const    TW* __restrict__ W,
    const    TX* __restrict__ X,
    TY* Y, int* Lock, int locks, int N)
```

只是参数数值变化

### gemm_blocksparse_gated_08x64x08x8_updat

```c++
template <typename TX, typename TE, typename TU>
__global__ void __launch_bounds__(32) gemm_blocksparse_gated_08x64x08x8_updat(
    struct Plist<TX,8> X, struct Plist<TE,8> E,
    const  int2* __restrict__ Lut,
    const float* __restrict__ Gate,
    TU* U,
    int params8, int N, int loops, float alpha, float beta)
```

也仅多了个gate

### gemm_blocksparse_gated_08x64x08x4_updat

```c++
template <typename TX, typename TE, typename TU>
__global__ void __launch_bounds__(32) gemm_blocksparse_gated_08x64x08x4_updat(
    struct Plist<TX,8> X, struct Plist<TE,8> E,
    const  int2* __restrict__ Lut,
    const float* __restrict__ Gate,
    TU* U,
    int params8, int N, int loops, float alpha, float beta)
```

### BsmmGatedXprop_CN

```c++
template <bool Fprop, CTYPE(T)>
cudaError_t BsmmGatedXprop_CN(const T* X, const T* W, T* Y, bsmm_params* params)
```

实现了一个块稀疏矩阵乘法（Block Sparse Matrix Multiplication，BSMM）的前向传播（Fprop）或者反向传播（Bprop）操作，并且在计算过程中加入了门控（Gated）的特性

- X表示输入的稠密矩阵
- W表示稀疏权重矩阵
- Y表示输出的稠密矩阵
- params是一些与BSMM相关的参数
- 在模板参数中，CTYPE(T)指定了T的类型，如float或half等

```c++
template cudaError_t BsmmGatedXprop_CN<true,  VTYPE(float)>(const float* X, const float* W, float* Y, bsmm_params* params);
template cudaError_t BsmmGatedXprop_CN<true,  VTYPE(ehalf)>(const ehalf* X, const ehalf* W, ehalf* Y, bsmm_params* params);
template cudaError_t BsmmGatedXprop_CN<true,  VTYPE(bhalf)>(const bhalf* X, const bhalf* W, bhalf* Y, bsmm_params* params);

template cudaError_t BsmmGatedXprop_CN<false, VTYPE(float)>(const float* X, const float* W, float* Y, bsmm_params* params);
template cudaError_t BsmmGatedXprop_CN<false, VTYPE(ehalf)>(const ehalf* X, const ehalf* W, ehalf* Y, bsmm_params* params);
template cudaError_t BsmmGatedXprop_CN<false, VTYPE(bhalf)>(const bhalf* X, const bhalf* W, bhalf* Y, bsmm_params* params);
```

对变量类型`float, ehalf, bhalf`进行排列组合

### BsmmGatedUpdat_CN

```c++
template <CTYPE(T)>
cudaError_t BsmmGatedUpdat_CN(const T* X, const T* E, T* U, bsmm_params* params)
```

此为反向传播

- `X`  为稀疏矩阵
- `E` 为误差矩阵
- `U` 是累积梯度矩阵 
- `bsmm_params` 包含了所需的其他参数。

```c++
template cudaError_t BsmmGatedUpdat_CN<VTYPE(float)>(const float* X, const float* E, float* U, bsmm_params* params);
template cudaError_t BsmmGatedUpdat_CN<VTYPE(ehalf)>(const ehalf* X, const ehalf* E, ehalf* U, bsmm_params* params);
template cudaError_t BsmmGatedUpdat_CN<VTYPE(bhalf)>(const bhalf* X, const bhalf* E, bhalf* U, bsmm_params* params);
```

对变量类型`float, ehalf, bhalf`进行排列组合

## gpu_hmma.h

包含了 GPU 矩阵乘法加速器（HMMA）操作的头文件。HMMA 是 NVIDIA Tensor Core 加速器的一种形式，可以显著提高矩阵乘法的性能。

数据类型转换、除法、加法、从全局内存加载数值、将数值存储到全局内存中、将内存置零

fragmentA用于在 GPU 中存储一个尺寸为 TILE 的矩阵片段 A

还有内存对齐

## batch_norm_op_gpu.cu

GPU 加速的批归一化（batch normalization）操作的实现

### div64

```c++
__device__ __forceinline__ int div64(int value, int magic, int shift)
```

用位运算来实现，效率比普通除法更高。具体实现方法是将value与一个"magic"数相乘，然后将结果向右移动shift位，就得到了除以64后向下取整的结果

- value：需要被除以64的整数。
- magic：一个"magic"数，用于将乘法变成位运算。这个数的值在编译时就已经被计算好了，所以可以直接使用。
- shift：右移的位数，一般为6（即2的6次方等于64）。

### batchnorm_inference_ncdhw

```c++
// y = g * (x - mean) / sqrt(var + eps) + b
template <typename T, int THREADS>
__global__ void __launch_bounds__(THREADS) batchnorm_inference_ncdhw(
              T*              Y,
    const float* __restrict__ M,
    const float* __restrict__ V,
    const     T* __restrict__ X,
    const float* __restrict__ G,
    const float* __restrict__ B,
    int CDHW, int DHW, float epsilon)
```

用于执行batch normalization（批量归一化）推理的CUDA kernel核函数,用来推断
NCDHW（Batch，Channel，Depth，Height，Width）

- Y是输出张量
- M是输入张量在通道维度上的均值
- V是输入张量在通道维度上的方差
- X是输入张量
- G是缩放系数（scale factors）
- B是偏移量（bias）
- CDHW是输入张量的元素数量
- DHW是输入张量的深度乘以高度乘以宽度
- epsilon是用于避免除以零的小常数

此函数将归一化后的结果存储在Y中，该归一化的操作如下所示：
$$
y=g⋅\frac{x - means}{\sqrt{var+eps}}+b 
$$
其中：

- $y$是输出张量
- $x$是输入张量
- $mean$是输入张量在通道维度上的均值
- $var$是输入张量在通道维度上的方差
- $g$是缩放系数（scale factors）
- $b$是偏移量（bias）
- $eps$是用于避免除以零的小常数

此函数使用了模板参数T和THREADS。T是输入和输出张量的数据类型。THREADS指定每个block的线程数。

### BatchNormNCDHW_Inference

```c++
template <typename T>
bool BatchNormNCDHW_Inference(CUstream stream,
              T* y,
    const float* m,
    const float* v,
    const     T* x,
    const float* g,
    const float* b,
    int N, int C, int DHW, float epsilon)
```

在这个函数中，首先根据输入Tensor的形状计算出CDHW（C * D * H * W）的值，并根据输入Tensor的通道数和batch size设定CUDA的block和grid大小。然后根据输入Tensor的depth、height、width三个维度的大小选择不同的线程数来进行推断操作。最后，函数返回一个true值，表示batch normalization的推断操作已经完成

```c++
template bool BatchNormNCDHW_Inference<float>(CUstream stream,
          float* y,
    const float* m,
    const float* v,
    const float* x,
    const float* g,
    const float* b,
    int N, int C, int DHW, float epsilon);

template bool BatchNormNCDHW_Inference<ehalf>(CUstream stream,
          ehalf* y,
    const float* m,
    const float* v,
    const ehalf* x,
    const float* g,
    const float* b,
    int N, int C, int DHW, float epsilon);

template bool BatchNormNCDHW_Inference<bhalf>(CUstream stream,
          bhalf* y,
    const float* m,
    const float* v,
    const bhalf* x,
    const float* g,
    const float* b,
    int N, int C, int DHW, float epsilon);
```

数据类型分别为`float, ehalf, bhalf`

### batchnorm_forward_ncdhw

```c++
// mean = sum(x, axis=(0,2,...)) / NDHW
// var  = sum((x - mean)**2, axis=(0,2,...)) / NDHW
// y    = g * (x - mean) / sqrt(var + eps) + b
template <typename T, int THREADS>
__global__ void __launch_bounds__(THREADS) batchnorm_forward_ncdhw(
              T*              Y,
          float*              M,
          float*              V,
    const     T* __restrict__ X,
    const float* __restrict__ G,
    const float* __restrict__ B,
    int CDHW, int NDHW, int DHW, int magic_DHW, int shift_DHW, float rcpNDHW, float epsilon)
```

用来训练，函数计算的是每个通道的均值和方差，用于计算Batch Normalization的前向传递（forward pass）的CUDA kernel函数

- `Y`：输出的张量指针，大小为`CDHW`，即一个通道内的数据量。
- `M`：存储计算的均值的数组指针，大小为`C`，即通道的数量。
- `V`：存储计算的方差的数组指针，大小为`C`，即通道的数量。
- `X`：输入的张量指针，大小为`CDHW`，即一个通道内的数据量。
- `G`：伽马参数，大小为`C`，即通道的数量。
- `B`：贝塔参数，大小为`C`，即通道的数量。
- `CDHW`：输入输出张量的尺寸，即数据量。
- `NDHW`：输入输出张量的尺寸，即数据量。
- `DHW`：输入输出张量的尺寸，即数据量。
- `magic_DHW`：减少除法运算的数字。
- `shift_DHW`：减少除法运算的数字。
- `rcpNDHW`：输入输出张量的倒数。
- `epsilon`：加入到方差中以避免分母为零的常数。

### BatchNormNCDHW_Forward

```c++
template <typename T>
bool BatchNormNCDHW_Forward(CUstream stream,
              T* y,
          float* m,
          float* v,
    const     T* x,
    const float* g,
    const float* b,
    int N, int C, int DHW, int magic_DHW, int shift_DHW, float epsilon)
```

与`BatchNormNCDHW_Inference`同理，要计算NDHW与CDHW以及rcpNDHW，然后分配线程来进行训练

```c++
template bool BatchNormNCDHW_Forward<float>(CUstream stream,
          float* y,
          float* m,
          float* v,
    const float* x,
    const float* g,
    const float* b,
    int N, int C, int DHW, int magic_DHW, int shift_DHW, float epsilon);

template bool BatchNormNCDHW_Forward<ehalf>(CUstream stream,
          ehalf* y,
          float* m,
          float* v,
    const ehalf* x,
    const float* g,
    const float* b,
    int N, int C, int DHW, int magic_DHW, int shift_DHW, float epsilon);

template bool BatchNormNCDHW_Forward<bhalf>(CUstream stream,
          bhalf* y,
          float* m,
          float* v,
    const bhalf* x,
    const float* g,
    const float* b,
    int N, int C, int DHW, int magic_DHW, int shift_DHW, float epsilon);
```

数据类型分别为`float, ehalf, bhalf`

### batchnorm_backward_ncdhw

```c++
template <typename TX, typename TY, int THREADS>
__global__ void __launch_bounds__(THREADS) batchnorm_backward_ncdhw(
             TY*              DX,
          float*              DG,
          float*              DB,
    const    TY* __restrict__ DY,
    const    TX* __restrict__ X,
    const float* __restrict__ G,
    const float* __restrict__ M,
    const float* __restrict__ V,
    int CDHW, int NDHW, int DHW, int magic_DHW, int shift_DHW, float rcpNDHW, float epsilon)
```

这个函数是用来计算批归一化操作的反向传播的。与前向传播不同的是，该函数的输入包括：

- DY: 前向传播中的输出误差，即损失函数关于批归一化输出的导数；
- X: 前向传播中的输入；
- G: 批归一化中的gamma参数；
- M: 批归一化中的均值参数；
- V: 批归一化中的方差参数；

而输出包括：

- DX: 批归一化中的输入误差，即损失函数关于批归一化输入的导数；
- DG: 批归一化中的gamma参数误差，即损失函数关于gamma的导数；
- DB: 批归一化中的beta参数误差，即损失函数关于beta的导数；

其中，TX和TY表示输入和输出的数据类型，THREADS是CUDA kernel的线程数。

### BatchNormNCDHW_Backward

```c++
template <typename TX, typename TY>
bool BatchNormNCDHW_Backward(CUstream stream,
             TY* dx,
          float* dg,
          float* db,
    const    TY* dy,
    const    TX* x,
    const float* g,
    const float* m,
    const float* v,
    int N, int C, int DHW, int magic_DHW, int shift_DHW, float epsilon)
```

同理计算出`NDHW、CDHW、rcpNDHW`然后判断出线程数

```c++
template bool BatchNormNCDHW_Backward<float,float>(CUstream stream,
          float* dx,
          float* dg,
          float* db,
    const float* dy,
    const float* x,
    const float* g,
    const float* m,
    const float* v,
    int N, int C, int DHW, int magic_DHW, int shift_DHW, float epsilon);

template bool BatchNormNCDHW_Backward<ehalf,ehalf>(CUstream stream,
          ehalf* dx,
          float* dg,
          float* db,
    const ehalf* dy,
    const ehalf* x,
    const float* g,
    const float* m,
    const float* v,
    int N, int C, int DHW, int magic_DHW, int shift_DHW, float epsilon);

template bool BatchNormNCDHW_Backward<ehalf,float>(CUstream stream,
          float* dx,
          float* dg,
          float* db,
    const float* dy,
    const ehalf* x,
    const float* g,
    const float* m,
    const float* v,
    int N, int C, int DHW, int magic_DHW, int shift_DHW, float epsilon);

template bool BatchNormNCDHW_Backward<bhalf,bhalf>(CUstream stream,
          bhalf* dx,
          float* dg,
          float* db,
    const bhalf* dy,
    const bhalf* x,
    const float* g,
    const float* m,
    const float* v,
    int N, int C, int DHW, int magic_DHW, int shift_DHW, float epsilon);
```

为`float, ehalf, bhalf`排列组合

## blocksparse_hgemm_nc_op_gpu.cu

`nc` 表示该矩阵乘法操作是基于非连续压缩矩阵实现的，`hgemm`是half-precision matrix multiplication的缩写

### stg_64x64x64_nx

```c++
template <bool N64>
__device__  __noinline__  void stg_64x64x64_nx(ehalf* Y, uint offsetY, uint loadY, uint N, uint K, uint n, uint i)
```

将一个大小为64x64x64的block内的输入数据（在Y中）与权重（存储在全局内存中）做矩阵乘法，计算出输出数据并存储在全局内存中。其中，该函数的模板参数N64表示输入数据的通道数是否为64，如果为true，则输入数据通道数为64，否则通道数为32

`64x64x64`代表了操作的矩阵维度。其中，第一个64表示输入矩阵的行数，第二个64表示输入矩阵的列数，第三个64表示输出矩阵的列数

`stg`很可能是“store global”（存储到全局内存）的缩写。`nx`可能是`N64`的缩写，表示一个布尔参数，指示是否将`N`扩展为64的倍数。这个函数的实现可能会将从输入矩阵中加载的数据存储到全局内存中，并根据参数`N64`将`N`扩展为64的倍数，以便使用适当大小的线程块和线程格进行计算。

- `Y`：输入数据在共享内存中的指针。
- `offsetY`：输入数据的偏移量，用于获取当前线程负责处理的输入数据的位置。
- `loadY`：一个二进制标志，表示当前线程负责处理的输入数据是否需要从全局内存中加载，如果为0，则需要从全局内存中加载，否则说明该数据已经在共享内存中，无需加载。
- `N`：输入数据的通道数。
- `K`：权重矩阵的列数，即每个卷积核的长度。
- `n`：输出数据在N维上的坐标。
- `i`：当前线程在block中的唯一ID。

### red_64x64x64_nx

```c++
template <bool N64>
__device__  __noinline__  void red_64x64x64_nx(ehalf* Y, uint offsetY, uint loadY, uint N, uint K, uint n, uint i, uint stdC)
```

`red` 可能代表 reduction，表示这是一个进行降维操作的函数，而不是像 `stg` 函数一样进行直接的存储操作。

`uint stdC`代表每个块的标准列数，也就是指定每个块中矩阵的列数，用于确保矩阵块的内存访问是连续的。

### hgemm_blocksparse_64x64x64_nx_dsd

```c++
template <uint OP_B, bool N64, bool GATED>
__global__ void __launch_bounds__(256) hgemm_blocksparse_64x64x64_nx_dsd(
    const uint2* __restrict__ Lut,
    const float* __restrict__ Gate,
    const ehalf* __restrict__ X,
    const ehalf* __restrict__ W,
          ehalf*              Y,
    uint* Lock, uint locks, uint N, uint C, uint K, uint blk_a, uint blk_b, uint blk_N)
```

执行稀疏矩阵乘法操作，计算公式为Y = X * W，其中X和W为输入稀疏矩阵，Y为输出稠密矩阵。该函数使用了blocksparse中的64x64x64稠密块矩阵，其中64x64x64代表了输入、输出和权重矩阵的大小，nx表示不使用XNOR计算方式(在深度学习中，XNOR-Net是一种二值卷积神经网络，其中权重和输入数据都被量化为-1或1，从而可以快速进行卷积计算)，dsd表示使用动态稀疏度（Dynamic Sparse Dense）计算方式(在这种计算方式下，输入张量是动态稀疏的，即每个批次中，输入张量中的稀疏部分的位置会发生变化，但是每个批次的稠密部分位置不变，这样可以通过只计算稠密部分来加速计算。)

- Lut：输入稀疏矩阵的索引表，用于查找每个稀疏块在输入矩阵X中的位置。
- Gate：Gated Linear Unit (GLU)门控矩阵，如果GATED为true，则需要使用该参数。
- X：输入稀疏矩阵X。
- W：权重矩阵W。
- Y：输出稠密矩阵Y。
- Lock：用于互斥访问输出矩阵Y的锁数组。
- locks：锁数组的大小。
- N：输入矩阵X的行数，即batch size。
- C：输入矩阵X的通道数。
- K：输出矩阵Y的通道数。
- blk_a：输入矩阵X的块大小。
- blk_b：输出矩阵Y的块大小。
- blk_N：稀疏矩阵块的数量。

### stg_64x32x32_nx

```c++
template <bool N64>
__device__  __noinline__  void stg_64x32x32_nx(ehalf* Y, uint offsetY, uint loadY, uint N, uint K, uint n, uint i)
```

与`stg_64x64x64_nx`不同的只有矩阵的大小

### red_64x32x32_nx

```c++
template <bool N64>
__device__  __noinline__  void red_64x32x32_nx(ehalf* Y, uint offsetY, uint loadY, uint N, uint K, uint n, uint i, uint stdC)
```

与`red_64x64x64_nx`不同的只有矩阵的大小

### hgemm_blocksparse_64x32x32_nx_dsd

```c++
template <uint OP_B, bool N64, bool GATED>
__global__ void __launch_bounds__(128) hgemm_blocksparse_64x32x32_nx_dsd(
    const uint2* __restrict__ Lut,
    const float* __restrict__ Gate,
    const ehalf* __restrict__ X,
    const ehalf* __restrict__ W,
          ehalf*              Y,
    uint* Lock, uint locks, uint N, uint C, uint K, uint blk_a, uint blk_b, uint blk_N)
```

与`hgemm_blocksparse_64x64x64_nx_dsd`不同的只有矩阵的大小

### hgemm_blocksparse_64x64x64_tn_dds

```c++
template <bool N64, bool GATED>
__global__ void __launch_bounds__(256,3) hgemm_blocksparse_64x64x64_tn_dds(
    struct Plist<ehalf,8> X,
    struct Plist<ehalf,8> DY,
    ehalf*                DW,
    const uint2* __restrict__ Lut,
    const float* __restrict__ Gate,
    uint params8, uint N, uint C, uint K, uint loops, uint accumulate)
```

函数名中的`tn`表示转置操作，代表矩阵乘法中第二个矩阵需要被转置，而`nx`函数没有进行转置操作；

DDS和DSD都是动态稀疏度（Dynamic Sparse Dense）的算法，它们的主要区别在于稀疏度的计算方式和调整方法不同。
在DDS中，稀疏度是根据每个卷积层的实际输入和输出数据情况来计算的，根据计算得到的稀疏度，决定哪些位置使用稀疏算法，哪些位置使用稠密算法，这个过程是动态的，因为每个卷积层的输入和输出数据情况都可能不同。
而DSD则是一种在训练时使用的稀疏算法，其稀疏度是事先设定的，然后根据设定的稀疏度来确定哪些位置使用稀疏算法，哪些位置使用稠密算法。因为稀疏度是事先设定好的，所以DSD的稀疏性是静态的。

这个函数多了参数`struct Plist<ehalf,8> X`和`struct Plist<ehalf,8> DY`，分别表示输入矩阵和梯度矩阵。而`hgemm_blocksparse_64x64x64_nx_dsd`函数没有梯度矩阵这个参数，因为该函数的作用是正向传播，不需要计算梯度。

- `X`：8个输入矩阵，每个矩阵是一个`Plist<ehalf,8>`类型的结构体，表示8个子块的输入矩阵。
- `DY`：8个输出矩阵，每个矩阵是一个`Plist<ehalf,8>`类型的结构体，表示8个子块的输出矩阵。
- `DW`：输出矩阵（8个子块的累加和），类型为`ehalf*`。
- `Lut`：输入矩阵对应的稀疏矩阵LUT（Look Up Table），类型为`const uint2* __restrict__`。
- `Gate`：输入矩阵对应的门控向量，类型为`const float* __restrict__`。
- `params8`：输入矩阵参数的数量，即输入矩阵的数量乘以4（因为每个输入矩阵由4个参数表示），类型为`uint`。
- `N`：输出矩阵的行数，类型为`uint`。
- `C`：输入矩阵的列数（即输出矩阵的行数），类型为`uint`。
- `K`：输入矩阵的行数（即输出矩阵的列数），类型为`uint`。
- `loops`：迭代次数，类型为`uint`。
- `accumulate`：是否累加到输出矩阵（如果为0，则不累加，否则累加），类型为`uint`。

### hgemm_blocksparse_32x32x64_tn_dds

```c++
template <bool N64, bool GATED>
__global__ void __launch_bounds__(128,6) hgemm_blocksparse_32x32x64_tn_dds(
    struct Plist<ehalf,8> X,
    struct Plist<ehalf,8> DY,
    ehalf*                DW,
    const uint2* __restrict__ Lut,
    const float* __restrict__ Gate,
    uint params8, uint N, uint C, uint K, uint loops, uint accumulate)
```

与`hgemm_blocksparse_64x64x64_tn_dds`仅是矩阵大小不同

### hgemm_blocksparse_64x64x64_nx_dsd

```c++
template <uint OP_B, bool N64, bool GATED>
__global__ void __launch_bounds__(256) hgemm_blocksparse_64x64x64_nx_dsd(
    const uint2* __restrict__ Lut,
    const float* __restrict__ Gate,
    const ehalf* __restrict__ X,
    const ehalf* __restrict__ W,
          ehalf*              Y,
    uint* Lock, uint locks, uint N, uint C, uint K, uint blk_a, uint blk_b, uint blk_N)
```

与`hgemm_blocksparse_64x32x32_nx_dsd`仅有矩阵大小不同

### hgemm_blocksparse_64x32x32_nx_dsd

```c++
template <uint OP_A, bool N64, bool GATED>
__global__ void __launch_bounds__(128) hgemm_blocksparse_64x32x32_nx_dsd(
    const uint2* __restrict__ Lut,
    const float* __restrict__ Gate,
    const ehalf* __restrict__ X,
    const ehalf* __restrict__ W,
          ehalf*              Y,
    uint* Lock, uint locks, uint N, uint C, uint K, uint blk_a, uint blk_b, uint blk_N)
```



### hgemm_blocksparse_64x64x64_tn_dds

```c++
template <bool N64, bool GATED>
__global__ void __launch_bounds__(256) hgemm_blocksparse_64x64x64_tn_dds(
    struct Plist<ehalf,8> X,
    struct Plist<ehalf,8> DY,
    ehalf*                DW,
    const uint2* __restrict__ Lut,
    const float* __restrict__ Gate,
    uint params8, uint N, uint C, uint K, uint loops, uint accumulate)
```

同理矩阵大小不一样

### hgemm_blocksparse_32x32x64_tn_dds

```c++
template <bool N64, bool GATED>
__global__ void __launch_bounds__(128) hgemm_blocksparse_32x32x64_tn_dds(
    struct Plist<ehalf,8> X,
    struct Plist<ehalf,8> DY,
    ehalf*                DW,
    const uint2* __restrict__ Lut,
    const float* __restrict__ Gate,
    uint params8, uint N, uint C, uint K, uint loops, uint accumulate)
```

同理矩阵大小不一样

### hgemm_blocksparse_nx_dsd

```c++
cudaError_t hgemm_blocksparse_nx_dsd(const ehalf* X, const ehalf* W, ehalf* Y, bsmm_params* params, uint op)
```



### hgemm_blocksparse_tn_dds

```c++
cudaError_t hgemm_blocksparse_tn_dds(const ehalf* X, const ehalf* E, ehalf* U, bsmm_params* params)
```

同理矩阵大小不一样

### blocksparse_feature_reduce_nc

```c++
template <uint BSIZE, uint NSIZE, uint NORM>
__global__ void __launch_bounds__(256) blocksparse_feature_reduce_nc(
    const struct Plist<ehalf,8> X8, ehalf* Y, uint N, uint C)
```

将输入特征图进行降维，生成一个稀疏的输出特征图

该函数的参数及其含义如下：

- `BSIZE`：每个稠密块（dense block）的大小（以元素数目计算）。
- `NSIZE`：一个稀疏块（sparse block）中包含的稠密块数目。
- `NORM`：标志变量，表示是否需要对输出进行归一化。如果为1，则需要对输出进行归一化。

该函数的输入参数包括：

- `X8`：一个包含8个指向输入特征图数据的指针的结构体。输入特征图的大小为`N` x `C`。
- `Y`：指向输出数据的指针。输出数据的大小为`N` x `ceil(C/BSIZE)`。

### store_64x64x32_tn

```c++
template <bool M64, bool ACCUMULATE>
__device__  __noinline__  void store_64x64x32_tn(float* C, uint loadC, uint M, uint N, uint cy, uint cx, uint i, uint stdC, float scale)
```

将计算结果存储到C矩阵中的，其主要作用是将一个大小为64x64的计算结果矩阵写入到C矩阵中的指定位置，其中每个元素都是32位浮点数类型。

该函数的参数及其含义如下：

- `M64`：一个布尔值，表示是否使用64位存储的数据结构。
- `ACCUMULATE`：一个布尔值，表示是否进行累加操作。
- `C`：一个指向输出矩阵C的指针。
- `loadC`：一个整数，表示输出矩阵C的列数，即每个线程需要处理的数据量。
- `M`：一个整数，表示输出矩阵C的行数。
- `N`：一个整数，表示输入矩阵B的列数。
- `cy`：一个整数，表示当前线程块在输出矩阵C中处理的行起始位置。
- `cx`：一个整数，表示当前线程块在输出矩阵C中处理的列起始位置。
- `i`：一个整数，表示当前线程在线程块中的索引。
- `stdC`：一个整数，表示输出矩阵C的列偏移量，通常为一个较小的数，用于计算在当前线程中要处理的C矩阵位置。
- `scale`：一个浮点数，表示计算结果需要乘以的缩放因子，用于实现数值精度的调整。

### hgemm_64x64x32_tn

```c++
template <bool M64, bool ACCUMULATE>
__global__ void __launch_bounds__(256) hgemm_64x64x32_tn(
    const ehalf* A,
    const ehalf* B,
          float* C,
    uint M, uint N, uint K, uint blk_a, uint blk_b, float scale)
```

64x64x32矩阵乘法
矩阵乘法中第二个矩阵需要被转置

### blocksparse_feature_reduce_nc

```c++
template <uint BSIZE, uint NSIZE, uint NORM>
__global__ void __launch_bounds__(256) blocksparse_feature_reduce_nc(
    const struct Plist<ehalf,8> X8, ehalf* Y, uint N, uint C)
```

用于在GPU上对特征图进行归一化和降维的函数。它的参数及意义如下：

- `BSIZE`：块大小（Block Size），表示每个线程块的大小。
- `NSIZE`：归一化块大小（Normalization Block Size），表示计算归一化的块的大小。
- `NORM`：是否进行归一化的标志，如果设置为1，则进行归一化。

### hgemm_64x64x32_tn

```c++
template <bool M64, bool ACCUMULATE>
__global__ void __launch_bounds__(256) hgemm_64x64x32_tn(
    const ehalf* A,
    const ehalf* B,
          float* C,
    uint M, uint N, uint K, uint blk_a, uint blk_b, float scale)
```

与上面不同的是64位编译的

### BlocksparseFeatureReduceNC

```c++
bool BlocksparseFeatureReduceNC(CUstream stream, ehalf* Y, const struct Plist<ehalf,8>* X8, uint params, uint C, uint N, uint bshift, uint norm_type)
```

这个函数的作用是对输入特征图进行归一化，并将结果存储在Y数组中

- CUstream stream：一个CUDA流，用于在GPU上执行操作。
- ehalf* Y：一个指向存储结果的ehalf类型数组的指针。
- const struct Plist<ehalf,8>* X8：一个指向包含输入特征图的结构体指针。
- uint params：一个无符号整数，用于指定附加参数。
- uint C：一个无符号整数，表示输入特征图的通道数。
- uint N：一个无符号整数，表示输入特征图的数量。
- uint bshift：一个无符号整数，表示块大小的指数。
- uint norm_type：一个无符号整数，表示标准化类型。

### hGemmTN

```c++
bool hGemmTN(CUstream stream, const ehalf* A, const ehalf* B, float* C, uint M, uint N, uint K, uint blk_a, uint blk_b, uint blk_A, uint blk_B, uint accumulate, float scale)
```

计算矩阵乘法的函数，使用CUDA加速。函数的输入是两个矩阵A和B，分别大小为M x K和K x N，并且有一个输出矩阵C，大小为M x N。此外，还有一些其他的参数，如输入和输出矩阵的分块大小、是否进行累加和乘以一个缩放因子等
