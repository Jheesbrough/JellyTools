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

    if (apiResponse.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    const responseData = apiResponse.data || {};
    return NextResponse.json(responseData, { status: apiResponse.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error making request:', error.message, error.response?.data);
    } else {
      console.log('Unexpected error:', error);
    }
    return NextResponse.json({ error: 'Alternative error occurred' }, { status: 500 });
  }
}