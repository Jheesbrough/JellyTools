import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { makeRequest } from '../../utils/requestHelper';

export async function GET(request: NextApiRequest) {
  if (!request.url) {
    return NextResponse.json({ error: 'Invalid request URL' }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const baseURL = searchParams.get('baseurl');
  searchParams.delete('baseurl');

  const apiKey = (await headers()).get('X-Api-Key');

  if (!baseURL || !apiKey) {
    return NextResponse.json({ error: 'Missing baseURL or API key' }, { status: 400 });
  }

  const url = new URL(`api/v1/media?${searchParams.toString()}`, baseURL);

  return makeRequest('get', url, apiKey);
}