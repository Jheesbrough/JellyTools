import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { makeRequest } from '../../utils/requestHelper';
import { headers } from 'next/headers';

export async function GET(request: NextApiRequest, response: NextApiResponse) {
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

  const url = new URL(`api/v1/request?${searchParams.toString()}`, baseURL);

  return makeRequest('get', url, apiKey);
}