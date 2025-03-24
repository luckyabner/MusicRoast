'use client';
import { fetchSongsList } from '@/lib/data';

import InputForm from '@/components/InputForm';
import { useState } from 'react';
// import SongsList from '@/components/SongsList';
import AiResult from '@/components/AiResult';
import { createChatCompletion } from '@/lib/ai';
import { toast } from 'sonner';
import { PROMPTS } from '@/lib/prompts';
import { MusicIcon } from 'lucide-react';
import Footer from '@/components/Footer';
import { MODELS } from '@/lib/models';

const formatSongsForAI = (songs: { title: string; author: string }[]) => {
	return songs
		.map((song, index: number) => `${index + 1}. ${song.title} - ${song.author}`)
		.join('\n');
};

export default function Home() {
	const [result, setResult] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleFormSubmit = async (formData: FormData) => {
		setError('');
		setResult('');

		try {
			setIsLoading(true);
			const platform = formData.get('platform') as string | null;
			const id = formData.get('id') as string | null;
			const attitude = (formData.get('attitude') as keyof typeof PROMPTS) || 'sharp';

			if (!platform || !id) {
				throw new Error('请提供平台和歌单ID');
			}

			const songsList = await fetchSongsList(platform, id);
			const formattedSongs = formatSongsForAI(songsList);

			// 使用流式API
			await createChatCompletion(
				MODELS['deepseek-v3'],
				[
					{
						role: 'user',
						content: `${PROMPTS[attitude]} ${formattedSongs}`,
					},
				],
				{}, // 默认配置
				(chunk) => {
					// 逐步更新结果
					setResult((prev) => prev + chunk);
				}
			);

			setIsLoading(false);
		} catch (e) {
			console.error('获取歌单失败：', e);
			setError(e instanceof Error ? e.message : '获取数据失败，请稍后再试');
			toast.error('请求失败', {
				description: e instanceof Error ? e.message : '获取数据失败，请稍后再试',
				action: {
					label: '重试',
					onClick: () => handleFormSubmit(formData),
				},
			});
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<>
			<div className="absolute top-0 z-[-2] min-h-screen w-screen transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]">
				<div className="max-w-7xl min-h-screen mx-auto px-4 flex flex-col sm:px-6 lg:px-8">
					<div className="flex flex-col justify-center items-center py-12 space-y-2">
						<div className="flex items-center gap-3 animate-fade-in">
							<MusicIcon className="h-8 w-8 text-purple-500" />
							<h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
								AI 乐怼
							</h1>
						</div>
						<p className="text-muted-foreground font-medium text-lg max-w-xl text-center">
							锐评您的音乐品味，让歌单更有温度
						</p>
						<div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full my-2"></div>
					</div>

					<div className="flex-1">
						<div className="mx-auto px-4 grid md:grid-cols-2 gap-8 items-stretch ">
							<InputForm
								onSubmit={handleFormSubmit}
								isLoading={isLoading}
							/>
							<AiResult
								result={result}
								isLoading={isLoading}
								error={error}
							/>
						</div>
					</div>
					<Footer />
				</div>
			</div>
		</>
	);
}
