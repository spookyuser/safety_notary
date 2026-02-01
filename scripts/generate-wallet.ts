import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log("New wallet generated:");
console.log("Address:", account.address);
console.log("Private Key:", privateKey);
console.log("\nNext steps:");
console.log("1. Get Sepolia ETH from a faucet: https://sepoliafaucet.com");
console.log("2. Run: PRIVATE_KEY=" + privateKey + " npm run register-schema");
