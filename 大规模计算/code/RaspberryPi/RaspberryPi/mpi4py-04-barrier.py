from mpi4py import MPI
import sys

comm = MPI.COMM_WORLD
size = comm.size
# rank = comm.rank
name = MPI.Get_processor_name()

# sys.stdout.write(comm.Get_rank().__str__()+"\n")

for i in range(5):
    sys.stdout.write("Process: %d: %d \n" % (comm.Get_rank(), i))
    sys.stdout.write("Waiting ...... \n")

comm.Barrier()

for i in range(5, 10, 1):
    sys.stdout.write("Process: %d: %d \n" % (comm.Get_rank(), i))

