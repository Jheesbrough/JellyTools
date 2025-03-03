import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { makeRequest } from '../../utils/requestHelper';
import { headers } from 'next/headers';

async function getBaseURLAndApiKey(request: NextApiRequest) {
  if (!request.url) { throw new Error('Invalid request URL'); }
  const { searchParams } = new URL(request.url);
  const baseURL = searchParams.get('baseurl');
  searchParams.delete('baseurl');
  const apiKey = (await headers()).get('X-Api-Key');

  if (!baseURL || !apiKey) { throw new Error('Missing baseURL or API key'); }

  return { baseURL, apiKey, searchParams };
}

export async function GET(request: NextApiRequest, { params }: { params: Promise<{ requestID: string }> }) {
  const requestID = (await params).requestID;

  if (!requestID) {
    return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
  }

  const { baseURL, apiKey } = await getBaseURLAndApiKey(request);
  const url = new URL(`api/v1/request/${requestID}`, baseURL);
  return makeRequest('get', url, apiKey);
}

export async function DELETE(request: NextApiRequest) {
  const { requestID } = request.query;

  if (!requestID) {
    return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
  }

  const { baseURL, apiKey } = await getBaseURLAndApiKey(request);
  const url = new URL(`api/v1/request/${requestID}`, baseURL);
  return makeRequest('delete', url, apiKey);
}