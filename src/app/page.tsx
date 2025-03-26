'use client';
import { fetchSongsList } from '@/lib/data';

import InputForm from '@/components/InputForm';
import { useState, useEffect } from 'react';
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

// 设置缓存过期时间为1天（单位：毫秒）
const CACHE_TTL = 24 * 60 * 60 * 1000;

// 设置带过期时间的缓存项
const setItemWithExpiry = (key: string, value: Record<string, unknown> | string) => {
	const now = new Date();
	const item = {
		value: value,
		expiry: now.getTime() + CACHE_TTL,
	};
	localStorage.setItem(key, JSON.stringify(item));
};

// 获取缓存项，如果已过期则返回null
const getItemWithExpiry = (key: string) => {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) return null;

	try {
		const item = JSON.parse(itemStr);
		const now = new Date();

		// 检查是否是新格式的缓存（带有expiry字段）
		if (!item.expiry) {
			// 旧格式缓存，为了兼容，我们更新它的格式并设置过期时间
			setItemWithExpiry(key, item);
			return item;
		}

		// 检查是否已过期
		if (now.getTime() > item.expiry) {
			// 如果已过期，删除该项
			localStorage.removeItem(key);
			return null;
		}

		return item.value;
	} catch {
		// 如果解析JSON出错，删除该项
		localStorage.removeItem(key);
		return null;
	}
};

export default function Home() {
	const [result, setResult] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// 清理过期缓存
	useEffect(() => {
		const cleanExpiredCache = () => {
			const keys = Object.keys(localStorage);
			keys.forEach((key) => {
				if (key.startsWith('songsList_')) {
					getItemWithExpiry(key); // 这会自动检查并清理过期项
				}
			});
		};

		cleanExpiredCache();
	}, []);

	const handleFormSubmit = async (formData: FormData) => {
		setError('');
		setResult('');

		try {
			setIsLoading(true);
			const platform = formData.get('platform') as string | null;
			const id = formData.get('id') as string | null;
			const aiStyle = (formData.get('aiStyle') as keyof typeof PROMPTS) || 'sharp';
			localStorage.setItem('aiStyle', aiStyle);

			if (!platform || !id) {
				throw new Error('请提供平台和歌单ID');
			}

			// 构建缓存键
			const cacheKey = `songsList_${platform}_${id}`;
			let songsList;

			// 尝试从localStorage获取缓存的歌单
			const cachedData = getItemWithExpiry(cacheKey);

			if (cachedData) {
				// 如果有缓存，直接使用缓存数据
				songsList = cachedData;
			} else {
				// 没有缓存，从API获取数据
				songsList = await fetchSongsList(platform, id);
				// 将获取的歌单数据缓存到localStorage
				setItemWithExpiry(cacheKey, songsList);
			}

			const formattedSongs = formatSongsForAI(songsList);

			// 使用流式API
			await createChatCompletion(
				MODELS['deepseek-v3'],
				[
					{
						role: 'user',
						content: `${PROMPTS[aiStyle].content} ${formattedSongs}`,
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
