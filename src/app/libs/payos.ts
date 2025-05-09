import PayOS from "@payos/node";

const globalForPayOS = global as unknown as { payOS: PayOS };

export const payOS =
  globalForPayOS.payOS ||
  new PayOS(
    process.env.NODE_ENV === "production"
      ? process.env.PAYOS_CLIENT_ID!
      : process.env.NEXT_PUBLIC_PAYOS_TEST_CLIENT_ID!,
    process.env.NODE_ENV === "production"
      ? process.env.PAYOS_API_KEY!
      : process.env.NEXT_PUBLIC_PAYOS_TEST_API_KEY!,
    process.env.NODE_ENV === "production"
      ? process.env.PAYOS_CHECKSUM_KEY!
      : process.env.NEXT_PUBLIC_PAYOS_TEST_CHECKSUM_KEY!
  );

if (process.env.NODE_ENV !== "production") globalForPayOS.payOS = payOS;
