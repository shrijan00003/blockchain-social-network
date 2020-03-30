const SocialNetwork = artifacts.require("./SocialNetwork.sol");
require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Social Network", accounts => {
  let socialNetworkContract;
  before(async () => {
    socialNetworkContract = await SocialNetwork.deployed();
  });
  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await socialNetworkContract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
    it("has a name", async () => {
      const name = await socialNetworkContract.name();
      assert.equal(name, "LearnTechFree Social Network");
    });
  });
});
