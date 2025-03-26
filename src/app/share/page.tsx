'use client';
import ShareCard1 from '@/components/ShareCard1';
import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import domtoimage from 'dom-to-image-more';
import { useRouter } from 'next/navigation';

const defaultData = {
	aiStyle: '舔狗',
	review:
		'这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。',
};

export default function SharePage() {
	const cardRef = useRef<HTMLDivElement>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [result, setResult] = useState('');
	const [aiStyle, setAiStyle] = useState('');
	const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		// 尝试从localStorage获取
		const savedResult = localStorage.getItem('music-roast-share');
		const aiStyle = localStorage.getItem('aiStyle');
		if (aiStyle) {
			setAiStyle(aiStyle);
		} else {
			setAiStyle(defaultData.aiStyle);
		}
		if (savedResult) {
			setResult(savedResult);
		} else {
			setResult('数据已过期，请重新生成');
		}
	}, []);

	// 页面加载后自动生成图片
	useEffect(() => {
		if (result && aiStyle) {
			generateShareCard();
		}
	}, [result, aiStyle]); // 当评论内容和风格加载完成后执行

	const generateShareCard = async () => {
		if (!cardRef.current) return;
		setIsGenerating(true);
		setGeneratedImageUrl(null);

		try {
			// 确保字体和其他资源已加载
			await document.fonts.ready;
			// 添加短暂延迟确保渲染完成
			await new Promise((resolve) => setTimeout(resolve, 300));

			// 创建一个新的容器来精确控制导出区域
			const node = cardRef.current;

			// 记录原始宽度
			const originalWidth = node.style.width;
			const originalMaxWidth = node.style.maxWidth;

			// 直接设置样式属性
			node.style.width = '670px';
			node.style.maxWidth = 'none';

			// 使用3倍缩放以提高分辨率
			const scale = 3;

			const dataUrl = await domtoimage.toPng(node, {
				quality: 1,
				bgcolor: 'transparent',
				height: node.offsetHeight * scale,
				width: node.offsetWidth * scale,
				style: {
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
				},
				cacheBust: true, // 强制刷新样式
			});

			// 恢复原始样式
			node.style.width = originalWidth;
			node.style.maxWidth = originalMaxWidth;

			// 所有设备都显示图片
			setGeneratedImageUrl(dataUrl);

			// const link = document.createElement('a');
			// link.download = `MusicRoast_${Date.now()}.png`;
			// link.href = dataUrl;
			// link.click();

			// 清除localStorage
			// localStorage.removeItem('music-roast-share');
			// localStorage.removeItem('aiStyle');
		} catch (error) {
			console.error('生成失败:', error);
		} finally {
			setIsGenerating(false);
		}
	};

	// 下载图片函数
	// const downloadImage = () => {
	// 	if (!generatedImageUrl) return;

	// 	const link = document.createElement('a');
	// 	link.download = `MusicRoast_${Date.now()}.png`;
	// 	link.href = generatedImageUrl;
	// 	link.click();

	// 	// 清除localStorage
	// 	localStorage.removeItem('music-roast-share');
	// 	localStorage.removeItem('aiStyle');
	// };
	// 下载图片函数
	const downloadImage = () => {
		if (!generatedImageUrl) return;

		const link = document.createElement('a');
		link.download = `MusicRoast_${Date.now()}.png`;
		link.href = generatedImageUrl;
		link.click();
	};

	return (
		<div className="flex flex-col items-center min-h-screen justify-center">
			<div className="my-6 flex gap-6 justify-center">
				<Button
					variant="outline"
					className="rounded-lg px-5"
					onClick={() => {
						if (window.history.length > 1) {
							window.history.back();
						} else {
							router.push('/');
						}
					}}
				>
					返回
				</Button>
				{generatedImageUrl && (
					<Button
						onClick={downloadImage}
						className="rounded-lg px-5 bg-blue-600 hover:bg-blue-700"
					>
						下载图片
					</Button>
				)}
			</div>
			{/* 生成图片之前显示卡片原始内容 */}
			{!generatedImageUrl && (
				<div
					ref={cardRef}
					className="inline-block mb-4"
					style={{
						boxShadow: 'none',
						border: 'none',
						margin: 0,
						padding: 0,
						background: 'transparent !important',
						isolation: 'isolate',
					}}
				>
					<ShareCard1
						style={aiStyle}
						review={result}
					/>
				</div>
			)}

			{/* 加载中提示 */}
			{isGenerating && (
				<div className="my-6 text-center">
					<p className="text-gray-600">正在生成您的分享图片，请稍候...</p>
				</div>
			)}

			{/* 生成后的图片显示区域 */}
			{generatedImageUrl && (
				<div className="mt-2 p-4 border rounded-lg bg-white shadow-md w-full max-w-xl mx-auto">
					<p className="mb-4 text-center font-medium text-gray-700">
						图片已生成，可长按保存或点击上方按钮下载
					</p>
					<div className="flex justify-center">
						<img
							src={generatedImageUrl}
							alt="分享卡片"
							className="rounded-lg w-full"
							style={{
								WebkitTouchCallout: 'default',
								maxWidth: '100%',
								height: 'auto',
								objectFit: 'contain',
							}}
						/>
					</div>
					<p className="mt-3 text-sm text-center text-gray-500">提示：移动设备可长按图片保存</p>
				</div>
			)}
		</div>
	);
}
