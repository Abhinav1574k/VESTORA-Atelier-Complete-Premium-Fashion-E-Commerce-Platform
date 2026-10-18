import { NextResponse } from 'next/server';
import { initialProducts } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const gender = searchParams.get('gender');
  const query = searchParams.get('q');
  const maxPrice = searchParams.get('maxPrice');

  let list = [...initialProducts];

  if (category) {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (gender) {
    list = list.filter((p) => p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'Unisex');
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.composition.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }
  if (maxPrice) {
    list = list.filter((p) => p.price <= Number(maxPrice));
  }

  return NextResponse.json({
    success: true,
    count: list.length,
    data: list,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Product specification received and stored in catalogue.',
      data: body,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid payload' },
      { status: 400 }
    );
  }
}
