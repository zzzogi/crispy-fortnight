import { payOS } from "@/app/libs/payos";
import { NextResponse, NextRequest } from "next/server";
import { CheckoutRequestType } from "@payos/node/lib/type";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderCode, amount, description, items, returnUrl, cancelUrl } = body;

  const paymentLinkBody: CheckoutRequestType = {
    orderCode,
    amount,
    description,
    items,
    returnUrl,
    cancelUrl,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(paymentLinkBody);

    return NextResponse.json(paymentLinkResponse, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
