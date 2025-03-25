import React from 'react';
import '../app/card.css';

interface CardProps {
	// username: string;
	review: string;
	style: string;
}

export default function ShareCard1({ review, style }: CardProps) {
	return (
		<div
			id="share-card"
			className="rounded-2xl p-8 shadow-2xl max-w-2xl mx-4"
			style={{ backgroundColor: '#292524' }}
		>
			{/* <!-- 网站标识 --> */}
			<div className="flex items-center mb-6">
				<div
					className="w-8 h-8 rounded-full mr-3"
					style={{ backgroundColor: '#f43f5e' }}
				></div>
				<h1
					className="text-2xl font-bold"
					style={{ color: '#f43f5e' }}
				>
					MusicRoast
				</h1>
			</div>

			{/* <!-- 用户信息 --> */}
			{/* <div className="mb-6">
				<div
					className="text-xl font-semibold"
					style={{ color: '#fecdd3' }}
				>
					@{username}
				</div>
			</div> */}

			{/* <!-- 态度标签 --> */}
			<div className="mb-4">
				<div
					className="rounded-full ml-2 font-semibold whitespace-nowrap"
					style={{ color: '#fda4af' }}
				>
					Style: {style}
				</div>
			</div>

			{/* <!-- 评论文本 --> */}
			<div
				className="rounded-xl p-6 mb-4"
				style={{
					backgroundColor: '#44403c',
				}}
			>
				<p
					className="text-lg pb-6 leading-relaxed whitespace-pre-line"
					style={{ color: '#f5f5f4' }}
				>
					{review}
				</p>
			</div>

			{/* <!-- 网站水印 --> */}
			<div
				className=" pt-4"
				style={{ borderTop: '1px solid #57534e' }}
			>
				<div
					className="text-sm"
					style={{ color: '#fda4af' }}
				>
					music.luckyabner.top · 锐评您的音乐品味
				</div>
			</div>
		</div>
	);
}
