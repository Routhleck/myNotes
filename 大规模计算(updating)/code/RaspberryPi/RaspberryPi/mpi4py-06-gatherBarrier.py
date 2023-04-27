from mpi4py import MPI
import sys

comm = MPI.COMM_WORLD
size = comm.Get_size()
rank = comm.Get_rank()

if rank == 0:
    data = [x for x in range(0, size)]
    print("Rank %d will be scattering: " % rank, flush=True)
    print(" ".join(str(x) for x in data), flush=True)
    # print("\n", flush=True)
else:
    data = None

data = comm.scatter(data, root=0)
# print("Rank %d has data %d\n" % (rank, data), flush=True)
print("Rank %d has data %d" % (rank, data), flush=True)
data *= data

newData = comm.gather(data, root=0)

if rank == 0:
    print("Rank %d will be scattering: " % rank, flush=True)
    print(" ".join(str(x) for x in newData), flush=True)
    # print("\n", flush=True)
