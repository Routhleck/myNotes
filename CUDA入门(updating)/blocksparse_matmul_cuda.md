# gemm_blocksparse\_?x?x?x?\_xprop

```c++
template <bool Fprop, typename TW, typename TX, typename TY>
__global__ void __launch_bounds__(32) gemm_blocksparse_08x64x08x8_xprop(
    const  int2* __restrict__ Lut,
    const    TW* __restrict__ W,
    const    TX* __restrict__ X,
    TY* Y, int* Lock, int locks, int N
```

## parameter

| 参数名 | 参数类型                 | 参数说明                                       |
| ------ | ------------------------ | ---------------------------------------------- |
| Lut    | const int2* **restrict** | 二元查找表                                     |
| W      | const TW* **restrict**   | 权重数据                                       |
| X      | const TX* **restrict**   | 输入数据                                       |
| Y      | TY*                      | 输出数据                                       |
| Lock   | int*                     | 同步锁                                         |
| locks  | int                      | 锁的个数                                       |
| N      | int                      | 每个Block的计算单元数（每个计算单元占8个元素） |

## procedure

### 判断Fprop来确定共享内存

在前向传播中，由于卷积核和输入在每个位置进行点乘，因此需要8行8列的数据块。在反向传播中，需要多两行来缓存一些临时变量。因此，在反向传播中需要更多的共享内存。

## 初始化变量

初始化一些变量和偏移量，用于之后的计算

### GEMM（general matrix multiplication）计算

对于每个lut表中的条目，先将对应的W和X从全局内存中加载到共享内存中，然后在共享内存中对它们进行8x64x8的矩阵乘法运算，最后将结果保存到累加寄存器regY中。

### 锁和累加操作

如果当前线程是第一个到达临界区的线程，就先将 `Lock` 标记为 1，表示当前临界区已被占用。然后，所有线程都需要同步以确保 `Count` 能被正确更新。更新 `Count` 的值，并检查当前已经有多少个线程进入了临界区，如果是第一个进入的线程，则直接将结果写入内存。否则，需要先将之前的结果加载到寄存器中，然后累加结果，并将新结果写入内存中。最后，所有线程再次同步以确保数据写入内存后才将锁标记为 0，以允许其他线程进入临界区。

# gemm_blocksparse\_?x?x?x?\_updat

```c++
template <typename TX, typename TE, typename TU>
__global__ void __launch_bounds__(32) gemm_blocksparse_08x64x08x8_updat(
    struct Plist<TX,8> X, struct Plist<TE,8> E,
    const  int2* __restrict__ Lut,
    TU* U,
    int params8, int N, int loops, float alpha, float beta)
```

## parameter

| 参数名称 | 参数类型                 | 参数说明                 |
| -------- | ------------------------ | ------------------------ |
| X        | struct Plist<TX,8>       | 包含8个输入矩阵X的结构体 |
| E        | struct Plist<TE,8>       | 包含8个输入矩阵E的结构体 |
| Lut      | const int2* **restrict** | 包含LUT的指针            |
| U        | TU*                      | 输出矩阵U的指针          |
| params8  | int                      | 表示LUT中的参数个数      |
| N        | int                      | 矩阵U的列数              |
| loops    | int                      | 循环次数                 |
| alpha    | float                    | 矩阵相乘的参数alpha      |
| beta     | float                    | 矩阵相乘的参数beta       |

## procedure

相较于前面的 `xprop` 函数，这个函数涉及到的矩阵乘法的计算顺序是不同的，其计算顺序为 `U = alpha * E * X + beta * U`，即先将稀疏矩阵 `E` 乘上稠密矩阵 `X`，然后将其与稠密矩阵 `U` 相加得到结果。此外，该函数使用了共享内存来提高计算效率。

# BsmmXprop_CN

```c++
template <bool Fprop, CTYPE(T)>
cudaError_t BsmmXprop_CN(const T* X, const T* W, T* Y, bsmm_params* params)
```

## parameter

| 参数名 | 参数类型     | 参数说明                                                     |
| ------ | ------------ | ------------------------------------------------------------ |
| Fprop  | bool         | 一个布尔值，指示此函数是否用于正向传播（forward propagation）。如果值为 true，则表示该函数用于正向传播；如果值为 false，则表示该函数用于反向传播（backward propagation）。 |
| T      | 模板类型     | 输入输出张量的数据类型。可以是 float、double、half 等数据类型。 |
| X      | const T*     | 输入张量的指针，指向存储输入数据的内存地址。                 |
| W      | const T*     | 权重张量的指针，指向存储权重数据的内存地址。                 |
| Y      | T*           | 输出张量的指针，指向存储输出数据的内存地址。                 |
| params | bsmm_params* | 存储矩阵乘法参数的结构体指针，包括输入输出张量的形状、内存布局、卷积参数、卷积方式等信息。 |

## procedure

