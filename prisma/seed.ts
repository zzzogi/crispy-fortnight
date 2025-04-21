import { PrismaClient } from "../generated/prisma"; // Adjust the import path based on your project structure

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Chè lam gừng",
        price: 2500,
        label: "Truyền thống",
        description: "Chè lam vị gừng thơm ngon",
        imageUrl: ["/images/placehoder.jpg"],
        type: "RETAIL",
        categoryId: "680545b9d5bbaa2b601d6808",
      },
      {
        name: "Mứt dừa",
        price: 2800,
        label: "Đặc sản",
        description: "Chè lam với đậu phộng giòn bùi",
        imageUrl: ["/images/placehoder.jpg"],
        type: "GIFT",
        categoryId: "680545b9d5bbaa2b601d680a",
      },
      {
        name: "Chè lam dẻo",
        price: 3000,
        label: "Mới",
        description: "Chè lam dẻo mềm, vị truyền thống",
        imageUrl: ["/images/placehoder.jpg"],
        type: "GIFT",
        categoryId: "680545b9d5bbaa2b601d6808",
      },
      {
        name: "Kẹo lạc đậu phộng",
        price: 320,
        label: "Mới",
        description: "Chè lam vị trà xanh thanh mát",
        imageUrl: ["/images/placehoder.jpg"],
        type: "RETAIL",
        categoryId: "680545b9d5bbaa2b601d6809",
      },
    ],
  });

  console.log("✅ Seed dữ liệu thành công!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
