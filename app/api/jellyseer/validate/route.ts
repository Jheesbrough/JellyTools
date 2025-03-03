import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { makeRequest, handleApiResponse } from '@/app/api/utils/requestHelper';
import { headers } from 'next/headers';

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  if (!request.url) {
    return NextResponse.json({ error: 'Invalid request URL' }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const baseURL = searchParams.get('baseurl');
  searchParams.delete('baseurl');

  console.log("Headers:", request.headers);

  const headersList = await headers();
  const apiKey = headersList.get('X-Api-Key');


  console.log("Received GET request for validation");
  console.log("Base URL:", baseURL);
  console.log("API Key:", apiKey);

  if (!baseURL || !apiKey) {
    console.log("Missing baseURL or API key");
    return NextResponse.json({ error: 'Missing baseURL or API key' }, { status: 400 });
  }

  const url = new URL(`${baseURL}/settings/about`);
  console.log("Constructed URL:", url.toString());

  try {
    const apiResponse = await makeRequest('get', url.toString(), apiKey);
    console.log("API response received:", apiResponse.data);
    return NextResponse.json({ message: 'API is valid' }, { status: 200 });
  } catch (error) {
    console.log("Error making request to URL:", url.toString(), "Error:", error);
    return NextResponse.json({ error: 'Error validating API' }, { status: 500 });
  }
}
