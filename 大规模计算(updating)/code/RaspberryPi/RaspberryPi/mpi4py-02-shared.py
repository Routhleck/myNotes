from mpi4py import MPI
import sys
import time

comm = MPI.COMM_WORLD
size = comm.size
rank = comm.rank
name = MPI.Get_processor_name()

shared = 3.14

if rank == 0:
    data = shared
    comm.send(data, dest=1)
    comm.send(data, dest=2)
    sys.stdout.write("From rank %s, we sent %f\n" %(rank, data))
    time.sleep(5)
elif rank == 1:
    data = comm.recv(source=0)
    sys.stdout.write("On rank %s, we received %f\n" %(rank, data))
elif rank == 2:
    data = comm.recv(source=0)
    sys.stdout.write("On rank %s, we received %f\n" %(rank, data))