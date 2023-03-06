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

- [ ] batch_norm_op_gpu.cu
- [ ] batch_norm_op.cc
- [ ] blocksparse_hgemm_cn_64_op_gpu.cu
- [ ] blocksparse_hgemm_cn_128_op_gpu.cu
- [ ] blocksparse_hgemm_nc_op_gpu.cu
- [ ] blocksparse_kernels.cc
- [ ] blocksparse_l2_norm_op_gpu.cu
- [ ] blocksparse_l2_norm_op.cc
- [x] blocksparse_matmul_gated_op_gpu.cu 使用gpu的矩阵乘法的实现，且使用了gate
- [x] blocksparse_matmul_op_gpu.cu 使用gpu的矩阵乘法的实现
- [x] blocksparse_matmul_op.cc 使用cpu的矩阵乘法的实现
- [x] blocksparse_matmul.h 通过blocksparse技术实现矩阵乘法的的header
- [ ] bst_hgemm_op_gpu.cu
- [ ] bst_op.cc
- [ ] bst_sgemm_op_gpu.cu
- [ ] bst_softmax_op_gpu.cu
- [ ] cwise_linear_op_gpu.cu
- [ ] cwise_linear_op.cc
- [ ] edge_bias_op_gpu.cu
- [ ] edge_bias_op.cc
- [ ] embedding_op_gpu.cu
- [ ] embedding_op.cc
- [x] ew_op_gpu.h 逐元素操作以及各种基础操作
- [x] ew_op.cc 逐元素操作以及各种基础操作的cpu实现
- [ ] gpu_hmma.h
- [x] gpu_types.cc gpu_types.h的具体实现
- [x] gpu_types.h 内存对齐、benchmark等
- [ ] layer_norm_cn_op_gpu.cu
- [ ] layer_norm_op.cc
- [ ] lstm_op_gpu.cu
- [ ] lstm_op.cc
- [ ] matmul_op_gpu.cu
- [ ] matmul_op.cc
- [ ] nccl_op.cc
- [ ] optimize_op_gpu.cu
- [ ] optimize_op.cc
- [ ] quantize_op_gpu.cu
- [ ] quantize_op.cc
- [ ] transformer_op_gpu.cu
- [ ] transformer_op.cc

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

### 
