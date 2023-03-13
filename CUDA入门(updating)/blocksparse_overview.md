# What is it

在一个稀疏矩阵中，计算出来其一个mask，这个mask每个weight对应的是原先matrix的8×8或者32×32或者更多的小矩阵，在使用这个矩阵进行下一部操作的时候，就直接看这个mask的值，mask的weight值是0或者1，如果为0，那么其对应小矩阵块就不需要计算，只用计算weight为1的矩阵块就行了
具体来说，Blocksparse主要是利用稀疏矩阵中的一些特定结构，如Block Diagonal (BD)、Block Sparse (BS)和Block Diagonal Sparse (BDS)等，来划分矩阵为若干个子矩阵块，并且对于每个子矩阵块，分配一个计算mask，标记这个子矩阵块内哪些位置的元素需要计算，哪些位置的元素可以被忽略。

> 例如，在Block Diagonal结构中，稀疏矩阵可以划分成若干个对角块，每个对角块都是一个稠密的小矩阵。在计算矩阵乘法时，只需要对每个对角块进行乘法运算，其他非对角元素可以被忽略。因此，我们可以分配一个计算mask，用于指示哪些元素需要计算，哪些可以被忽略。
>
> 在Block Sparse结构中，稀疏矩阵可以划分成若干个小的稠密块。同样，我们可以为每个小块分配一个计算mask，用于指示哪些元素需要计算，哪些可以被忽略。
>
> 在Block Diagonal Sparse结构中，则是将Block Diagonal和Block Sparse结构相结合，稀疏矩阵被划分成若干个对角块和稠密块。同样，我们可以为每个子矩阵块分配一个计算mask，用于指示哪些元素需要计算，哪些可以被忽略。

# When is it helpful

Blocksparse主要适用于具有稀疏结构的矩阵，而这种稀疏结构通常存在于一些特定类型的神经网络层中，因此在这些层中使用Blocksparse可以获得更好的效果。

- Fully Connection：在全连接层中，矩阵通常是高度稠密的，但可以利用Blocksparse中的Block Diagonal结构来对矩阵进行划分，从而可以减少大量的计算。这是因为在全连接层中，输入和输出通常具有很高的维度，但是它们之间的连接却是非常稀疏的。
- CNN：在卷积神经网络中，卷积操作可以看作是一种特殊的矩阵乘法操作。因此，Blocksparse可以利用与全连接层类似的Block Diagonal和Block Sparse结构来减少卷积操作的计算量。此外，在卷积层中，通常使用重叠卷积和步长卷积来减小输出尺寸，这导致了矩阵具有更多的Block Sparse结构。
- RNN：在循环神经网络中，每个时间步都会涉及到一个矩阵乘法操作。这些矩阵通常是非常大的，但是它们之间的连接却很稀疏。因此，可以利用Block Sparse结构来减少计算量。
- Small world networks：在小世界网络中，每个节点都与其它节点连接。但是，这些连接通常具有非常稀疏的结构，这可以利用Blocksparse来减少计算量。
- Large matrix + larger blocks：在大矩阵中，每个Block所涉及的计算量会比较大，但是这也意味着这些Block之间的连接相对稀疏。因此，使用Blocksparse可以在减少计算量的同时，减小内存占用。

# How is it used

两个重要组件为一个块稀疏矩阵乘法核和一个块稀疏卷积核，都支持任意块大小，并针对8×8、16×16和32×32块大小进行了优化。

还包括一些高效的辅助操作，用于常见操作，如激活的层和批量归一化，权重的L2归一化，dropout、激活函数和逐元素数学。由于稀疏网络允许比稠密网络更大的激活张量，因此在GPU硬件上，操作往往是带宽受限的而不是计算受限的。降低精度格式可以显著降低带宽，有助于缓解这个问题。为此，内核支持fp16以及在积极开发中的其他紧凑格式，如bfloat16。

## 矩阵乘法

具体来说，矩阵乘法的过程可以分为以下步骤：

1.将大的输入矩阵划分为小的矩阵块。这些矩阵块的大小通常为 8*8、16*16或者 32*32，这些大小的矩阵块都适用于 Blocksparse 的加速方法。

2.对于每个小矩阵块，生成对应的计算mask。计算mask是一个二元数组，其每个元素对应于小矩阵块中的一个权重。如果计算mask的元素为1，那么对应的权重需要被计算，否则不需要。

3.对于每个小矩阵块，将其与一个稠密的权重矩阵相乘。由于使用了计算mask，所以只需要计算那些对应的权重被标记为1的元素。

4.对于每个小矩阵块的乘积，将其相加以获得最终的结果矩阵。‘

矩阵乘法用得到主要的函数声明

具体操作就是根据已有的输入参数来进行一系列判断来确定使用对应的核函数来进行计算

`BsmmXprop_CN和BsmmUpdat_CN`——执行Blocksparse的矩阵乘法(前向传播和反向传播)。
`BsmmGatedXprop_CN和BsmmGatedUpdat_CN`——执行带有门控单元的Blocksparse矩阵乘法。`hgemm_blocksparse_xn_64_sdd、hgemm_blocksparse_xn_128_sdd和hgemm_blocksparse_nx_dsd等函数`
不同数据类型（ehalf、bhalf、float）和块大小（64x64、128x128等）的Blocksparse矩阵乘法的实现。`hgemm_blocksparse_nt_64_dds、hgemm_blocksparse_nt_128_dds和hgemm_blocksparse_tn_dds等函数`，是不同数据类型和块大小的Blocksparse矩阵反向传播的实现。

# Compare

做了与cuBLAS的对比，其他的方法还是要更差劲
在sparsity小的时候有许多不必要的操作，性能比较一般，但随着sparsity的增大，speed-up factor接近1/1-s/100
还比较了用cuBLAS的小序列矩阵乘法和使用cuSPARSE库的矩阵乘法，结果比之前cuBLAS更差



对于Small world LSTM，比larger minibatch size相比，更能减少缓存扩散，与Bconnection接近
更稀疏的矩阵对性能影响更强