import PayOS from "@payos/node";

const globalForPayOS = global as unknown as { payOS: PayOS };

export const payOS =
  globalForPayOS.payOS ||
  new PayOS(
    process.env.PAYOS_CLIENT_ID!,
    process.env.PAYOS_API_KEY!,
    process.env.PAYOS_CHECKSUM_KEY!,
  );

if (process.env.NODE_ENV !== "production") globalForPayOS.payOS = payOS;
