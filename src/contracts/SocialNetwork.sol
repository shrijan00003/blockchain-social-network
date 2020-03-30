pragma solidity ^0.5.0;


contract SocialNetwork {
    // Data structure
    string public name;
    uint256 public postCount = 0;
    struct Post {
        uint256 id;
        string content;
        uint256 tipAmount;
        address payable author;
    }

    // Defining data structure posts to handle posts of Post type
    // where key is id wiht uint256 data taype and value is Post
    mapping(uint256 => Post) public posts;

    // Events
    event PostCreated(
        uint256 id,
        string content,
        uint256 tipAmount,
        address payable author
    );

    event PostTipped(
        uint256 id,
        string content,
        uint256 tipAmount,
        address payable author
    );

    // Methods
    constructor() public {
        name = "LearnTechFree Social Network";
    }

    function createPost(string memory _content) public {
        // require validation
        require(bytes(_content).length > 0, "Content is Required");

        postCount++;
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        emit PostCreated(postCount, _content, 0, msg.sender);
    }

    function tipPost(uint256 _id) public payable {
        // Fetch the post
        Post memory _post = posts[_id];

        require(_post.id > 0, "Id must be in posts");

        // Fetch the author
        address payable _author = _post.author;

        // pay the author by sending them ehter
        address(_author).transfer(msg.value);

        // Increase the tip ammount
        _post.tipAmount = _post.tipAmount + msg.value;

        // Update the post
        posts[_id] = _post;

        // Trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }
}
