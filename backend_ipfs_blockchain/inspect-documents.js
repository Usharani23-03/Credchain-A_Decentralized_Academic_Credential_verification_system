const prisma = require("./config/prisma");

async function main() {
  const documents = await prisma.document.findMany({
    take: 5,
    select: {
      id: true,
      fileHash: true,
      certificateId: true,
      blockchainTxId: true,
      ipfsHash: true
    },
    orderBy: { id: "desc" }
  });

  console.log(JSON.stringify(documents, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
