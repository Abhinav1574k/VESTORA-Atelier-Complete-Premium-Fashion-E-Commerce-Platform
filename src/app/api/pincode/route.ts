import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin')?.trim();

  if (!pin || !/^\d{6}$/.test(pin)) {
    return NextResponse.json(
      { success: false, message: 'Invalid 6-digit Indian PIN code.' },
      { status: 400 }
    );
  }

  const prefix2 = pin.substring(0, 2);
  let city = 'Regional Hub';
  let state = 'India';
  let estimatedDays = 3;
  let isExpress = true;

  if (prefix2 === '11') { city = 'New Delhi'; state = 'Delhi'; estimatedDays = 1; }
  else if (prefix2 === '40') { city = 'Mumbai'; state = 'Maharashtra'; estimatedDays = 1; }
  else if (prefix2 === '56') { city = 'Bengaluru'; state = 'Karnataka'; estimatedDays = 2; }
  else if (prefix2 === '60') { city = 'Chennai'; state = 'Tamil Nadu'; estimatedDays = 2; }
  else if (prefix2 === '70') { city = 'Kolkata'; state = 'West Bengal'; estimatedDays = 2; }
  else if (prefix2 === '50') { city = 'Hyderabad'; state = 'Telangana'; estimatedDays = 2; }
  else if (prefix2 === '38') { city = 'Ahmedabad'; state = 'Gujarat'; estimatedDays = 2; }
  else if (prefix2 === '30') { city = 'Jaipur'; state = 'Rajasthan'; estimatedDays = 2; }
  else { estimatedDays = 4; isExpress = false; }

  return NextResponse.json({
    success: true,
    pin,
    city,
    state,
    estimatedDays,
    isExpressAvailable: isExpress,
    couriers: ['BlueDart Apex Air', 'Delhivery Express', 'India Post SpeedPost'],
    message: `Delivery available to ${city}, ${state} within ${estimatedDays} business days.`,
  });
}
