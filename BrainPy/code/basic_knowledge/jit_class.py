from timeit import timeit

import brainpy as bp
import brainpy.math as bm
import numpy as np
import jax.numpy as jnp
import matplotlib.pyplot as plt

class LogisticRegression(bp.Base):
    def __init__(self, dimension):
        super(LogisticRegression, self).__init__()
        # 参数定义
        self.dimension = dimension

        # 动态变量定义
        self.w = bm.Variable(2.0 * bm.ones(dimension) - 1.3)

    def __call__(self, X, Y):
        u = bm.dot(((1.0 / (1.0 + bm.exp(-Y * bm.dot(X, self.w))) - 1.0) * Y), X)
        self.w.value = self.w - u # 就地更新动态变量

import time

def benchmark(model, points, labels, num_iter=30, name=''):
    t0 = time.time()
    for i in range(num_iter):
        model(points, labels)

    print(f'{name} time: {time.time() - t0} s')

num_dim, num_points = 10, 20000000
points = bm.random.random((num_points, num_dim))
labels = bm.random.random(num_points)

lr1 = LogisticRegression(num_dim)
benchmark(lr1, points, labels, name='Logistic Regression (without jit)')

lr2 = LogisticRegression(num_dim)
lr2 = bm.jit(lr2)
benchmark(lr2, points, labels, name='Logistic Regression (with jit)')