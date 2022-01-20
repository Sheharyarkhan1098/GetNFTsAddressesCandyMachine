/** @format */

const web3 = require("@solana/web3.js");
const { PublicKey } = require("@solana/web3.js");
const bs58 = require("bs58");

let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
let tokenAccount = new web3.PublicKey(
	"AecQxZvyMuL5DvG3SVHCf2pz3nvPyBuNTLEmfmhktyCC"
);
let publicKey = new web3.PublicKey(
	"AqH29mZfQFgRpfwaPoTMWSKJ5kqauoc1FwVBRksZyQrt"
);
let reward_mint = new web3.PublicKey(
	"yvbrxE6zjrA8SxxSpL7oojDBB5QDmF5CVqJWea8JcQE"
);

let myPubKey = new web3.PublicKey(
	"Go1cwdg9kxxiXT8XLP6eYLR8cHze79dTLHa6pMyHv9JF"
);

let publicKey1 = new web3.PublicKey(
	"XLz9X8Ye4rtg5sYuvR95MwwanExyDpwN5N3yaoVZLGV"
);

let publicKey2 = new web3.PublicKey(
	"EdxnAjS8rpwbxhhr4bzdbzfFVxT4TwtDDLLPbhWqJeyS"
);

let publicKey3 = new web3.PublicKey(
	"HzWs5b9cXuaJdyR2u2rwA7yRB79op5Ub5W5fJuf4dF1f"
);

let publicKey4 = new web3.PublicKey(
	"A2GZtC22s3T1aQA6PosDKPLmvBjZSNEWs9vNsXkikMyV"
);

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;
const MAX_CREATOR_LIMIT = 5;
const MAX_DATA_SIZE =
	4 +
	MAX_NAME_LENGTH +
	4 +
	MAX_SYMBOL_LENGTH +
	4 +
	MAX_URI_LENGTH +
	2 +
	1 +
	4 +
	MAX_CREATOR_LIMIT * MAX_CREATOR_LEN;
const MAX_METADATA_LEN = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172;
const CREATOR_ARRAY_START =
	1 +
	32 +
	32 +
	4 +
	MAX_NAME_LENGTH +
	4 +
	MAX_URI_LENGTH +
	4 +
	MAX_SYMBOL_LENGTH +
	2 +
	1 +
	4;
const TOKEN_METADATA_PROGRAM = new PublicKey(
	"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const CANDY_MACHINE_V2_PROGRAM = new PublicKey(
	"cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ"
);
const candyMachineId = new web3.PublicKey(
	"3fDd4AaLnDnpHWaamBQ1qrC8zupv6CJj2ZNedzBusbZY"
);

exports.getaccount = async (req, res) => {
	const getMintAddresses = async (firstCreatorAddress) => {
		const metadataAccounts = await connection.getProgramAccounts(
			TOKEN_METADATA_PROGRAM,
			{
				// The mint address is located at byte 33 and lasts for 32 bytes.
				dataSlice: { offset: 33, length: 32 },

				filters: [
					// Only get Metadata accounts.
					{ dataSize: MAX_METADATA_LEN },

					// Filter using the first creator.
					{
						memcmp: {
							offset: CREATOR_ARRAY_START,
							bytes: firstCreatorAddress.toBase58(),
						},
					},
				],
			}
		);

		let tempArry = [];
		metadataAccounts.map((metadataAccountInfo) => {
			console.log(
				"metadataAccountInfo: ",
				bs58.encode(metadataAccountInfo.account.data)
			);
			tempArry.push(bs58.encode(metadataAccountInfo.account.data));
		});

		res.json(tempArry);

		return tempArry;
	};

	const getCandyMachineCreator = async (candyMachine) =>
		PublicKey.findProgramAddress(
			[Buffer.from("candy_machine"), candyMachine.toBuffer()],
			CANDY_MACHINE_V2_PROGRAM
		);

	(async () => {
		const candyMachineCreator = await getCandyMachineCreator(candyMachineId);
		console.log("candyMachineCreator", candyMachineCreator[0]);
		// console.log(
		// 	"getMintAddresses(candyMachineCreator[0]): ",
		// 	getMintAddresses(candyMachineCreator[0])
		// );
		getMintAddresses(candyMachineCreator[0]);
		// await res.json(addresses);
		// res.json(getMintAddresses(candyMachineCreator[0]));
	})();
};
