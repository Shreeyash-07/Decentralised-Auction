import React, { useState, useEffect } from "react";
import getBlockchain from "../ethereum";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import {
  DateInput,
  TimeInput,
  DateTimeInput,
  DatesRangeInput,
} from "semantic-ui-calendar-react";
const NewAuction = () => {
  const navigate = useNavigate();
  const [minimumBid, setMinimumBid] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [currAC, setcurrAC] = useState("");
  const [signer, setSigner] = useState("");
  const [errorMsg, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    connect();
  }, []);
  const toEpoch = (date) => {
    const newDAte = new Date(date);
    let epochDate;
    try {
      epochDate = Date.parse(newDAte) / 1000;
    } catch (Err) {
      console.log({ Err });
    }
    return epochDate;
  };
  const submitCreateAuction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { auction, accounts, signer } = await getBlockchain();
      setSigner(signer);
      const start = toEpoch(startTime);
      const end = toEpoch(endTime);
      await auction.createAuction(start, end, minimumBid, description);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
    navigate("/");
  };

  const connect = async () => {
    try {
      if (!window.ethereum) {
        console.log("Metamask not detected");
        return;
      }
      const { accounts } = await getBlockchain();
      setcurrAC(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };
  const handleStartChange = (name, value) => {
    const epochDate = toEpoch(value);
    console.log({ epochDate });
    setStartTime(value);
  };
  const handleEndChange = (name, value) => {
    const epochDate = toEpoch(value);
    console.log({ epochDate });
    setEndTime(value);
  };
  return (
    <Layout>
      <h3>Create Campaign</h3>
      <Form onSubmit={submitCreateAuction} error={!!errorMsg}>
        <Form.Field>
          <label>Start Time</label>
          <DateTimeInput
            name="dateTime"
            placeholder="Date Time"
            value={startTime}
            iconPosition="left"
            dateTimeFormat="MM-DD-YYYY HH:MM"
            onChange={(a, { name, value }) => handleStartChange(name, value)}
          />
        </Form.Field>

        <Form.Field>
          <label>End Time</label>
          <DateTimeInput
            name="dateTime"
            placeholder="Date Time"
            value={endTime}
            iconPosition="left"
            dateTimeFormat="MM-DD-YYYY HH:MM"
            onChange={(a, { name, value }) => handleEndChange(name, value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Minimum Bid</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumBid}
            onChange={(e) => {
              setMinimumBid(e.target.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <Input
            placeholder="Description for auction"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Form.Field>

        <Message error header="Uff...!" content={errorMsg} />
        <Button loading={loading} primary>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default NewAuction;
