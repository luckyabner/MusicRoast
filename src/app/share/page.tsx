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
	const [isWechat, setIsWechat] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// 检测是否是微信浏览器
		const ua = navigator.userAgent.toLowerCase();
		const isWeixinBrowser = ua.indexOf('micromessenger') !== -1;
		setIsWechat(isWeixinBrowser);

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

	// 打开外部浏览器
	const openInBrowser = () => {
		// 获取当前URL
		const currentUrl = window.location.href;

		// 创建一个临时的文本元素
		const tempInput = document.createElement('input');
		tempInput.value = currentUrl;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand('copy');
		document.body.removeChild(tempInput);

		alert('链接已复制，请在浏览器中打开');

		// 尝试直接打开浏览器（在某些设备上可能有效）
		window.location.href = currentUrl;
	};

	const generateShareCard = async () => {
		// 如果在微信中，提示用户
		if (isWechat) {
			alert('微信内无法直接下载图片，请点击"在浏览器中打开"按钮');
			return;
		}

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
			{isWechat && (
				<div className="w-full p-3 mb-4 bg-yellow-50 text-yellow-800 rounded-md">
					<p className="text-center font-medium">在微信中无法下载图片</p>
					<Button
						onClick={openInBrowser}
						className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-white"
					>
						在浏览器中打开
					</Button>
				</div>
			)}
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
				<Button
					onClick={generateShareCard}
					disabled={isGenerating || isWechat}
					className="rounded-lg px-5 bg-blue-600 hover:bg-blue-700"
				>
					{isGenerating ? '生成中...' : '保存图片'}
				</Button>
			</div>
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
		</div>
	);
}
