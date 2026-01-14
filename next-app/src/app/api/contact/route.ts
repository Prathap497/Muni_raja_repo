import { NextResponse } from 'next/server';

const MAX_MESSAGE_LENGTH = 2000;

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  companyWebsite?: string;
};

function isNonEmpty(value?: string) {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: Request) {
  const data = (await request.json().catch(() => null)) as ContactPayload | null;
  if (!data) {
    return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
  }

  if (isNonEmpty(data.companyWebsite)) {
    return NextResponse.json({ ok: true });
  }

  if (!isNonEmpty(data.name) || !isNonEmpty(data.email) || !isNonEmpty(data.message)) {
    return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
  }

  if (data.message && data.message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ ok: false, error: 'Message too long.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
