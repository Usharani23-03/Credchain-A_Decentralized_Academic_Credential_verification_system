const connectFabric = require("./blockchain/fabricConnection");

async function createCertificate() {
    try {
        // ================================================
        // CONNECT TO HYPERLEDGER FABRIC
        // ================================================

        const contract = await connectFabric();

        // ================================================
        // CREATE TRANSACTION PROPOSAL
        // ================================================

        console.log("Creating transaction proposal...");

        const proposal = contract.newProposal(
            "CreateCertificate",
            {
                arguments: [
                    "CERT007",
                    "Umme Rumaan",
                    "CS001",
                    "Computer Science",
                    "University",
                    "sha512_test_hash_node_006",
                    "QmTestCIDNode006"
                ]
            }
        );

        // ================================================
        // REQUEST ENDORSEMENTS
        // ================================================

        console.log("Requesting endorsements...");

        const transaction = await proposal.endorse();

        console.log("Endorsements successful.");

        // ================================================
        // SUBMIT TRANSACTION
        // ================================================

        console.log(
            "Submitting transaction to blockchain..."
        );

        const commit = await transaction.submit();

        // ================================================
        // WAIT FOR COMMIT
        // ================================================

        console.log(
            "Waiting for transaction commit..."
        );

        const status = await commit.getStatus();

        // ================================================
        // CHECK COMMIT STATUS
        // ================================================

        if (status.successful) {
            console.log("");
            console.log("========================================");
            console.log("TRANSACTION COMMITTED SUCCESSFULLY");
            console.log("========================================");

            console.log(
                "Block number:",
                status.blockNumber.toString()
            );

            console.log(
                "Transaction ID:",
                status.transactionId
            );

            console.log(
                "Status code:",
                status.code
            );

            console.log(
                "Successful:",
                status.successful
            );

            console.log("========================================");
            console.log("");
        } else {
            console.error(
                "Transaction was committed but was not successful."
            );

            console.error(
                "Status code:",
                status.code
            );
        }

    } catch (error) {

        console.error("");
        console.error(
            "========================================"
        );
        console.error(
            "TRANSACTION FAILED"
        );
        console.error(
            "========================================"
        );

        console.error(error);

        process.exitCode = 1;
    }
}


// ================================================
// RUN
// ================================================

createCertificate();