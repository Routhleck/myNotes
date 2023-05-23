from timeit import timeit

import brainpy as bp
import brainpy.math as bm
import numpy as np
import jax.numpy as jnp
import matplotlib.pyplot as plt

bm.set_platform('cpu')

def gelu(x):
    sqrt = bm.sqrt(2 / bm.pi)
    cdf = 0.5 * (1.0 + bm.tanh(sqrt * (x + 0.044715 * (x ** 3))))
    y = x * cdf
    return y

x = bm.random.random(100000)
print('python: ', timeit(lambda: gelu(x), number=100))

# jit
gelu_jit = bm.jit(gelu)
print('jit: ', timeit(lambda: gelu_jit(x), number=100))