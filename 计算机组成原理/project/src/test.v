module test;
  reg clk,rst;
  mips launch(.clk(clk),.rst(rst));
  
  initial begin
    rst=0;
    clk=1;
    #1 rst=1;
    #2 rst=0;
    $readmemh("code.txt",launch.MAIN.IFU.im);
  end
  
  always
  #30 clk=~clk;
endmodule
