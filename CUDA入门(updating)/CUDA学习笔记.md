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

## CUDA & C++

- [ ] batch_norm_op_gpu.cc
- [ ] batch_norm_op.cc
- [ ] blocksparse_hgemm_cn_64_op_gpu.cu
- [ ] blocksparse_hgemm_cn_128_op_gpu.cu
- [ ] blocksparse_hgemm_nc_op_gpu.cu
- [ ] blocksparse_kernels.cc
- [ ] blocksparse_l2_norm_op_gpu.cu
- [ ] blocksparse_l2_norm_op.cc
- [ ] blocksparse_matmul_gated_op_gpu.cu
- [ ] blocksparse_matmul_op_gpu.cu
- [ ] blocksparse_matmul.h
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
- [ ] ew_op_gpu.h
- [ ] ew_op.cc
- [ ] gpu_hmma.h
- [ ] gpu_types.cc
- [ ] gpu_types.h
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

### gpu_types.h

```c++
typedef struct __align__(2) ehalf {
    __device__ __forceinline__ ehalf() {}
    __device__ __forceinline__ ehalf(ushort v) : x(v) {}
    ushort x;
} ehalf;
```

