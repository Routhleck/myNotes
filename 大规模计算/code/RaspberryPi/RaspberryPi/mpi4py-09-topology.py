from mpi4py import MPI
import numpy as np
import sys

from mpi4py.MPI import Cartcomm

# This is to create default communicator and get the rank
comm = MPI.COMM_WORLD
rank = comm.Get_rank()
cartesian3d = comm.Create_cart(dims=[2, 2, 2], periods=[False, False, False], reorder=False)
coord3d = cartesian3d.Get_coords(rank)
print("In 3D topology, Processor ", rank, " has coordinates ", coord3d)