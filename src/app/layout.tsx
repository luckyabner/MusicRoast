import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'MusicRoast-乐怼',
	description: 'AI 音乐锐评，基于你的歌单生成个性化点评',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`font-mono antialiased bg-background`}>{children}</body>
		</html>
	);
}
