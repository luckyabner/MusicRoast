import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ platform: string; id: string }> }
) {
	try {
		const { platform, id } = await params;

		// 检查环境变量是否存在
		const apiUrl = process.env.MUSIC_API_URL;
		// console.log(`Using API URL: ${apiUrl}, platform: ${platform}, id: ${id}`);

		if (!apiUrl) {
			return NextResponse.json(
				{ error: 'Missing MUSIC_API_URL environment variable' },
				{ status: 500 }
			);
		}

		//调用外部API
		const response = await axios.get(`${apiUrl}/music/songlist?server=${platform}&id=${id}`);

		// 返回数据
		return NextResponse.json(response.data);
	} catch (err) {
		console.error('Error in API handler:', err);
		if (axios.isAxiosError(err)) {
			return NextResponse.json(
				{ error: `API request failed: ${err.message}` },
				{ status: err.response?.status || 500 }
			);
		}

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
