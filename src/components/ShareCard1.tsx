import React from 'react';
import '../app/card.css';

interface CardProps {
	username: string;
	review: string;
}

export default function ShareCard1({ username, review }: CardProps) {
	return (
		<div
			id="share-card"
			className="rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto"
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
			<div className="mb-6">
				<div
					className="text-xl font-semibold"
					style={{ color: '#fecdd3' }}
				>
					@{username}
				</div>
			</div>

			{/* <!-- 评论文本 --> */}
			<div
				className="rounded-xl p-6 mb-8"
				style={{ backgroundColor: '#44403c' }}
			>
				<p
					className="text-lg leading-relaxed whitespace-pre-line"
					style={{ color: '#f5f5f4' }}
				>
					{review}
				</p>
			</div>

			{/* <!-- 网站水印 --> */}
			<div
				className="mt-8 pt-4"
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
