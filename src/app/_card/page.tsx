import React from 'react';

const mockData = {
	username: 'Abner',
	review:
		'这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。这个歌单简直是咖啡因过量的听觉体现！从Taylor Swift到周杰伦的混搭，像极了我的Spotify年度总结。建议改名为《凌晨三点的音乐精神分裂》，至少三首歌适合在便利店凌晨补货时听。',
	covers: [
		'https://p2.music.126.net/fQOh1ut3heT69l8IQF6ZBg==/109951164811428161.jpg',
		'https://p2.music.126.net/ovsWnGqQYBy0XC8WD1lULw==/109951163188724796.jpg',
		'https://p2.music.126.net/ssPAqFStzmN4KKsHQGrfbg==/109951169493493172.jpg',
		'https://p2.music.126.net/3XEICRFzQPrHPUMD0xm1Jw==/109951163069323980.jpg',
		'https://p2.music.126.net/3XEICRFzQPrHPUMD0xm1Jw==/109951163069323980.jpg',
		'https://p2.music.126.net/3XEICRFzQPrHPUMD0xm1Jw==/109951163069323980.jpg',
	],
};

export default function Card() {
	return (
		<div className="bg-gray-900 in-h-screen p-8">
			<div
				id="share-card"
				className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto"
			>
				{/* <!-- 网站标识 --> */}
				<div className="flex items-center mb-6">
					<div className="bg-amber-400 w-8 h-8 rounded-full mr-3"></div>
					<h1 className="text-2xl font-bold text-amber-400">MusicRoast</h1>
				</div>

				{/* <!-- 用户信息 --> */}
				<div className="mb-6">
					{/* <div className="text-sm text-gray-300 mb-1">@Abner</div> */}
					<div className="text-xl font-semibold text-white">@{mockData.username}</div>
				</div>

				{/* <!-- 评论文本 --> */}
				<div className="bg-black/30 rounded-xl p-6 mb-8">
					<p className="text-gray-100 text-lg leading-relaxed whitespace-pre-line">
						{mockData.review}
					</p>
				</div>

				{/* <!-- 专辑封面滚动区 --> */}
				<div className="flex overflow-x-hidden pb-4 space-x-4 scrollbar-hide">
					{mockData.covers.map((cover, index) => (
						<img
							key={index}
							src={cover}
							alt="cover"
							className="w-32 h-32 rounded-xl flex-shrink-0 shadow-lg hover:scale-105 transition-transform"
						/>
					))}
				</div>

				{/* <!-- 网站水印 --> */}
				<div className="mt-8 border-t border-white/10 pt-4">
					<div className="text-gray-400 text-sm">music.luckyabner.top · 专治音乐品味不服</div>
				</div>
			</div>

			{/* <!-- 生成按钮 --> */}
			<div className="mt-8 text-center">
				<button className="bg-amber-400 hover:bg-amber-300 text-black px-8 py-3 rounded-full font-bold transition-all">
					生成分享图片
				</button>
			</div>
		</div>
	);
}
