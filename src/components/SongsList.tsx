import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type Song = {
	title: string;
	author: string;
	url: string;
	pic: string;
	lrc?: string;
	music_id: string;
};

type SongsListProps = {
	//数组类型
	songsList: Song[];
	isLoading?: boolean;
	error?: string;
};

export default function SongsList({ songsList, isLoading = false, error = '' }: SongsListProps) {
	if (error) {
		return <div>出错了</div>;
	}

	if (songsList.length === 0) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>歌单列表</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center text-muted-foreground py-8">提交表单获取歌单内容</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>歌单列表 ({songsList.length}首)</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
					</div>
				) : (
					<div className="h-[300px] overflow-y-auto pr-2">
						{songsList.map((song, index) => (
							<p key={index}>
								{song.title} - {song.author}
							</p>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
