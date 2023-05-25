import brainpy as bp
import brainpy.math as bm
import numpy as np
import jax.numpy as jnp
import matplotlib.pyplot as plt

bm.set_platform('cpu')

# include_self: 是否有自环
conn = bp.connect.FixedProb(prob=0.2, include_self=False)

print(conn)

conn = conn(pre_size=4, post_size=4)
res = conn.require('conn_mat', 'pre_ids', 'post_ids', 'pre2post', 'pre2syn')

print(res[0])
# pre post: 对应连接的前后神经元
print('pre ids: {}'.format(res[1]))
print('post ids: {}'.format(res[2]))
# pre2post: 两个数组, 第一个为post的序号,
# 第二个为与第i号pre神经元相连的post神经元在第一个数组中的开始和节数位置
print('post ids: {}'.format(res[3][0]))
print('pre ptr: {}'.format(res[3][1]))
# pre2syn: 与pre2post类似, 将post换成syn
print('syn ids: {}'.format(res[4][0]))
print('pre ptr: {}'.format(res[4][1]))
