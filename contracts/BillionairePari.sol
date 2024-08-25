// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;


contract BillionairePari  
{
   event WinEvent (address indexed adr, uint16 ind, uint sum);
   event LoseEvent (address indexed adr, uint16 ind);

   struct Bid{
      address openAdr;
      uint val;   
      uint commission; 
      bool enabled;  
   }

     Bid[] bids ;
     address owner;
     uint commission;

   modifier onlyOwner {
      require(msg.sender == owner,"Only owner!");
      _;
   }

   modifier noContract(address adr) {
      require(adr.code.length == 0,"No contract.");
      _;
   }

   modifier bidExists(uint16 ind) {
      require(bids.length>ind,"Bid not found.");
      _;
   }

   constructor() {
      owner = msg.sender;
      commission = 0;
   }  

    function getBidsCount() external view returns(uint){
       return bids.length;
   }

   function getBid(uint16 ind) external view bidExists(ind) returns(Bid memory){
       return bids[ind];
   }

   function getCurrentSum() external view onlyOwner returns(uint){
       return commission;
   }

   function addBid(uint val, uint commiss) external onlyOwner{
       Bid storage bid = bids.push();
       bid.val = val;
       bid.commission = commiss;
       bid.enabled = true;
       bid.openAdr = address(0);
   }

   function changeBid(uint16 ind, uint val, uint commiss, bool enable) external onlyOwner bidExists(ind) {
       Bid storage bid = bids[ind];
       require(bid.openAdr == address(0),"Bid is open.");
       bid.val = val;
       bid.commission = commiss;
       bid.enabled = enable;
      // bid.openAdr = address(0);
   }

 function setBid(uint16 ind) external payable bidExists(ind) noContract(msg.sender){
      Bid storage bid = bids[ind];
      require(bid.enabled,"Bid disabled!");
      require(msg.value == (bid.commission+bid.val),"Sum is invalid.");
      commission+=bid.commission;
      if (bid.openAdr == address(0)){
         bid.openAdr =  msg.sender;
      } else {
         if (isFirstWin()){
             payable(bid.openAdr).transfer(bid.val*2);
             emit WinEvent(bid.openAdr, ind, bid.val*2);
             emit LoseEvent(msg.sender, ind);
         } else {
             payable(msg.sender).transfer(bid.val*2);
             emit WinEvent(msg.sender, ind, bid.val*2);
             emit LoseEvent(bid.openAdr, ind);
         }
         bid.openAdr = address(0);
      }

   }

   function withdraw(uint16 ind) external  bidExists(ind){
       Bid storage bid = bids[ind];
       require(bid.enabled,"Bid disabled!");
       require(bid.openAdr==msg.sender,"This is not your bet!");
        bid.openAdr = address(0);
        payable(msg.sender).transfer(bid.val); 

   }

     function random() private view returns (uint) {  
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, block.number)));        
    }
   
   function isFirstWin() private view returns (bool){
       return (random()%2) == 1;
   }

   function ownerTransfer() external onlyOwner {
       payable(owner).transfer(commission);
       commission = 0;
   }

}