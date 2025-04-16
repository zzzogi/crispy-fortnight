import { PrismaClient } from "../generated/prisma"; // Adjust the import path based on your project structure

const prisma = new PrismaClient();

async function main() {
  // Seed 2 admin users
  await prisma.user.createMany({
    data: [
      {
        name: "Admin One",
        email: "admin1@example.com",
        password: "hashedpassword1",
        role: "admin",
      },
      {
        name: "Admin Two",
        email: "admin2@example.com",
        password: "hashedpassword2",
        role: "admin",
      },
    ],
  });

  // Seed 3 items
  await prisma.product.createMany({
    data: [
      {
        name: "Chè lam gừng",
        price: 2500,
        category: "Truyền thống",
        description: "Chè lam vị gừng thơm ngon",
        imageUrl: ["/images/chelam-gung.jpg"],
        type: "RETAIL",
      },
      {
        name: "Chè lam đậu phộng",
        price: 2800,
        category: "Đặc sản",
        description: "Chè lam với đậu phộng giòn bùi",
        imageUrl: ["/images/chelam-dauphong.jpg"],
        type: "GIFT",
      },
      {
        name: "Chè lam dẻo",
        price: 3000,
        category: "Mới",
        description: "Chè lam dẻo mềm, vị truyền thống",
        imageUrl: ["/images/chelam-deo.jpg"],
        type: "GIFT",
      },
      {
        name: "Chè lam trà xanh",
        price: 320,
        category: "Mới",
        description: "Chè lam vị trà xanh thanh mát",
        imageUrl: ["/images/chelam-traxanh.jpg"],
        type: "RETAIL",
      },
    ],
  });

  // Seed 2 contacts
  await prisma.contact.createMany({
    data: [
      {
        name: "Nguyễn Văn A",
        email: "vana@example.com",
        phone: "0901234567",
        subject: "Hỏi về sản phẩm",
        message: "Sản phẩm chè lam có giao hàng tỉnh không?",
      },
      {
        name: "Trần Thị B",
        email: "thib@example.com",
        phone: "0987654321",
        subject: "Hợp tác",
        message: "Tôi muốn nhập chè lam về bán ở cửa hàng mình.",
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
