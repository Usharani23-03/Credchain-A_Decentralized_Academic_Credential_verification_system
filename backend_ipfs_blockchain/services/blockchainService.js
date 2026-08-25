const connectFabric = require("../fabric/connection");

// ============================================================
// Store Certificate on Hyperledger Fabric
// ============================================================

exports.storeHashOnBlockchain = async (
    fileHash,
    certificateId,
    studentName = "Unknown",
    registerNo = "Unknown",
    degree = "Certificate",
    issuer = "Unknown",
    ipfsCID = ""
) => {

    try {

        if (!fileHash) {
            throw new Error("File hash is required.");
        }

        if (!certificateId) {
            throw new Error("Certificate ID is required.");
        }

        const contract = await connectFabric();

        console.log("");
        console.log("=================================");
        console.log("BLOCKCHAIN: CREATE CERTIFICATE");
        console.log("=================================");
        console.log("Certificate ID:", certificateId);
        console.log("Student:", studentName);
        console.log("Register No:", registerNo);
        console.log("Degree:", degree);
        console.log("Issuer:", issuer);
        console.log("SHA-512:", fileHash);
        console.log("IPFS CID:", ipfsCID);
        console.log("=================================");

        // Create certificate on Hyperledger Fabric
        const result = await contract.submitTransaction(
            "CreateCertificate",
            certificateId,
            studentName,
            registerNo,
            degree,
            issuer,
            fileHash,
            ipfsCID
        );

        // Fabric returns the chaincode response.
        let chaincodeResponse = null;

        try {
            chaincodeResponse =
                JSON.parse(result.toString());
        } catch {
            chaincodeResponse =
                result.toString();
        }

        /*
         * IMPORTANT:
         *
         * certificateId is the application's credential ID.
         *
         * It is NOT the Fabric transaction ID.
         *
         * The Fabric Gateway submitTransaction call does not
         * return the transaction ID as the chaincode payload.
         *
         * Your application should therefore keep certificateId
         * separately from the actual Fabric transaction ID.
         */

        console.log("");
        console.log("=================================");
        console.log("BLOCKCHAIN CERTIFICATE CREATED");
        console.log("=================================");
        console.log("Certificate ID:", certificateId);
        console.log("Chaincode response:", chaincodeResponse);
        console.log("=================================");

        return {

            success: true,

            certificateId,

            hash: fileHash,

            ipfsCID,

            chaincodeResponse

        };

    } catch (error) {

        console.error("");
        console.error("=================================");
        console.error("BLOCKCHAIN STORE ERROR");
        console.error("=================================");
        console.error(error);
        console.error("=================================");

        return {

            success: false,

            certificateId,

            error: error.message

        };

    }

};


// ============================================================
// Verify Certificate on Hyperledger Fabric
// ============================================================

exports.verifyHashOnBlockchain = async (
    certificateId,
    fileHash
) => {

    try {

        if (!certificateId) {
            throw new Error(
                "Certificate ID is required."
            );
        }

        if (!fileHash) {
            throw new Error(
                "File hash is required."
            );
        }

        const contract =
            await connectFabric();

        console.log("");
        console.log("=================================");
        console.log("BLOCKCHAIN: VERIFY CERTIFICATE");
        console.log("=================================");
        console.log(
            "Certificate ID:",
            certificateId
        );
        console.log(
            "SHA-512:",
            fileHash
        );
        console.log("=================================");

        const result =
            await contract.evaluateTransaction(
                "VerifyCertificate",
                certificateId,
                fileHash
            );

        const response =
            result.toString().trim();

        const exists =
            response === "true";

        console.log("");
        console.log("Blockchain verification result:");
        console.log(exists);
        console.log("");

        return {

            exists,

            certificateId,

            hash: fileHash

        };

    } catch (error) {

        console.error("");
        console.error("=================================");
        console.error("BLOCKCHAIN VERIFY ERROR");
        console.error("=================================");
        console.error(error);
        console.error("=================================");

        return {

            exists: false,

            certificateId,

            error: error.message

        };

    }

};