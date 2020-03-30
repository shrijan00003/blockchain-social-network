const SocialNetwork = artifacts.require("./SocialNetwork.sol");
require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Social Network", ([deployer, author, tipper]) => {
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

  describe("posts", () => {
    let result, postCount;
    const content = "This is my first article";
    before(async () => {
      result = await socialNetworkContract.createPost(content, {
        from: author
      });
      postCount = await socialNetworkContract.postCount();
    });
    it("should create post ", async () => {
      // SUCCESS
      assert.equal(postCount, 1);

      const event = result.logs[0].args;

      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(event.content, content, "Content is correct");
      assert.equal(event.tipAmount, "0", "Tip amount is correct");
      assert.equal(event.author, author, "Author is correct");

      // FAILURE: Post must have content
      await socialNetworkContract.createPost("", { from: author }).should.be
        .rejected;
    });

    it("should list post", async () => {
      const post = await socialNetworkContract.posts(postCount);
      assert.equal(post.id.toNumber(), postCount.toNumber());
      assert.equal(post.content, content, "Content is correct");
      assert.equal(post.tipAmount, "0", "Tip amount is correct");
      assert.equal(post.author, author, "Author is correct");
    });

    it("should allows users to tip posts", async () => {
      // Track the author balance before purchase
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result = await socialNetworkContract.tipPost(postCount, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether")
      });

      // SUCCESS
      const event = result.logs[0].args;

      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(event.content, content, "content is correct");
      assert.equal(
        event.tipAmount.toString(),
        "1000000000000000000",
        "tip amount is correct"
      );
      assert.equal(event.author, author, "author is correct");

      // Check that author received funds
      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipAmount;
      tipAmount = web3.utils.toWei("1", "Ether");
      tipAmount = new web3.utils.BN(tipAmount);

      const expectedBalance = oldAuthorBalance.add(tipAmount);

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString());
      // FAILURE: Tries to tip a post that does not exist
      await socialNetworkContract.tipPost(99, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether")
      }).should.be.rejected;
    });
  });
});
