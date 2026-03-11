import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // We expect a user to be logged in for checking out based on the prompt instructions
    if (!session || !session.user || !session.user.id) {
       return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to test this checkout flow.' },
        { status: 401 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalPrice,
    } = await req.json();

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is successful, save order
      await connectToDatabase();
      
      const newOrder = new Order({
        userId: session.user.id,
        items,
        totalPrice,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'paid',
      });
      
      await newOrder.save();

      return NextResponse.json(
        { message: 'Payment verified successfully and order saved' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid signature sent!' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

