export type ChatMessage = {
	role: 'user' | 'assistant' | 'system';
	content: string;
};

export type ChatCompletionRequest = {
	model: string;
	messages: ChatMessage[];
	temperature?: number;
	max_tokens?: number;
	stream?: boolean;
};

export type ChatCompletionResponse = {
	id: string;
	created: number;
	model: string;
	choices: {
		index: number;
		message: ChatMessage;
		finish_reason: string;
	}[];
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
};

/**
 * 向AI发送消息并获取回复
 * @param model 要使用的模型名称
 * @param messages 聊天消息数组
 * @param options 可选项
 * @returns 聊天完成响应
 * @param onChunk 接收每个文本块的回调函数
 */
export async function createChatCompletion(
	model: string,
	messages: ChatMessage[],
	options: { temperature?: number; max_tokens?: number } = {},
	onChunk: (chunk: string) => void
): Promise<void> {
	const requestBody: ChatCompletionRequest = {
		model,
		messages,
		stream: true, // 启用流式传输
		...options,
	};

	try {
		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage;
			try {
				const errorJson = JSON.parse(errorText);
				errorMessage = errorJson.error || errorText;
			} catch {
				errorMessage = errorText;
			}
			throw new Error(`API request failed: ${errorMessage}`);
		}

		if (!response.body) {
			throw new Error('Response body is null');
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value, { stream: true });

			// 解析SSE数据
			const lines = chunk
				.split('\n')
				.filter((line) => line.startsWith('data: ') && !line.includes('[DONE]'));

			for (const line of lines) {
				try {
					const jsonStr = line.replace('data: ', '').trim();
					const data = JSON.parse(jsonStr);
					const content = data.choices?.[0]?.delta?.content || '';
					if (content) {
						onChunk(content);
					}
				} catch (e) {
					console.error('Error parsing SSE chunk:', e);
				}
			}
		}
	} catch (error) {
		console.error('Error calling API:', error);
		throw error;
	}
}
