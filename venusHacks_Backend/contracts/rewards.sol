// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract rewards is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string reward =
        "https://gateway.pinata.cloud/ipfs/QmaNtZCeCoEcSK4gANTbRyTEssw4jSVHkeeGXLmqTBtUdR";

    constructor() ERC721("FUNGIRUN", "FGR") {
        console.log("An NFT has been minted to", msg.sender);
    }

    uint256 public constant maxSupply = 100;

    function distributeReward() public {
        uint256 newItemId = _tokenIds.current();

        require(newItemId < maxSupply, "You have reached the limit");

        // //Get all the JSON metadata in place and base64 encode it.
        // string memory json = Base64.encode(
        //     bytes(
        //         string(
        //             abi.encodePacked(
        //                 '{"name": "',
        //                 // We set the title of our NFT as the following.
        //                 "Fungi Run Season 1 reward #",
        //                 Strings.toString(newItemId + 1),
        //                 '", "description": "From Brainstorm Labs.", "image": "gateway.pinata.cloud/ipfs/QmUDfXQ4gL3rr3FvMAwar6y4nULgRrFyUJHN8PYSFCWNTu"',
        //                 // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
        //                 '"}'
        //             )
        //         )
        //     )
        // );

        // // Just like before, we prepend data:application/json;base64, to our data.

        console.log("\n--------------------");
        console.log(reward);
        console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);

        // Update your URI!!!
        _setTokenURI(newItemId, reward);

        _tokenIds.increment();
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
    }
}
