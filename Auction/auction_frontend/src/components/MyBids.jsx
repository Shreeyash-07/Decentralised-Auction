import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import getBlockchain from "../ethereum";
import { Header, Image, List } from "semantic-ui-react";
const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [account, setAccount] = useState();
  const fetchMyBids = async () => {
    const { auction, accounts } = await getBlockchain();
    setAccount(accounts[0]);
    // const mybids = await auction.userBids(accounts[0], 1, {
    //   from: accounts[0],
    // });
    // console.log({ mybids });
    const bids = await auction.getMyBidsList();

    let unique = [...new Set(bids)];
    console.log({ unique });
    let items = [];
    for (let i = 0; i < unique.length; i++) {
      const id = unique[i].toString();
      console.log(id);
      const response = await auction.getMyBidDetails(id);
      items.push(response);
    }
    console.log(items);
    setBids(items);
  };
  useEffect(() => {
    fetchMyBids();
  }, []);
  return (
    <Layout>
      <h3 style={{ fontFamily: "Poppins" }}>My Bids</h3>
      <List animated celled>
        {bids.length ? (
          bids.map((bid, i) => (
            <List.Item
              key={i}
              style={{ paddingTop: "20px", paddingBottom: "20px" }}
            >
              {/* <Image avatar src="/images/avatar/small/helen.jpg" /> */}
              <List.Content>
                <List.Header>{account}</List.Header>
                {`Auction ID : ${bid[0]}`}
              </List.Content>
              <List.Content>{`Auction Owner : ${bid[1]}`}</List.Content>
              <List.Content>{`Auction Description : ${bid[2]}`}</List.Content>
              <List.Content>{`Auction Status : ${
                bid[3] === 0 ? "ACTIVE" : "CLOSED"
              }`}</List.Content>
              <List.Header>{`My Bid : ${bid[4]}`}</List.Header>
            </List.Item>
          ))
        ) : (
          <Header as="h3">No Bids</Header>
        )}
      </List>
    </Layout>
  );
};

export default MyBids;
