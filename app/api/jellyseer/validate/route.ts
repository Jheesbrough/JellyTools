import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { makeRequest } from '@/app/api/utils/requestHelper';
import { headers } from 'next/headers';

export async function GET(request: NextApiRequest) {
  if (!request.url) return NextResponse.json({ error: 'Invalid request URL' }, { status: 400 });

  const baseURL = new URL(request.url).searchParams.get('baseurl');
  console.log(baseURL + " is the base URL");
  const apiKey = (await headers()).get('X-Api-Key');

  if (!baseURL || !apiKey) { return NextResponse.json({ error: 'Missing baseURL or API key' }, { status: 400 }); }

  const url = new URL(`api/v1/settings/about`, baseURL);

  try {
    makeRequest('get', url, apiKey);
    return NextResponse.json({ message: 'API is valid' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'API is invalid' }, { status: 400 });
  }
}
