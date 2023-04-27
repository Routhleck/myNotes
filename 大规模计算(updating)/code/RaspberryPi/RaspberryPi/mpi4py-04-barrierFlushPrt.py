from mpi4py import MPI
from time import sleep
import random

comm = MPI.COMM_WORLD
rank = comm.Get_rank()

if rank == 0:
    sleep(2)
    print("head finished sleeping",  flush=True)

comm.Barrier()

sleep(random.uniform(0, 2))
print(rank, 'finished sleeping ',  flush=True)

comm.Barrier()

if rank == 0:
    print("All done!",  flush=True)