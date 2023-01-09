module mips_dp(clk,rst,RegDst,RegWr,ExtOp,nPC_sel,ALUctr,MemtoReg,MemWr,ALUSrc,j_sel,Instruction);
  input clk,rst;
  input [1:0]ExtOp,ALUctr,nPC_sel;
  input ALUSrc,MemWr,MemtoReg,RegDst,RegWr,j_sel;
  wire [31:0]instruction;
  wire [31:0]busA,busB,busW,Mux_ALUSrc_out,imm32,Alu_out,Addr,Data_in,Data_out,jValue;
  wire [31:0]zero;
  wire [4:0]rw;
  
  output [31:0]Instruction;
  assign Instruction[31:0]=instruction[31:0];
  
  //connect all compoenet
  ifu IFU(.nPC_sel(nPC_sel),.zero(zero),.clk(clk),.rst(rst),.instruction(instruction),.j_sel(j_sel),.jValue(jValue));
  ext EXT(.imm16(instruction[15:0]),.imm32(imm32),.ExtOp(ExtOp)); 
  alu ALU(.busA(busA),.busB(Mux_ALUSrc_out),.ALUctr(ALUctr),.zero(zero),.Alu_out(Alu_out),.Addr(Addr));
  mux_RegDst MUX_RegDst(.a0(instruction[20:16]),.a1(instruction[15:11]),.rw(rw),.RegDst(RegDst));
  mux MUX_ALUSrc(.a0(busB),.a1(imm32),.op(ALUSrc),.out(Mux_ALUSrc_out));
  mux MUX_MemtoReg(.a0(Alu_out),.a1(Data_out),.op(MemtoReg),.out(busW));
  gpr GPR(.RegWr(RegWr),.ra(instruction[25:21]),.rb(instruction[20:16]),.rw(rw),.busW(busW),.clk(clk),.rst(rst),.busA(busA),.busB(busB),.Data_in(Data_in));
  dm DM(.Data_in(Data_in),.MemWr(MemWr),.Addr(Addr),.clk(clk),.rst(rst),.Data_out(Data_out));
  
endmodule
