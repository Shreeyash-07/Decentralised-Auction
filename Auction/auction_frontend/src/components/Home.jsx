import React, { useState, useEffect } from "react";
import getBlockchain from "../ethereum";
import { Card, Button, Container, Header, Label } from "semantic-ui-react";
import Layout from "./Layout";
import { NavLink } from "react-router-dom";
const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    const getFactory = async () => {
      const { auction } = await getBlockchain();
      console.log({ auction });
      const auctions = await auction.getAuctions();
      console.log({ auctions });
      setCampaigns(auctions);
    };
    getFactory();
  }, []);
  return (
    <Layout>
      <h3 style={{ fontFamily: "Poppins" }}>Open Auctions</h3>
      <NavLink to="/auction/newAuction">
        <Button
          floated="right"
          content="Create Auction"
          icon="add circle"
          primary
          style={{ marginBottom: "10px" }}
        />
      </NavLink>
      {campaigns.map((auction, index) => (
        <Card key={index} fluid={true}>
          <Card.Content>
            <Label as="a" color="green" ribbon="right">
              {auction.status == 0 ? "ACTIVE" : "CLOSED"}
            </Label>
            {/* <Header as="h4" floated="right">

              {auction.status == 0 ? "ACTIVE" : "CLOSED"}
            </Header> */}
            <Card.Header>{auction.auctionOwner}</Card.Header>
            <Card.Description>
              <NavLink to={`/auction/${auction.auctionID}`}>
                <a>View Auction</a>
              </NavLink>
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Layout>
  );
};

export default Home;
