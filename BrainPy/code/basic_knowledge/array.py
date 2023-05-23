import brainpy as bp
import brainpy.math as bm
import numpy as np
import jax.numpy as jnp
import matplotlib.pyplot as plt

bm_array = bm.array([0, 1, 2, 3, 4, 5])
np_array = np.array([0, 1, 2, 3, 4, 5])
print('bm: ', bm_array)

print('np: ', np_array)

t2 = bm.array([[[0, 1, 2, 3], [1, 2, 3, 4], [4, 5, 6, 7]],
                [[0, 0, 0, 0], [-1, 1, -1, 1], [2, -2, 2, -2]]])
print('t2: ', t2)
print('t2.ndim: {}'.format(t2.ndim))
print('t2.shape: {}'.format(t2.shape))
print('t2.size: {}'.format(t2.size))
print('t2.dtype: {}'.format(t2.dtype))
