module ifu(nPC_sel,zero,clk,rst,instruction,j_sel,jValue);
  input clk,rst;
  input [1:0]nPC_sel;
  input [31:0]zero;
  input j_sel;
  input [25:0]jValue;
  output [31:0]instruction;
  
  reg [31:0]pc;
  reg [7:0]im[1023:0];
  reg [31:0]pcnew;
  wire [31:0]temp,t0,t1;
  wire [15:0]imm16;
  reg [31:0]extout;
  
  //give instruction a value
  assign instruction={im[pc[9:0]],im[pc[9:0]+1],im[pc[9:0]+2],im[pc[9:0]+3]};
  
  assign imm16=instruction[15:0];
  
  //set extout value
  assign temp={{16{imm16[15]}},imm16};
  
  
  //j condition
  always@(*)begin
    if(j_sel==1)begin
      extout={pc[31:28],jValue[25:0],2'b0};
    end
      if(j_sel==0)begin
      extout=temp[31:0]<<2;
    end
  end
    
  //set pcnew
  assign t0=pc+4;
  assign t1=t0+extout;
  
  always@(*)
  begin
    if(nPC_sel==2'b00)begin
      pcnew=t0;
    end
    else if(nPC_sel==2'b01)begin
      pcnew=t1;
    end
    else if(nPC_sel==2'b10)begin
      if(zero==0)begin
        pcnew=t1;
      end
    else begin
      pcnew=t0;
    end
    end
  end
  
  //reset
  always@(posedge clk,posedge rst)
  begin
    if(rst) pc=32'h0000_3000;
      else if(j_sel==0)pc=pcnew;
      else if(j_sel==1)pc=extout;
  end
  
endmodule
    