import { NextResponse } from 'next/server';

// Brevo (Sendinblue) contact endpoint. Wire BREVO_API_KEY + BREVO_LIST_ID in
// the vault / env and this pushes every captured lead into the "RealEstateDecide
// Leads" list with the correct tag. Without the key it returns 501 so the UI
// falls back to local capture — fully testable before marketing creds exist.
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID || '3'; // default: your first list
const BREVO_API = 'https://api.brevo.com/v3';

type LeadBody = {
  email?: string;
  name?: string;
  source?: 'homepage' | 'free-calculator';
};

// Map capture source → Brevo tag. Buyer is added separately by the Stripe webhook.
const TAG_BY_SOURCE: Record<string, string> = {
  homepage: 'Subscriber',
  'free-calculator': 'Free-User',
};

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid email' }, { status: 400 });
  }

  if (!BREVO_API_KEY) {
    // Backend not wired yet — 501 tells the client to record locally.
    return NextResponse.json({ ok: false, error: 'backend not configured' }, { status: 501 });
  }

  const tag = TAG_BY_SOURCE[body.source || ''] || 'Subscriber';

  try {
    // Upsert contact (Brevo createContact with email + updateEnabled creates or updates).
    const res = await fetch(`${BREVO_API}/contacts`, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: { FNAME: body.name || '', SOURCE: body.source || '', TAGS: [tag] },
        listIds: [Number(BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Brevo contact create failed', res.status, detail);
      return NextResponse.json({ ok: false }, { status: 502 });
    }

    return NextResponse.json({ ok: true, tag });
  } catch (e) {
    console.error('Brevo upstream error', e);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
