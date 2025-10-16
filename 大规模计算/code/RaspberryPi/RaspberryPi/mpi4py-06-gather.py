from mpi4py import MPI
import sys

comm = MPI.COMM_WORLD
size = comm.Get_size()
rank = comm.Get_rank()

if rank == 0:
    data = [x for x in range(0, size)]
    sys.stdout.write("We will be scattering: ")
    sys.stdout.write(" ".join(str(x) for x in data))
    sys.stdout.write("\n")
else:
    data = None

data = comm.scatter(data, root=0)
sys.stdout.write("Rank: %d has data: %d\n" % (rank, data))
data *= data

newData = comm.gather(data, root=0)

if rank == 0:
    sys.stdout.write("We have gathered: ")
    sys.stdout.write(" ".join(str(x) for x in newData))
    sys.stdout.write("\n")

