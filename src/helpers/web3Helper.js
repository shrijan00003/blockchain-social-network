import Web3 from "web3";
import SocialNetwork from "../abis/SocialNetwork.json";

const GAS_LIMIT = 1000000;

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

export const getSocialNetworkContract = async () => {
  try {
    const networkData = await SocialNetwork.networks[await getNetworkId()];
    if (networkData) {
      const socialNetworkContract = new window.web3.eth.Contract(
        SocialNetwork.abi,
        networkData.address
      );
      return socialNetworkContract;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPosts = async () => {
  const socialNetworkContract = await getSocialNetworkContract();
  if (!socialNetworkContract)
    return {
      data: null,
      error: "Social Network is not released on current network"
    };
  const postCount = await socialNetworkContract.methods.postCount().call();
  let posts = [];
  if (postCount > 0) {
    for (let index = 1; index <= postCount; index++) {
      const post = await socialNetworkContract.methods.posts(index).call();
      posts.push(post);
    }
  }
  return {
    data: {
      postCount,
      posts
    },
    error: null
  };
};

export const createPost = async (content, from) => {
  const contract = await getSocialNetworkContract();
  if (!contract) {
    return;
  }

  try {
    contract.methods
      .createPost(content)
      .send({ from, gas: GAS_LIMIT })
      .then(receipt => {
        console.log("_____________receipt__________", receipt);
        window.location.reload();
      })
      .catch(err => console.log("_____________err__________", err));
  } catch (error) {
    console.log("_____________error in creating post__________", error);
  }
};

export const tipPost = async (id, from, tipAmount = "0.1") => {
  const etherAmount = window.web3.utils.toWei(tipAmount, "Ether");
  const contract = await getSocialNetworkContract();
  if (!contract) {
    return;
  }
  try {
    contract.methods
      .tipPost(id)
      .send({ from, value: etherAmount, gas: GAS_LIMIT })
      .once("receipt", receipt => {
        console.log("_____________receipt__________", receipt);
      });
  } catch (error) {
    console.log("_____________error__________", error);
  }
};
