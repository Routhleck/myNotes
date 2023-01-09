module mips(clk,rst);
  input clk,rst;
  wire [1:0]ExtOp,ALUctr,nPC_sel;
  wire ALUSrc,MemWr,MemtoReg,RegDst,RegWr,j_sel;
  wire [31:0]instruction;
  
  ctrl CU(.instruction(instruction),.RegDst(RegDst),.RegWr(RegWr),.ExtOp(ExtOp),.nPC_sel(nPC_sel),.ALUctr(ALUctr),.MemtoReg(MemtoReg),.MemWr(MemWr),.ALUSrc(ALUSrc),.j_sel(j_sel));
  mips_dp MAIN(.clk(clk),.rst(rst),.RegDst(RegDst),.RegWr(RegWr),.ExtOp(ExtOp),.nPC_sel(nPC_sel),.ALUctr(ALUctr),.MemtoReg(MemtoReg),.MemWr(MemWr),.ALUSrc(ALUSrc),.j_sel(j_sel),.Instruction(instruction));
endmodule
  
