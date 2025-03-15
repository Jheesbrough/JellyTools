export const runtime = 'edge';

import { sendAxiosJellyRequest } from '@/utils/axiosUtil';
import { APIresponse } from '@/utils/types';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function getBaseURLAndApiKey(request: NextRequest): Promise<{ baseURL: string, apiKey: string, searchParams: URLSearchParams }> {
  if (!request.url) { throw new Error('Invalid request URL'); }
  const { searchParams } = new URL(request.url);
  const baseURL = searchParams.get('baseurl');
  searchParams.delete('baseurl');
  const apiKey = (await headers()).get('X-Api-Key');

  if (!baseURL || !apiKey) { throw new Error('Missing baseURL or API key'); }

  return { baseURL, apiKey, searchParams };
}

/**
 * A regular expression to validate API routes.
 *
 * The valid routes are:
 * - `media`
 * - `request`
 * - `settings/about`
 * - `media/<32-character-hex>/file`
 * - `media/<32-character-hex>`
**/
const validRoutesRegex = /^(media|request|settings\/about|media\/[a-f0-9]{32}\/file|media\/[a-f0-9]{32})$/;

export async function GET(request: NextRequest, { params }: { params: Promise<{ apiroute: string[] }> }): Promise<NextResponse> {
  const apiroute = (await params).apiroute.join('/');

  if (!validRoutesRegex.test(apiroute)) {
    return NextResponse.json({ error: 'Invalid API route' }, { status: 400 });
  }

  const { baseURL, apiKey, searchParams } = await getBaseURLAndApiKey(request);
  const url = new URL(`/api/v1/${apiroute}`, baseURL);
  url.search = searchParams.toString();
  return makeRequest('get', url, apiKey);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ apiroute: string[] }> }): Promise<NextResponse> {
  const apiroute = (await params).apiroute.join('/');

  if (!validRoutesRegex.test(apiroute) || apiroute === 'media' || apiroute === 'request') {
    return NextResponse.json({ error: 'API route not allowed' }, { status: 400 });
  }

  const { baseURL, apiKey } = await getBaseURLAndApiKey(request);
  const url = new URL(`/api/v1/${apiroute}`, baseURL);
  return makeRequest('delete', url, apiKey);
}

function validateHttpUrl(url: URL): void {
  if (!url.protocol.startsWith('http') && !url.protocol.startsWith('https')) {
    throw new Error('Invalid URL protocol');
  }
}

async function makeRequest(method: 'get' | 'delete', url: URL, apiKey: string): Promise<NextResponse> {
  validateHttpUrl(url);

  const response: APIresponse = await sendAxiosJellyRequest(url, method, { 'X-Api-Key': apiKey });
  return NextResponse.json(response, { status: 200 });
}