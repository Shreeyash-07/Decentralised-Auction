// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Auctions {
    using Counters for Counters.Counter;
    Counters.Counter private _auctionIds;

    enum Status {ACTIVE,CLOSED}
    
    struct Bid {
        address bidder;
        uint256 amount;
    }
    struct Auction {
        uint256 auctionID;
        uint256 startTime;
        uint256 endTime;
        uint256 minimumBid;
        string description;
        Bid[] bids;
        address auctionOwner;
        Status status;
        address winner;
    }
    
    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256[]) public userBids;
    
    event NewAuction(uint256 auctionID);
    event NewBid(uint256 auctionID, address bidder, uint256 amount);
    event AuctionClosed(uint256 auctionID, address winner, uint256 amount);
    
    function createAuction(uint256 _startTime, uint256 _endTime, uint256 _minimumBid, string memory _description) public {
        require(_endTime > _startTime, "End time must be after start time");
        _auctionIds.increment();
        uint256 aucID = _auctionIds.current();
        auctions[aucID].auctionID = aucID;
        auctions[aucID].startTime = _startTime;
        auctions[aucID].endTime = _endTime;
        auctions[aucID].minimumBid = _minimumBid;
        auctions[aucID].description = _description;
        auctions[aucID].auctionOwner = msg.sender;
        auctions[aucID].status = Status.ACTIVE;
        auctions[aucID].winner = address(0);
        emit NewAuction(aucID);
    }
    
    function placeBid(uint256 _auctionID,uint256 bidPrice) public {
        Auction storage auction = auctions[_auctionID];
        require(block.timestamp >= auction.startTime && block.timestamp <= auction.endTime, "Auction is not active");
        require(bidPrice >= auction.minimumBid, "Bid amount is too low");
        require(auction.status != Status.CLOSED, "Auction is closed");
        auction.bids.push(Bid(msg.sender, bidPrice));
        userBids[msg.sender].push(_auctionID);
        emit NewBid(_auctionID, msg.sender, bidPrice);
    }
    
    function viewAllBids(uint256 _auctionID) public view returns (Bid[] memory) {
        Auction storage auction = auctions[_auctionID];
        require(auction.auctionOwner == msg.sender,"Only auction owner can view the bids");
        return auctions[_auctionID].bids;
    }
    
    function closeAuction(uint256 _auctionID, address payable _winner) public {
        Auction storage auction = auctions[_auctionID];
        require(msg.sender == auction.auctionOwner, "Only the auction owner can close the auction");
        require(block.timestamp >= auction.endTime, "Auction has not ended yet");
        require(auction.status != Status.CLOSED, "Auction is already closed");
        auction.winner = _winner;
        auction.status = Status.CLOSED;
    }


    function getAuctions() public view returns(Auction[] memory){
        uint256 auctionsCount = _auctionIds.current();
        uint256 activeAuctionsCount = 0;
        uint256 currentIndex = 0;
        for(uint256 i = 0;i < auctionsCount ; i++){
            if(auctions[i+1].status == Status.ACTIVE){
                activeAuctionsCount+=1;
            }
        }
        Auction[] memory items = new Auction[](activeAuctionsCount);
        for(uint256 i = 0; i < auctionsCount ; i++){
            if(auctions[i+1].status == Status.ACTIVE){
                Auction storage auc = auctions[i+1];
                items[currentIndex] = auc;
                currentIndex+=1;
            }
        }
        return items;
    }


    function getMyBidsList()public view returns(uint256[] memory){
        uint256[] storage auctionIdsList = userBids[msg.sender];
        return auctionIdsList; 
    }

    function getMyBidDetails(uint256 _aucID)public view returns(uint256,address,string memory,Status,uint256){
        Auction storage auction = auctions[_aucID];
        uint256 myAmount;
        for(uint256 i = 0;i < auction.bids.length ; i++){
            if(auction.bids[i].bidder == msg.sender){
                myAmount = auction.bids[i].amount;
                break;
            }
        }
        return (_aucID,auction.auctionOwner,auction.description,auction.status,myAmount);
    }
}