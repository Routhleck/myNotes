# initialize

## base

提供三种基类

### Initializer

Base Initialization Class

重写`__call__`和`__repr__`方法

```python
class Initializer(abc.ABC):
  """Base Initialization Class."""

  @abc.abstractmethod
  def __call__(self, shape, dtype=None):
    raise NotImplementedError

  def __repr__(self):
    return self.__class__.__name__
```

### _InterlayerInitializer

Initializers的超类，用于初始化神经网络不同层之间权重的超类。

```python
class _InterLayerInitializer(Initializer):
  """The superclass of Initializers that initialize the weights between two layers."""
  pass
```

### _IntraLayerInitializer

Initializers的超类，用于初始化神经网络同一层内权重的超类。

```python
class _IntraLayerInitializer(Initializer):
  """The superclass of Initializers that initialize the weights within a layer."""
  pass
```

## decay_inits

根据神经元的相对位置计算权重？

### GaussianDecay

继承自`_IntraLayerInitializer`，是用于同一层的网络内权重的生成，权重按照高斯衰减函数进行衰减
$$
w(i, j) = w_{max} \cdot \exp(-\frac{\sum_{k=1}^n |v_k^i - v_k^j|^2 }{2\sigma^2})
$$
权重随着神经元之间的距离增加而减小

math:`v_k^i` is the i-th neuron's encoded value at dimension k.

### DOGDecay

继承自`_IntraLayerInitializer`，与`GaussianDecay`类似，用于同一层的网络内权重的生成，构建的是差分高斯（Difference-Of-Gaussian，DOG）连接模式
$$
w(i, j) = w_{max}^+ \cdot \exp(-\frac{\sum_{k=1}^n |v_k^i - v_k^j|^2}{2\sigma_+^2}) -
                w_{max}^- \cdot \exp(-\frac{\sum_{k=1}^n |v_k^i - v_k^j|^2}{2\sigma_-^2})
$$
应用正高斯函数和负高斯函数之间的差异

## random_inits

随机的生成器

### Normal

继承自`_InterLayerInitializer`，使用正态分布来生成不同层之间的权重值

### Gamma

继承自`_InterLayerInitializer`，使用 Gamma 分布来生成不同层之间的权重值

### Exponential

继承自`_InterLayerInitializer`，使用指数分布来生成不同层之间的权重值

### Uniform

继承自`_InterLayerInitializer`，使用均匀分布来生成不同层之间的权重值

### VarianceScaling

继承自`_InterLayerInitializer`，使用方差缩放来生成不同层之间的权重值

根据输入和输出维度来缩放权重的方差，以达到适当的初始范围

### KaimingUniform

继承自`VarianceScaling`, 基于 `VarianceScaling` 初始化器的一种特殊类型，针对具有 ReLU 激活函数的网络层设计的一种权重初始化策略

### KaimingNormal

继承自`VarianceScaling`, 与 `KaimingUniform` 类不同，`KaimingNormal` 类使用截断正态分布作为权重的初始化分布，而不是均匀分布。这是通过将 `distribution` 参数设置为 `'truncated_normal'` 来实现的。正态分布对于处理非线性的激活函数更为合适

> **想要截断范围的正态分布的意图**
> 限制变量的取值范围：截断正态分布可以限制变量的取值范围，以使得分布更符合实际情况。在某些领域中，如金融领域中的股票价格，截断正态分布可以更好地描述实际情况，因为它将对变量的最大值和最小值进行限制。
>
> 减少异常值的影响：在实际数据中，存在一些极端值或异常值，这些值可能会对分析结果产生不良影响。通过截断正态分布，可以将这些异常值排除在分布范围之外，从而减少它们对分析结果的影响。
>
> 更好的模型拟合：在某些情况下，正态分布可能不能很好地拟合实际数据。通过截断正态分布，可以改善模型的拟合效果，提高拟合的准确性。【例如：想要去拟合数据，根据观察原始数据分布在1的左右，在使用GAN生成数据的时候发现拟合不到，那么猜想可能是我生成虚假数据的时候范围有问题，所以想要限制范围的正态分布】
>
> 更好的推断和预测：截断正态分布可以提高推断和预测的精度。在一些应用中，如概率统计、机器学习等领域，截断正态分布被广泛应用于数据建模和预测中。

### XavierUniform

继承自`VarianceScaling`,  基于 `VarianceScaling` 初始化器的一种特殊类型，采用均匀分布作为权重的初始化分布，以实现 

Xavier 初始化是一种广泛使用的权重初始化方法，旨在提供合适的权重范围，以促进网络的学习和收敛。它通过根据输入和输出维度的数量来计算适当的缩放因子

> 正如诸多参考资料[[1\]](https://zhuanlan.zhihu.com/p/458373836#ref_1)指出的那样，xavier初始化只适用于关于0对称、呈线性的激活函数，比如 *sigmoid、tanh、softsign* 等。比如，对于ReLU激活函数，可以采用 Kaiming 初始化[[2\]](https://zhuanlan.zhihu.com/p/458373836#ref_2)、He 初始化[[7\]](https://zhuanlan.zhihu.com/p/458373836#ref_7)或 采用 Batch Normalization（见资料[[7\]](https://zhuanlan.zhihu.com/p/458373836#ref_7)）

### XavierNormal

继承自`VarianceScaling`, 与 `XavierUniform` 初始化器不同，`XavierNormal` 初始化器使用截断正态分布作为权重的初始化分布

### LecunUniform

继承自`VarianceScaling`, 与其他 `VarianceScaling` 初始化器相比，`LecunUniform` 初始化器在初始化权重时采用了特定的缩放因子和模式。权重的初始化将使用均匀分布

### LecunNormal

继承自`VarianceScaling`, 与 `LecunUniform` 初始化器相比，`LecunNormal` 初始化器在权重初始化时采用了截断正态分布

### Orthogonal

继承自`_InterLayerInitializer`，生成均匀分布的正交矩阵的初始化器。它生成的矩阵具有正交的行或列，具体取决于形状中较小的一边。

### DeltaOrthogonal

继承自`_InterLayerInitializer`，与 `Orthogonal` 初始化器不同的是，`DeltaOrthogonal` 初始化器仅适用于形状为 3D、4D 或 5D 的权重矩阵。

### other function

#### calculate_gain

根据给定的非线性函数推荐返回相应的增益值

#### _format_shape

确保返回的形状参数符合预期的格式要求，统一处理不同形状的情况

#### _compute_fans

根据给定的形状参数计算神经网络层的扇入和扇出

## regular_inits

常规的生成器

### ZeroInit

继承自`_InterLayerInitializer`，初始化权值均为0

### Constant

继承自`_InterLayerInitializer`，初始化权值为给定常量

### OneInit

继承自`Constant`, 初始化权值均为1

### Identity

继承自`_InterLayerInitializer`，生成指定形状的单位矩阵作为权重的初始值