module ext(imm16,imm32,ExtOp);
  input [15:0]imm16;
  input [1:0]ExtOp;
  output reg[31:0]imm32;
  
  //set ZERO,SIGN
  parameter ZERO=2'b00;
  parameter SIGN=2'b01;
  parameter LUI=2'b10;
  
  //two conditions
  always@(*)begin
    case(ExtOp)
      ZERO:imm32={16'b0,imm16};
      SIGN:imm32={{16{imm16[15]}},imm16};
      LUI:imm32={imm16,16'b0};
    endcase
  end
endmodule
