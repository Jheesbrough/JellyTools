import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { makeRequest, handleApiResponse } from '../../utils/requestHelper';
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

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  const { requestID } = request.query;

  if (!requestID) {
    return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
  }

  try {
    const { baseURL, apiKey } = await getBaseURLAndApiKey(request);
    const url = new URL(`${baseURL}/api/v1/request/${requestID}`);
    const apiResponse = await makeRequest('get', url, apiKey);
    return handleApiResponse(apiResponse, response);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

export async function DELETE(request: NextApiRequest, response: NextApiResponse) {
  const { requestID } = request.query;

  if (!requestID) {
    return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
  }

  try {
    const { baseURL, apiKey } = await getBaseURLAndApiKey(request);
    const url = new URL(`${baseURL}/api/v1/request/${requestID}`);
    const apiResponse = await makeRequest('delete', url, apiKey);
    return handleApiResponse(apiResponse, response);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}