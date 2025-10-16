from mpi4py import MPI
import numpy as np
import sys

# This is to create default communicator and get the rank
comm = MPI.COMM_WORLD
rank = comm.Get_rank()
cartesian3d = comm.Create_cart(dims=[2, 2, 2], periods=[False, False, False], reorder=False)
coord3d = cartesian3d.Get_coords(rank)


#Create a sub-communicator that is a 2X2 plane
cartesian2d = cartesian3d.Sub(remain_dims=[False,True,True])
rank2d = cartesian2d.Get_rank()
coord2d = cartesian2d.Get_coords(rank2d)
print("In 2D topology, Processor ", rank, "  has coordinates ", coord2d)