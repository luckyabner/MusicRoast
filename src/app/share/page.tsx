'use client';
import ShareCard1 from '@/components/ShareCard1';
import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import domtoimage from 'dom-to-image-more';

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
			// 可选：读取后清除
			// localStorage.removeItem('music-roast-share');
		} else {
			setResult('数据已过期，请重新生成');
		}
	}, []);

	const generateShareCard = async () => {
		if (!cardRef.current) return;
		setIsGenerating(true);

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

			const link = document.createElement('a');
			link.download = `MusicRoast_${Date.now()}.png`;
			link.href = dataUrl;
			link.click();

			// 清除localStorage
			localStorage.removeItem('music-roast-share');
			localStorage.removeItem('aiStyle');
		} catch (error) {
			console.error('生成失败:', error);
		} finally {
			setIsGenerating(false);
		}
	};
	return (
		<div className="flex flex-col items-center min-h-screen justify-center">
			{/* 添加额外的包装器并应用精确样式控制 */}
			<div
				ref={cardRef}
				className="inline-block" // 使元素的宽度刚好包裹内容
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
			<Button
				className="mt-4"
				onClick={generateShareCard}
				disabled={isGenerating}
			>
				{isGenerating ? '生成中...' : '保存图片'}
			</Button>
		</div>
	);
}
