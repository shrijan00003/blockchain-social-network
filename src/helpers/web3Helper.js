import Web3 from "web3";
import SocialNetwork from "../abis/SocialNetwork.json";

export const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

export const getAccount = async () => {
  const web3 = window.web3;
  const accounts = await web3.eth.getAccounts();
  return accounts ? accounts[0] : null;
};

export const getNetworkId = async () => {
  const networkId = await window.web3.eth.net.getId();
  return networkId;
};

export const getSocialNetworkData = async () => {
  const networkData = SocialNetwork.networks[await getNetworkId()];
  if (networkData) {
    const socialNetwork = new window.web3.eth.Contract(
      SocialNetwork.abi,
      networkData.address
    );
    return socialNetwork;
  } else {
    window.alert("SocialNetwork contract not deployed to detected network.");
    Promise.reject("Contract Not deployed");
  }
};

export const getPosts = async () => {
  const socialNetwork = await getSocialNetworkData();
  const postCount = await socialNetwork.methods.postCount().call();
  let posts = [];
  if (postCount > 0) {
    for (let index = 0; index < postCount; index++) {
      const post = await socialNetwork.methods.posts(index).call();
      posts.push(post);
    }
  }
  return {
    postCount,
    posts
  };
};
