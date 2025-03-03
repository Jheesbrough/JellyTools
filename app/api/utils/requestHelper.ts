import axios from 'axios';
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

function validateHttpUrl(url: URL) {
  if (!url.protocol.startsWith('http') && !url.protocol.startsWith('https')) {
    throw new Error('Invalid URL protocol');
  }
}

export async function makeRequest(method: 'get' | 'delete', url: URL, apiKey: string) {
  validateHttpUrl(url);
  console.log('Making request to URL:', url.toString());
  const headers = {
    "Content-Type": "application/json",
    "X-Api-Key": apiKey,
  };

  try {
    const apiResponse = await axios({
      method: method,
      url: url.toString(),
      headers: headers,
      timeout: 10000,
      validateStatus: function (status: number) {
        return status >= 200 && status < 300;
      },
      maxRedirects: 5,
    });

    const responseData = apiResponse.data || {};
    return NextResponse.json(responseData, { status: apiResponse.status });
  } catch (error) {
    return NextResponse.json({ error: 'Error making request' }, { status: 500 });
  }
}