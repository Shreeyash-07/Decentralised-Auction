import React, { useEffect } from "react";
import Layout from "./Layout";
import {
  generatePath,
  NavLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import getBlockchain from "../ethereum";
import { useState } from "react";
import {
  Card,
  Grid,
  Button,
  Image,
  List,
  Header,
  Form,
  Input,
} from "semantic-ui-react";
import { BigNumber, ethers } from "ethers";
const Show = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [owner, setOwner] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [bids, setBids] = useState([]);
  const [auctionId, setAuctionId] = useState("");
  const [status, setStatus] = useState("");
  const [minimumBid, setMinimumBid] = useState("");
  const [value, setValue] = useState("");
  const [balance, setBalance] = useState("");
  const [requestCount, setRequestCount] = useState("");
  const [approversCount, setApproversCount] = useState("");
  const [manager, setManager] = useState("");
  const [sign, setSigner] = useState("");
  useEffect(() => {
    const fetchSummary = async () => {
      const { auction, accounts, signer } = await getBlockchain();
      setSigner(accounts[0]);
      const auc = await auction.auctions(params.auctionId);
      setOwner(auc.auctionOwner);
      setAuctionId(auc.auctionID);
      setStartTime(auc.startTime);
      setEndTime(auc.endTime);
      setMinimumBid(auc.minimumBid);
      setDescription(auc.description);
      setStatus(auc.status);

      const aucBids = await auction.viewAllBids(params.auctionId);
      setBids(aucBids);
      console.log({ bids: aucBids });
    };
    fetchSummary();
  }, [params]);

  const actualDate = (epochdate) => {
    const mili = epochdate * 1000;
    const date = new Date(mili);
    console.log({ date, type: typeof date });
    return date;
  };
  const items = [
    {
      header: owner,
      meta: "Address of Auction Owner",
      description: `Auction ID : ${auctionId.toString()}`,
      style: { overflowWrap: "break-word" },
    },
    {
      header: minimumBid.toString(),
      meta: "Minimum Bid (wei)",
      description: "Minimum price to bid.",
    },
    {
      header: actualDate(startTime.toString()).toString(),
      meta: "Start Time",
      description: "Start time of the auction. ",
    },
    {
      header: actualDate(endTime.toString()).toString(),
      meta: "End Time",
      description: "End time of the auction ",
    },
    {
      header: description,
      meta: "Description",
      description: "Description of the auction",
    },
    {
      header: status == 0 ? "ACTIVE" : "CLOSED",
      meta: "Status",
      description: "Status of the auction",
    },
  ];

  const submitBid = async () => {
    const { auction } = await getBlockchain();
    const response = await auction.placeBid(auctionId, value);
    console.log({ response });
  };
  const submitFinalBid = (bidderAdddress) => async (e) => {
    e.preventDefault();
    const { auction } = await getBlockchain();
    const response = await auction.closeAuction(
      auctionId.toString(),
      bidderAdddress
    );
    console.log({ response });
  };
  return (
    <Layout>
      <h3>Auction Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Card.Group items={items} />
            {sign == owner.toLowerCase() ? (
              <Button
                primary
                style={{ fontFamily: "inherit", marginTop: "10px" }}
              >
                Close the auction
              </Button>
            ) : (
              <Form onSubmit={submitBid} style={{ marginTop: "10px" }}>
                <Form.Field>
                  <label>Minimum Bid</label>
                  <Input
                    label="wei"
                    labelPosition="right"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                  />
                  <Button
                    primary
                    style={{ fontFamily: "inherit", marginTop: "10px" }}
                  >
                    Make a bid
                  </Button>
                </Form.Field>
              </Form>
            )}
          </Grid.Column>
          <Grid.Column width={7}>
            {/* <ContributeForm address={params.address} /> */}
            <Header as="h1">Bids</Header>
            {bids.length ? (
              <List divided verticalAlign="middle">
                {bids.map((bid, i) => (
                  <List.Item
                    key={i}
                    style={{ paddingTop: "10px", paddingBottom: "20px" }}
                  >
                    {sign == owner.toLowerCase() && (
                      <Form onSubmit={submitFinalBid(bid.bidder)}>
                        <List.Content floated="right">
                          {/* <Input type="hidden" value={bid.bidder} /> */}
                          <Button>Select</Button>
                        </List.Content>
                      </Form>
                    )}

                    {/* <Image avatar src="/images/avatar/small/lena.png" /> */}
                    <List.Content>{bid.bidder}</List.Content>
                    <List.Content style={{ fontWeight: "700" }}>
                      {`Amount : ${bid.amount.toString()}`}
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Header as="h3">No Bids</Header>
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default Show;
