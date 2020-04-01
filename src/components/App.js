import "./App.scss";
import Identicon from "identicon.js";
import React, { useEffect, useState } from "react";
import {
  loadWeb3,
  getAccount,
  getPosts,
  getSocialNetworkContract,
  createPost,
  tipPost
} from "../helpers/web3Helper";
import Main from "./Main";

const initialState = {
  account: "",
  socialNetwork: null,
  postCount: 0,
  posts: []
};
function App() {
  useEffect(() => {
    loadWeb3();
  }, []);

  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");

  useEffect(() => {
    const getDataAsync = async () => {
      const account = await getAccount();
      setState(s => ({ ...s, account }));

      const socialNetworkContract = await getSocialNetworkContract();
      if (socialNetworkContract) {
        setState(s => ({ ...s, socialNetwork: socialNetworkContract }));
      }

      const { error, data } = await getPosts();
      if (error) {
        setError(error);
        return;
      }
      const { posts, postCount } = data;
      if (postCount > 0) {
        setState(s => ({ ...s, posts, postCount }));
      }
    };
    getDataAsync();
  }, []);

  const { account } = state;

  const _createPost = content => {
    createPost(content, state.account);
  };
  const _tipPost = (postId, tipAmount) => {
    tipPost(postId, state.account, tipAmount);
  };
  if (error) {
    console.log("_____________error__________", error);
  }
  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-white">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/">
          Blockchain Social Network
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">
              <small id="account">Address:{account}</small>
              {account ? (
                <img
                  className="ml-2"
                  width="30"
                  height="30"
                  alt="account icon"
                  src={`data:image/png;base64,${new Identicon(
                    account,
                    30
                  ).toString()}`}
                ></img>
              ) : null}
            </small>
          </li>
        </ul>
      </nav>
      <Main posts={state.posts} createPost={_createPost} tipPost={_tipPost} />
    </div>
  );
}

export default App;
