// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Billionaire  is Initializable
{
  int16 constant maxSteps = 2;
  uint constant parentPercent = 74;
  uint constant ref1Percent = 13;
  uint constant ref2Percent = 8;
  uint constant ref3Percent = 5;

  struct Street { 
        uint32 freeLeft;
        uint32 freeRight;
        uint price;
        uint openDate;
        uint openWLDate;
     
        mapping(uint32 => uint32) points;
        mapping(uint32 => bool) wl;
    }
  struct Account {
      address adr;
       uint32 parentRef;
      mapping(uint16 => AccStreet) streets;
  }

  struct AccStreet {
      bool unlim;
      bool hasStreet;
      int16 steps;
      uint32 openPos;
  }  

  Street[] public streets ;
  Account[] public accounts;
  mapping(address => uint32) mAcc;
  address owner;

   modifier onlyOwner {
      require(msg.sender == owner,"Only owner!");
      _;
   }

    modifier strExists(uint16 strInd) {
      require(streets.length>strInd,"Street not found.");
      _;
   }

   modifier noContract(address adr) {
      require(adr.code.length == 0,"No contract.");
      _;
   }

    function initialize() public initializer {
      owner = msg.sender;
      accounts.push(); // 0 index empty
      createAccount(msg.sender, 1);
  }

  
   function getAccountInd(address adr) external view returns(uint){
       return mAcc[adr];
   }

   function getAccountsLength() external view returns(uint){
       return accounts.length;
   }

    function getStreetsLength() external view returns(uint){
       return streets.length;
   }

   function getAccStreet(uint16 strInd, uint accInd) external view strExists(strInd) returns(AccStreet memory){
       require(streets.length>strInd);
       require(accounts.length>accInd);
       return accounts[accInd].streets[strInd];
   }

    function getPoint(uint16 strInd, uint32 pos) external view strExists(strInd) returns(uint32){
       return streets[strInd].points[pos];
   }


   function addStreet(uint price, uint openDate, uint openWLDate) external onlyOwner{
       Street storage str = streets.push();
       str.freeLeft = 1;
       str.price = price;
       str.openDate = openDate;
       str.openWLDate = openWLDate;
       uint16 strInd = uint16(streets.length-1);
       addDeveloperToStreet(owner,strInd ,true);
       str.freeLeft = 2;
       str.freeRight = 3;
   } 

   function addToWL(address adr, uint16 strInd) external onlyOwner strExists(strInd) noContract(adr) {
         uint32 ind = createAccount(adr,1);
         Street storage str = streets[strInd];
         str.wl[ind] = true;
   } 
  

   function addDeveloper(address adr) external onlyOwner noContract(adr)
   {
       createAccount(adr,1);
   }

   function addDeveloperToStreet (address adr, uint16 strInd, bool unlim) public onlyOwner strExists(strInd) noContract(adr){
       uint32 ind = createAccount(adr,1);
       Account storage acc = accounts[ind];
       AccStreet storage astr = acc.streets[strInd];
       astr.hasStreet = true;
       astr.unlim = unlim;
       addLeft(strInd, ind);
   }

   function addAddressToStreet(uint16 strInd, uint32 parentRef) external payable strExists(strInd) noContract(msg.sender){
       require(accounts.length>parentRef,"Parent reference not found.");
        
       Street storage str = streets[strInd];
       
       require(msg.value == str.price,"Sum is invalid.");

       uint32 ind = createAccount(msg.sender,(parentRef==0)?1:parentRef);
       require(str.openDate<block.timestamp || (str.wl[ind] && str.openWLDate<block.timestamp),"The street closed yet."); 
      

       Account storage acc = accounts[ind];
       AccStreet storage astr = acc.streets[strInd];
       require(!astr.hasStreet,"The street has already been purchased.");

       // Left free. Add root
       if (str.freeLeft<str.freeRight-1){
           addLeft(strInd, 1);
       }      
       uint32 parentPos= str.freeRight >> 1;
       uint32 parentInd = str.points[parentPos];
       Account storage parentAcc = accounts[parentInd];
       AccStreet storage aParentStr = parentAcc.streets[strInd];

       if (aParentStr.unlim || aParentStr.steps<maxSteps){
            addLeft(strInd, parentInd);
       } else {
           aParentStr.openPos = 0;
       }

       delete str.points[parentPos];
   
       str.points[str.freeRight] = uint32(ind);
       astr.openPos = str.freeRight;
    
       astr.hasStreet = true;
       astr.steps++;
       str.freeRight = str.freeRight+2;
      
       uint parentSum = msg.value-transferRefs(acc.parentRef);
       payable(parentAcc.adr).transfer(parentSum);
       setUnlim(strInd,acc,ind);
   }

   function transferRefs(uint32 parentRef) private returns (uint){
       Account storage acRef1 = accounts[parentRef];
       Account storage acRef2 = accounts[acRef1.parentRef];
       Account storage acRef3 = accounts[acRef2.parentRef];
       uint ref1Sum = getSum(msg.value,ref1Percent);
       uint ref2Sum = getSum(msg.value,ref2Percent);
       uint ref3Sum = getSum(msg.value,ref3Percent);
       payable(acRef1.adr).transfer(ref1Sum);
       payable(acRef2.adr).transfer(ref2Sum);
       payable(acRef3.adr).transfer(ref3Sum);
       return ref1Sum+ref2Sum+ref3Sum;
   }

   function setUnlim(uint16 strInd, Account storage acc, uint32 ind) private{
   for (uint16 i = 0; i < strInd; i++) {
         AccStreet storage accStrI =  acc.streets[i];
         accStrI.unlim = true;
         if (accStrI.hasStreet && (accStrI.openPos==0)){
            addLeft(i,ind);
         }
     }
   }

   function getSum(uint val, uint percent) private pure returns (uint)
   {
       return (val/100)*percent;
   }

   function createAccount(address adr, uint32 parentRef) private returns(uint32) {
      if (mAcc[adr]>0) return mAcc[adr]; 
      Account storage acc = accounts.push();
      acc.adr = adr;
      acc.parentRef = (parentRef == 0)?1:parentRef;
      uint32 l = uint32(accounts.length-1);
      mAcc[adr] = l;
      return l;
   }

   function addLeft(uint16 strInd, uint32 accInd) private
   {
       Account storage acc = accounts[accInd];
       AccStreet storage astr = acc.streets[strInd];
       Street storage str = streets[strInd];
       str.points[str.freeLeft] = uint32(accInd);
       astr.openPos = str.freeLeft;
       str.freeLeft = str.freeLeft+2;
       astr.steps++;
   }

   

}