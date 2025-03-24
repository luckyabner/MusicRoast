import { ChatCompletionRequest } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { model, messages, temperature, max_tokens } = await request.json();

		const apiKey = process.env.V3_VOLCE_API_KEY;
		const apiUrl = process.env.V3_VOLCE_API_URL;

		if (!apiUrl) {
			return NextResponse.json(
				{ error: 'Missing V3_VOLCE_API_URL environment variable' },
				{ status: 500 }
			);
		}

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'Missing V3_VOLCE_API_KEY environment variable' },
				{ status: 500 }
			);
		}

		const requestBody: ChatCompletionRequest = {
			model,
			messages,
			stream: true,
			...(temperature !== undefined ? { temperature } : {}),
			...(max_tokens !== undefined ? { max_tokens } : {}),
		};

		// 创建一个到 Volce API 的流式请求
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const errorText = await response.text();
			return NextResponse.json(
				{ error: `API request failed with status ${response.status}: ${errorText}` },
				{ status: response.status }
			);
		}

		// 直接将响应流传递给客户端
		return new Response(response.body, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			},
		});
	} catch (error) {
		console.error('Error in API handler:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
