const connectFabric = require("./blockchain/fabricConnection");

async function test() {
    try {
        const gateway = await connectFabric();

        console.log("Fabric connection successful ✅");

        await gateway.disconnect();

    } catch (error) {
        console.log("Test failed ❌");
        console.error(error);
    }
}

test();