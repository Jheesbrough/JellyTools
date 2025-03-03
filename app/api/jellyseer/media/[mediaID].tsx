import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { makeRequest, extractApiKey, handleApiResponse } from '../../utils/requestHelper';

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  const { pid } = request.query;

  if (!pid) {
    return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
  }

  return NextResponse.json({ message: `Post: ${pid}` }, { status: 200 });
}

export async function DELETE(request: NextApiRequest, response: NextApiResponse) {
  const { pid } = request.query;
  const baseURL = request.headers['baseurl'];
  const apiKey = extractApiKey(request.headers);

  if (!pid) {
    return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
  }

  if (!baseURL || !apiKey) {
    return NextResponse.json({ error: 'Missing baseURL or API key' }, { status: 400 });
  }

  const url = new URL(`${baseURL}/api/v1/media/${pid}`);

  try {
    const apiResponse = await makeRequest('delete', url.toString(), apiKey);
    return handleApiResponse(apiResponse, response);
  } catch (error) {
    console.log("Error making request to URL:", url.toString(), "Error:", error);
    return NextResponse.json({ error: 'Error making request' }, { status: 500 });
  }
}