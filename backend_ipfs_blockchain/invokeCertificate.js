const connectFabric = require("./blockchain/fabricConnection");

async function createCertificate() {

    try {

        const gateway = await connectFabric();

        const network = await gateway.getNetwork("mychannel");

        const contract = network.getContract("certificate");

        console.log("Submitting transaction...");

        const result = await contract.submitTransaction(
            "CreateCertificate",
            "CERT001",
            "Umme Rumaan",
            "CS001",
            "Computer Science",
            "University",
            "sha512_test_hash",
            "QmTestCID123"
        );

        console.log("Certificate created successfully ✅");

        if (result && result.length > 0) {
            console.log("Blockchain response:");
            console.log(result.toString());
        } else {
            console.log("No response returned from chaincode");
        }

        await gateway.disconnect();

    } catch (error) {

        console.log("Transaction failed ❌");

        console.log("Error message:");
        console.log(error.message);

        if (error.responses) {
            console.log("Peer responses:");

            error.responses.forEach((response) => {
                console.log(response.message);
            });
        }

        console.log(error);
    }
}

createCertificate();