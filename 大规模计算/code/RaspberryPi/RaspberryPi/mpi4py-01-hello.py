from mpi4py import MPI
import sys

comm = MPI.COMM_WORLD
name = MPI.Get_processor_name()

sys.stdout.write("Hello World!")
sys.stdout.write("Name: %s, My rank is %d\n" % (name, comm.rank))