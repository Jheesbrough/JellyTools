import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { baseURL, path, query, apiKey, headerType } = await request.json();

  const url = new URL(`${baseURL}/${path}`);
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));

  try {
    const headers = {
      "Content-Type": "application/json",
      [headerType]: apiKey,
    };

    const response = await axios({
      method: 'get',
      url: url.toString(),
      headers: headers,
      timeout: 10000,
      validateStatus: function (status: number) {
        return status >= 200 && status < 300; // default
      },
      maxRedirects: 5,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.log("Error making request:", error);
    return NextResponse.json({ error: 'Error making request' }, { status: 500 });
  }
}
