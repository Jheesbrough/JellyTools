import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { useSearchParams } from 'next/navigation';
import { makeRequest, extractApiKey, handleApiResponse } from '../../utils/requestHelper';

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  const searchParams: URLSearchParams = useSearchParams();
  const baseURL = searchParams.get('baseurl');
  searchParams.delete('baseurl');
  const apiKey = extractApiKey(request.headers);

  if (!baseURL || !apiKey) {
    return NextResponse.json({ error: 'Missing baseURL or API key' }, { status: 400 });
  }

  const url = new URL(`${baseURL}/api/v1/media?` + searchParams.toString());

  try {
    const apiResponse = await makeRequest('get', url.toString(), apiKey);
    return NextResponse.json(apiResponse.data, { status: apiResponse.status });
  } catch (error) {
    console.log("Error making request to URL:", url.toString(), "Error:", error);
    return NextResponse.json({ error: 'Error making request' }, { status: 500 });
  }
}