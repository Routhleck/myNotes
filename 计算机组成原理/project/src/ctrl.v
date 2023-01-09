module ctrl(instruction,RegDst,RegWr,ExtOp,nPC_sel,ALUctr,MemtoReg,MemWr,ALUSrc,j_sel);
  input [31:0]instruction;
  output reg [1:0]ExtOp,ALUctr,nPC_sel;
  output reg RegDst,RegWr,MemtoReg,MemWr,ALUSrc,j_sel;
  
  initial begin
    nPC_sel=0;
    RegDst=0;
    RegWr=0;
    ExtOp=0;
    nPC_sel=0;
    ALUctr=0;
    MemtoReg=0;
    MemWr=0;
    ALUSrc=0;
    j_sel=0;
end

always@(*)begin
  //R-type
  if(instruction[31:26]==6'b000000)
    begin
      //ADDU
      if(instruction[5:0]==6'b100001)
        begin
          nPC_sel=2'b00;
          RegDst=1'b1;
          RegWr=1'b1;
          ExtOp=2'b00;
          ALUSrc=1'b0;
          ALUctr=2'b00;
          MemWr=1'b0;
          MemtoReg=1'b0;
          j_sel=1'b0;
      end
      //SUBU
      else if(instruction[5:0]==6'b100011)
        begin
          nPC_sel=2'b00;
          RegDst=1'b1;
          RegWr=1'b1;
          ExtOp=2'b00;
          ALUSrc=1'b0;
          ALUctr=2'b01;
          MemWr=1'b0;
          MemtoReg=1'b0;
          j_sel=1'b0;
        end
      end
      //ORI
    else if(instruction[31:26]==6'b001101)
      begin
        nPC_sel=2'b00;
          RegDst=1'b0;
          RegWr=1'b1;
          ExtOp=2'b00;
          ALUSrc=1'b1;
          ALUctr=2'b10;
          MemWr=1'b0;
          MemtoReg=1'b0;
          j_sel=1'b0;
        end
      //LW
    else if(instruction[31:26]==6'b100011)
      begin
        nPC_sel=2'b00;
          RegDst=1'b0;
          RegWr=1'b1;
          ExtOp=2'b01;
          ALUSrc=1'b1;
          ALUctr=2'b00;
          MemWr=1'b0;
          MemtoReg=1'b1;
          j_sel=1'b0;
        end
        //SW
      else if(instruction[31:26]==6'b101011)
        begin
          nPC_sel=2'b00;
          RegDst=1'b0;
          RegWr=1'b0;
          ExtOp=2'b01;
          ALUSrc=1'b1;
          ALUctr=2'b00;
          MemWr=1'b1;
          MemtoReg=1'b0;
          j_sel=1'b0;
        end
        //BEQ
      else if(instruction[31:26]==6'b000100)
        begin
          nPC_sel=2'b10;
          RegDst=1'b0;
          RegWr=1'b0;
          ExtOp=2'b01;
          ALUSrc=1'b0;
          ALUctr=2'b01;
          MemWr=1'b0;
          MemtoReg=1'b0;
          j_sel=1'b0;
        end
        //LUI
      else if(instruction[31:26]==6'b001111)
        begin
          nPC_sel=2'b00;
          RegDst=1'b0;
          RegWr=1'b1;
          ExtOp=2'b10;
          ALUSrc=1'b1;
          ALUctr=2'b10;
          MemWr=1'b0;
          MemtoReg=1'b0;
          j_sel=1'b0;
      end
    //J
     else if(instruction[31:26]==6'b000010)
       begin
          nPC_sel=2'b01;
          RegDst=1'b0;
          RegWr=1'b0;
          ExtOp=2'b01;
          ALUSrc=1'b0;
          ALUctr=2'b01;
          MemWr=1'b0;
          MemtoReg=1'b1;
          j_sel=1'b1;
    end
  end
    endmodule