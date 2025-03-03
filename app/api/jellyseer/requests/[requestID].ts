import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { makeRequest, extractApiKey, handleApiResponse } from '../../utils/requestHelper';

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  const { requestID } = request.query;

  if (!requestID) {
    return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
  }

  return NextResponse.json({ message: `Post: ${requestID}` }, { status: 200 });
}

export async function DELETE(request: NextApiRequest, response: NextApiResponse) {
  const { requestID } = request.query;
  const baseURL = request.headers['baseurl'];

  const apiKey = extractApiKey(request.headers);

  if (!requestID) {
    return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
  }

  if (!baseURL || !apiKey) {
    return NextResponse.json({ error: 'Missing baseURL or API key' }, { status: 400 });
  }

  const url = new URL(`${baseURL}/api/v1/request/${requestID}`);

  try {
    const apiResponse = await makeRequest('delete', url.toString(), apiKey);
    return handleApiResponse(apiResponse, response);
  } catch (error) {
    console.log("Error making request to URL:", url.toString(), "Error:", error);
    return NextResponse.json({ error: 'Error making request' }, { status: 500 });
  }
}