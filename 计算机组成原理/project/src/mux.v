module mux(a0,a1,op,out);
  input op;
  input [31:0]a0,a1;
  output reg[31:0]out;
  
  always@(*)begin
    if(op) out=a1;
    else out=a0;
    end
  endmodule
