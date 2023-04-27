from mpi4py import MPI
import sys

comm = MPI.COMM_WORLD
rank = comm.Get_rank()

if rank == 0:
    data = {'a': 7, 'b':3.14}
    req = comm.isend(data, dest = 1, tag = 11)
    req.wait()
    sys.stdout.write("Sent %d and %f from rank 0.\n"
                     % (data['a'], data['b']))
elif rank == 1:
    req = comm.irecv(source = 0, tag = 11)
    data = req.wait()
    sys.stdout.write("Received %d and %f at rank 1.\n"
                     % (data['a'], data['b']))