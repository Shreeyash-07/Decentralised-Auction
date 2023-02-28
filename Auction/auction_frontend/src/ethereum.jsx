import React from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, Contract } from "ethers";
import ABI from "./abi.json";

const getBlockchain = () =>
  new Promise(async (resolve, reject) => {
    let provider = await detectEthereumProvider();
    if (provider) {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const networkID = await provider.request({ method: "net_version" });
      provider = new ethers.providers.Web3Provider(provider);
      const signer = await provider.getSigner();
      console.log({
        provider: provider,
        "normal signer": signer,
        "signer from ethereum": signer.getAddress(),
      });
      const auction = new Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        ABI,
        signer
      );
      resolve({ auction, accounts, networkID, signer });
      return;
    }
    reject("Install Metamask");
  });

export default getBlockchain;
