import axios from 'axios';
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function makeRequest(method: 'get' | 'delete', url: string, apiKey: string) {
  const headers = {
    "Content-Type": "application/json",
    "X-Api-Key": apiKey,
  };

  return axios({
    method: method,
    url: url,
    headers: headers,
    timeout: 10000,
    validateStatus: function (status: number) {
      return status >= 200 && status < 300;
    },
    maxRedirects: 5,
  });
}

export function handleApiResponse(apiResponse: any, response: NextApiResponse) {
  return NextResponse.json(apiResponse.data, { status: apiResponse.status });
}