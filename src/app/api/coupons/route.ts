import { NextResponse } from 'next/server';
import { mockCoupons } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({
      success: true,
      availableCoupons: mockCoupons.filter((c) => c.isActive),
    });
  }

  const coupon = mockCoupons.find((c) => c.code === code && c.isActive);

  if (!coupon) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired promotional code.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    coupon,
  });
}
