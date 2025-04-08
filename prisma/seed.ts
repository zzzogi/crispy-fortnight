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

  // Seed 3 products
  await prisma.product.createMany({
    data: [
      {
        name: "Chè lam gừng",
        price: 25000,
        category: "Truyền thống",
        description: "Chè lam vị gừng thơm ngon",
        imageUrl: ["/images/chelam-gung.jpg"],
      },
      {
        name: "Chè lam đậu phộng",
        price: 28000,
        category: "Đặc sản",
        description: "Chè lam với đậu phộng giòn bùi",
        imageUrl: ["/images/chelam-dauphong.jpg"],
      },
      {
        name: "Chè lam dẻo",
        price: 30000,
        category: "Mới",
        description: "Chè lam dẻo mềm, vị truyền thống",
        imageUrl: ["/images/chelam-deo.jpg"],
      },
    ],
  });

  // Seed 3 gifts
  await prisma.gift.createMany({
    data: [
      {
        name: "Set quà Tết 1",
        price: 120000,
        category: "Tết",
        description: "Bao gồm chè lam, kẹo lạc, mứt gừng",
        imageUrl: ["/images/set-tet-1.jpg"],
      },
      {
        name: "Set quà Trung Thu",
        price: 98000,
        category: "Trung thu",
        description: "Bao gồm ô mai, chè lam, kẹo dẻo",
        imageUrl: ["/images/set-trungthu.jpg"],
      },
      {
        name: "Set quà sinh nhật",
        price: 150000,
        category: "Sinh nhật",
        description: "Hộp quà gồm chè lam và bánh ngọt",
        imageUrl: ["/images/set-sinhnhat.jpg"],
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
