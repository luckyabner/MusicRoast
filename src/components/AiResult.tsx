'use client';
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Copy, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AiResultProps {
	result: string;
	isLoading?: boolean;
	error?: string;
}

export default function AiResult({ result, isLoading = false, error = '' }: AiResultProps) {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const handleCopy = () => {
		navigator.clipboard.writeText(result);
		alert('已复制到剪贴板');
	};

	// 当结果更新时自动滚动到底部
	useEffect(() => {
		if (result && scrollAreaRef.current) {
			const scrollElement = scrollAreaRef.current.querySelector(
				'[data-radix-scroll-area-viewport]'
			);
			if (scrollElement) {
				scrollElement.scrollTop = scrollElement.scrollHeight;
			}
		}
	}, [result]);

	const handleShare = () => {
		localStorage.setItem('music-roast-share', result);
		router.push(`/share`);
	};
	if (error) {
		return <div>出错了</div>;
	}

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>AI 锐评</CardTitle>
				<CardDescription>基于你的歌单生成的个性化点评</CardDescription>
			</CardHeader>
			<CardContent>
				{!isLoading && !result ? (
					<div className="flex items-center justify-center py-8">
						<p className="text-muted-foreground">请输入歌单ID后点击提交</p>
					</div>
				) : isLoading && !result ? (
					<div className="flex items-center justify-center py-8">
						<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
					</div>
				) : (
					<ScrollArea ref={scrollAreaRef}>
						<div className="max-h-[320px] overflow-y-auto prose dark:prose-incert">
							<ReactMarkdown>{result}</ReactMarkdown>
						</div>
					</ScrollArea>
				)}
			</CardContent>
			{result && (
				<CardFooter className="flex items-center gap-2">
					<Button
						variant="outline"
						className="flex-1"
						onClick={handleCopy}
						disabled={isLoading}
					>
						<Copy className="h-4 w-4 mr-2" />
						复制结果
					</Button>
					<Button
						variant="outline"
						className="flex-1"
						onClick={handleShare}
						disabled={isLoading}
					>
						<Share2 className="h-4 w-4 mr-2" />
						分享卡片
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
