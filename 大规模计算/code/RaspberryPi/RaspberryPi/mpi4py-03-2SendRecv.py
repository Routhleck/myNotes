from mpi4py import MPI
import sys

comm = MPI.COMM_WORLD
size = comm.size
rank = comm.rank
name = MPI.Get_processor_name()

if rank == 0:
    sys.stdout.write("Name: %s, My rank is %d\n" % (name, comm.rank))

    shared1 = {'d1': 55, 'd2': 42}
    comm.send(shared1, dest=1, tag=1)

    shared2 = {'d3': 25, 'd4': 22}
    comm.send(shared2, dest=1, tag=2)

if rank == 1:
    sys.stdout.write("Name: %s, My rank is %d\n" % (name, comm.rank))

    receive1 = comm.recv(source=0, tag=1)
    sys.stdout.write("Reveived d1: %d, d2: %d\n" % (receive1['d1'], receive1['d2']))

    receive2 = comm.recv(source=0, tag=2)
    sys.stdout.write("Reveived d3: %d, d4: %d\n" % (receive2['d3'], receive2['d4']))