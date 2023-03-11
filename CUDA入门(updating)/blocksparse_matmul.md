# blocksparse_matmul.h

定义了矩阵乘法的一些函数和类，可以看出这里定义了两种不同的矩阵乘法方式，一种是使用CUDA实现的，另一种是使用CPU实现的。

## GPU的cuda实现

1. `cudaError_t BsmmXprop_CN(const TX* X, const TW* W, TY* Y, bsmm_params* params)`：CUDA 稀疏矩阵与密集矩阵的前向传播计算。
2. `cudaError_t BsmmUpdat_CN(const TX* X, const TE* E, TU* U, bsmm_params* params)`：CUDA 稀疏矩阵与密集矩阵的梯度更新计算。
3. `cudaError_t BsmmGatedXprop_CN(const TX* X, const TW* W, TY* Y, bsmm_params* params)`：CUDA 带门控的稀疏矩阵与密集矩阵的前向传播计算。
4. `cudaError_t BsmmGatedUpdat_CN(const TX* X, const TE* E, TU* U, bsmm_params* params)`：CUDA 带门控的稀疏矩阵与密集矩阵的梯度更新计算。
5. `cudaError_t hgemm_blocksparse_xn_sdd(const ehalf* X, const ehalf* W, ehalf* Y, bsmm_params* params, uint op)`：CUDA 半精度稀疏矩阵与密集矩阵的计算。
6. `cudaError_t hgemm_blocksparse_xn_sdd(const bhalf* X, const bhalf* W, bhalf* Y, bsmm_params* params, uint op)`：CUDA 窄半精度稀疏矩阵与密集矩阵的计算。
7. `cudaError_t hgemm_blocksparse_xn_sdd(const float* X, const float* W, float* Y, bsmm_params* params, uint op)`：CUDA 单精度稀疏矩阵与密集矩阵的计算。
8. `cudaError_t hgemm_blocksparse_nt_dds(const ehalf* X, const ehalf* E, ehalf* U, bsmm_params* params)`：CUDA 半精度稀疏矩阵与密集矩阵的梯度更新计算。
9. `cudaError_t hgemm_blocksparse_nt_dds(const bhalf* X, const bhalf* E, bhalf* U, bsmm_params* params)`：CUDA 窄半精度稀疏矩阵与密集矩阵的梯度更新计算。
10. `cudaError_t hgemm_blocksparse_nt_dds(const float* X, const float* E, float* U, bsmm_params* params)`：CUDA 单精度稀疏矩阵与密集矩阵。

## 类及其方法

1. `BlocksparseMatmul`：这是一个抽象基类，定义了稀疏矩阵乘法的接口函数`Compute`，以及一个存储矩阵乘法参数的指针`params_`和一个整数`major_`。
2. `GetCountSMsVersion`：这是一个函数，用于获取当前设备的SM架构版本号。
3. `BlocksparseMatmulFprop_CN`：这是一个继承自`BlocksparseMatmul`的类，用于进行前向传播的稀疏矩阵乘法计算。它重写了`Compute`函数，根据当前设备的SM架构版本号和数据类型，选择不同的计算方式。
4. `BlocksparseMatmulBprop_CN`：这是一个继承自`BlocksparseMatmul`的类，用于进行反向传播的稀疏矩阵乘法计算。它重写了`Compute`函数，根据当前设备的SM架构版本号和数据类型，选择不同的计算方式。
5. `BlocksparseMatmulUpdat_CN`：这是一个继承自`BlocksparseMatmul`的类，用于进行更新的稀疏矩阵乘法计算。它重写了`Compute`函数，根据当前设备的SM架构版本号和数据类型，选择不同的计算方式。
6. `GetKernel`：这是一个函数，用于获取CUDA kernel函数的指针。
7. `BlocksparseMatmul_NC`：这是一个抽象基类，用于进行不规则稀疏矩阵乘法计算。它继承自`BlocksparseMatmul`，定义了一个存储CUDA kernel函数的指针`kernel_`，一个存储CUDA kernel函数名字的字符串`kernel_name_`，以及一些计算时需要用到的参数。
8. `BlocksparseMatmulFprop_NC`：这是一个继承自`BlocksparseMatmul_NC`的类，用于进行前向传播的不规则稀疏矩阵乘法计算。它重写了`Compute`函数，调用了`Xprop_Kernel`函数来完成计算。
9. `BlocksparseMatmulBprop_NC`：这是一个继承自`BlocksparseMatmul_NC`的类，用于进行反向传播的不规则稀疏矩阵乘法计算。它重写了`Compute`函数，调用了`Xprop_Kernel`函数来完成计算。
10. `BlocksparseMatmulUpdat_NC`：这是一个继承自`BlocksparseMatmul_NC`的类，用于进行更新的不规则稀疏矩阵乘法计算。它重写了`Compute`函数，调用了`Xprop_Kernel`函数来

# blocksparse_matmul_op.cc



## 类及其实现

 C++ 模板类 `BlocksparseMatmulOp`，继承自 `OpKernel`。它是 TensorFlow 中用于实现稀疏矩阵乘法的一个操作。以下是代码中出现的函数及其作用：

- `OpKernelConstruction::GetAttr`：从 `OpKernelConstruction` 中获取操作属性值。
- `OpKernelContext::allocate_output`：为输出 Tensor 分配内存空间。
- `OpKernelContext::input`：获取输入 Tensor。
- `OpKernelContext::input_list`：获取输入 Tensor 列表。
- `CUDAStream::cuda_stream`：获取 CUDA 流。
- `GetCountSMsVersion`：获取 GPU 设备的计算能力和 SM 数量。
- `CEIL_DIV`：对两个整数做除法运算，向上取整。
- `ClosestDivisorTo4`：获取不小于指定值的最小 4 的倍数的因子。
- `BsmmXprop_CN`：对输入矩阵和稀疏权重矩阵进行前向计算。
- `BsmmUpdat_CN`：对输入矩阵和梯度矩阵进行反向计算。
- `hgemm_blocksparse_xn_64_sdd`、`hgemm_blocksparse_xn_128_sdd`、`hgemm_blocksparse_nx_dsd`、`hgemm_blocksparse_nt_64_dds`、`hgemm_blocksparse_nt_128_dds`、`hgemm_blocksparse_tn_dds`：使用 CUDA 进行稀疏矩阵乘法计算，其中 `hgemm` 表示使用半精度浮点数计算。