module mux_RegDst(a1,a0,rw,RegDst);
  input[4:0]a1,a0;
  input RegDst;
  output reg[4:0]rw;

always@(*)begin
  if(RegDst)rw=a1;
  else rw=a0;
  end
endmodule