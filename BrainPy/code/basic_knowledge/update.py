import brainpy as bp
import brainpy.math as bm
import numpy as np
import jax.numpy as jnp
import matplotlib.pyplot as plt


class FitzHughNagumo(bp.DynamicalSystem):
    def __init__(self, size, a=0.7, b=0.8, tau=12.5):
        super(FitzHughNagumo, self).__init__()
        # 参数
        self.a = a
        self.b = b
        self.tau = tau
        # 变量
        self.V = bm.Variable(bm.ones(size))
        self.w = bm.Variable(bm.zeros(size))
        self.input = bm.Variable(bm.zeros(size))
        # 积分函数
        self.integral = bp.odeint(bp.JointEq(self.dV, self.dw))

        def dV(self, V, t, w, I):  # V的微分方程
            return V - V * V * V / 3 - w + I

        def dw(self, w, t, V):  # w的微分方程
            return (V + a - b * w) / tau

        def update(self, tdi):  # 更新函数
            self.V.value, self.w.value = self.integral(self.V, self.w, tdi.t, self.input, tdi.dt)
            self.input[:] = 0.
