import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

interface ChatRequestBody {
	model: string;
	prompt: string;
}

export async function POST(request: NextRequest) {
	try {
		if (!request.body) {
			return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
		}

		const { model, prompt } = (await request.json()) as ChatRequestBody;

		if (!model || !prompt) {
			return NextResponse.json(
				{ error: 'Missing required parameters: model and prompt are required' },
				{ status: 400 }
			);
		}

		const apiKey = process.env.V3_VOLCE_API_KEY as string;
		const apiUrl = process.env.V3_VOLCE_API_URL as string;

		if (!apiUrl || !apiKey) {
			console.error('API key or URL is not set');
			return NextResponse.json({ error: 'API key or URL is not set' }, { status: 500 });
		}

		const openai = createOpenAI({
			baseURL: apiUrl,
			apiKey: apiKey,
		});

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒后自动终止请求

		const result = streamText({
			model: openai(model),
			prompt: prompt,
			abortSignal: controller.signal,
			onError({ error }) {
				console.error(error);
				clearTimeout(timeoutId); // 清除定时器
			},
		});

		clearTimeout(timeoutId); // 清除定时器

		return result.toDataStreamResponse();
	} catch (error) {
		console.error('Error in API handler:', error);

		// 区分错误类型返回不同状态码
		if (error instanceof SyntaxError) {
			return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
		} else if (error instanceof Error && error.name === 'AbortError') {
			return NextResponse.json({ error: 'Request timeout' }, { status: 408 });
		}

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
