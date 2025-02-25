import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { baseURL, path, query, apiKey, headerType, method, data } = await request.json();

  const url = new URL(`${baseURL}/${path}`);
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));

  try {
    const headers = {
      "Content-Type": "application/json",
      [headerType]: apiKey,
    };

    const response = await axios({
      method: method || 'get',
      url: url.toString(),
      headers: headers,
      data: data || {},
      timeout: 10000,
      validateStatus: function (status: number) {
        return status >= 200 && status < 300;
      },
      maxRedirects: 5,
    });

    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }

    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      return NextResponse.json(response.data, { status: response.status });
    } else {
      return new Response(response.data, { status: response.status });
    }
  } catch (error) {
    console.log("Error making request to URL:", url.toString(), "Error:", error);
    return NextResponse.json({ error: 'Error making request' }, { status: 500 });
  }
}
