import { NextResponse } from 'next/server';
import { initialProducts, mockCoupons } from '@/data/products';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, couponCode, shippingMethod, paymentMethod, shippingAddress } = body;

    if (!items || !items.length) {
      return NextResponse.json(
        { success: false, message: 'Shopping bag is empty.' },
        { status: 400 }
      );
    }

    // Verify prices server-side to prevent manipulation
    let calculatedSubtotal = 0;
    for (const item of items) {
      const dbProduct = initialProducts.find((p) => p.id === item.productId);
      if (!dbProduct) {
        return NextResponse.json(
          { success: false, message: `Product ${item.productId} not found.` },
          { status: 404 }
        );
      }
      calculatedSubtotal += dbProduct.price * (item.quantity || 1);
    }

    // Calculate coupon discount
    let discountAmount = 0;
    if (couponCode) {
      const coupon = mockCoupons.find((c) => c.code === couponCode.toUpperCase() && c.isActive);
      if (coupon && calculatedSubtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
        } else {
          discountAmount = coupon.discountValue;
        }
      }
    }

    // Calculate shipping
    const shippingFee = calculatedSubtotal > 2999 ? 0 : shippingMethod === 'express' ? 250 : 0;
    const taxableAmount = Math.max(0, calculatedSubtotal - discountAmount);
    const tax = Math.round(taxableAmount * 0.05);
    const total = taxableAmount + shippingFee + tax;

    const orderId = `VST-${Date.now().toString().slice(-6)}`;

    return NextResponse.json({
      success: true,
      message: 'Order verified and sandbox payment authorized.',
      order: {
        orderId,
        subtotal: calculatedSubtotal,
        discount: discountAmount,
        shippingFee,
        tax,
        total,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending COD' : 'Verified (Sandbox)',
        trackingAirwayBill: `BLUEDART-VST-${orderId}`,
        estimatedDelivery: '3 Business Days',
        shippingAddress: shippingAddress || null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server processing error.' },
      { status: 500 }
    );
  }
}
