import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import axios from 'axios';

async function getBaseURLAndApiKey(request: NextApiRequest) {
    if (!request.url) { throw new Error('Invalid request URL'); }
    const { searchParams } = new URL(request.url);
    const baseURL = searchParams.get('baseurl');
    searchParams.delete('baseurl');
    const apiKey = (await headers()).get('X-Api-Key');

    if (!baseURL || !apiKey) { throw new Error('Missing baseURL or API key'); }

    return { baseURL, apiKey, searchParams };
}

/**
 * A regular expression to validate API routes.
 *
 * The valid routes are:
 * - `media`
 * - `request`
 * - `settings/about`
 * - `media/<32-character-hex>/file`
 * - `media/<32-character-hex>`
**/

const validRoutesRegex = /^(media|request|settings\/about|media\/[a-f0-9]{32}\/file|media\/[a-f0-9]{32})$/;

export async function GET(request: NextApiRequest, { params }: { params: Promise<{ apiroute: string[] }> }) {
    const apiroute = (await params).apiroute.join('/');

    if (!validRoutesRegex.test(apiroute)) {
        return NextResponse.json({ error: 'Invalid API route' }, { status: 400 });
    }

    const { baseURL, apiKey, searchParams } = await getBaseURLAndApiKey(request);
    const url = new URL(`/api/v1/${apiroute}`, baseURL);
    url.search = searchParams.toString();
    return makeRequest('get', url, apiKey);
}

export async function DELETE(request: NextApiRequest, { params }: { params: Promise<{ apiroute: string[] }> }) {
    const apiroute = (await params).apiroute.join('/');

    if (!validRoutesRegex.test(apiroute) || apiroute === 'media' || apiroute === 'request') {
        return NextResponse.json({ error: 'API route not allowed' }, { status: 400 });
    }

    const { baseURL, apiKey } = await getBaseURLAndApiKey(request);
    const url = new URL(`/api/v1/${apiroute}`, baseURL);
    return makeRequest('delete', url, apiKey);
}

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