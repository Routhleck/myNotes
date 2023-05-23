import brainpy as bp
import numpy as np
import jax.numpy as jnp
import matplotlib.pyplot as plt


@bp.odeint(method='euler', dt=0.01)
def integral(V, w, t, Iext, a, b, tau):
    dw = (V + a - b * w) / tau
    dV = V - V * V * V / 3 - w + Iext
    return dV, dw

a_param = 0.7
b_param = 0.8
tau_param = 12.5
Iext_param = 1

runner = bp.integrators.IntegratorRunner(
    integral,
    monitors=['V'],
    inits=dict(V=0., w=0.),
    args=dict(a=a_param, b=b_param, tau=tau_param, Iext=Iext_param),
    dt=0.01,
)

runner.run(100.)

plt.plot(runner.mon.ts, runner.mon.V)
plt.show()
