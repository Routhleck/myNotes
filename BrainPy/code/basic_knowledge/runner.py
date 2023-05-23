import brainpy as bp
import brainpy.math as bm
import numpy as np
import jax.numpy as jnp
import matplotlib.pyplot as plt

bm.set_platform('cpu')

class EINet(bp.Network):
    def __init__(self, scale:1.0, method='exp_auto'):
        super(EINet, self).__init__()

        num_exc = int(3200 * scale)
        num_inh = int(800 * scale)

        pars = dict(V_rest=-60., V_th=-50., V_reset=-60., tau=20., tau_ref=5.)
        self.E = bp.neurons.LIF(num_exc, **pars, method=method)
        self.I = bp.neurons.LIF(num_inh, **pars, method=method)
        self.E.V[:] = bm.random.random(num_exc) * 2 - 55.
        self.I.V[:] = bm.random.random(num_inh) * 2 - 55.

        prob = 0.1
        we = 0.6 / scale / (prob / 0.02)**2
        wi = 6.7 / scale / (prob / 0.02)**2
        self.E2E = bp.dyn.ExpCOBA(self.E, self.E, bp.conn.FixedProb(prob),
                                     E=0., g_max=we, tau=5., method=method)
        self.E2I = bp.dyn.ExpCOBA(self.E, self.I, bp.conn.FixedProb(prob),
                                        E=0., g_max=we, tau=5., method=method)
        self.I2E = bp.dyn.ExpCOBA(self.I, self.E, bp.conn.FixedProb(prob),
                                        E=-80., g_max=wi, tau=5., method=method)
        self.I2I = bp.dyn.ExpCOBA(self.I, self.I, bp.conn.FixedProb(prob),
                                        E=-80., g_max=wi, tau=5., method=method)



net = EINet(scale=1., method='exp_auto')

runner = bp.DSRunner(
    net,
    monitors={'E.spike': net.E.spike},
    inputs=[(net.E.input, 20.), (net.I.input, 20.)]
)

runner.run(1000.)

bp.visualize.raster_plot(runner.mon.ts, runner.mon['E.spike'], show=True)