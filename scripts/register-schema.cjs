const { SchemaRegistry } = require("@ethereum-attestation-service/eas-sdk");
const { ethers } = require("ethers");

const SCHEMA_REGISTRY_ADDRESS = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";

const SCHEMA_STRING =
  "string incidentType,string modelIdentifier,uint8 severityLevel,string description,string evidenceHash,uint64 timestamp,string reporterRole,bool verified,string mitigationStatus";

async function registerSchema() {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    console.error("Error: PRIVATE_KEY environment variable not set");
    console.log("Usage: PRIVATE_KEY=0x... node scripts/register-schema.cjs");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
  const signer = new ethers.Wallet(privateKey, provider);

  console.log("Registering schema on Sepolia...");
  console.log("Schema:", SCHEMA_STRING);
  console.log("From account:", signer.address);

  const schemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY_ADDRESS);
  schemaRegistry.connect(signer);

  try {
    const transaction = await schemaRegistry.register({
      schema: SCHEMA_STRING,
      resolverAddress: "0x0000000000000000000000000000000000000000",
      revocable: true,
    });

    const uid = await transaction.wait();

    console.log("\n✅ Schema registered successfully!");
    console.log("Schema UID:", uid);
    console.log("\nAdd this to your .env file:");
    console.log(`NEXT_PUBLIC_SCHEMA_UID=${uid}`);
    console.log(
      "\nView on EASScan: https://sepolia.easscan.org/schema/view/" + uid
    );
  } catch (error) {
    console.error("❌ Failed to register schema:", error);
    process.exit(1);
  }
}

registerSchema().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
