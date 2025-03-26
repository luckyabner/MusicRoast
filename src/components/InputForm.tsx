'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { PROMPTS } from '@/lib/prompts';

interface InputFormProps {
	onSubmit: (formData: FormData) => void;
	isLoading?: boolean;
}
export default function InputForm({ onSubmit, isLoading = false }: InputFormProps) {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		onSubmit(formData);
	};

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>导入歌单</CardTitle>
				<CardDescription>选择音乐平台并输入歌单ID获取歌单内容</CardDescription>
			</CardHeader>
			<form
				onSubmit={handleSubmit}
				className="grid w-full items-center gap-4"
			>
				<CardContent className="space-y-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="platform">平台</Label>
						<Select
							name="platform"
							required
						>
							<SelectTrigger id="platform">
								<SelectValue placeholder="选择平台" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectItem value="wyy">网易云</SelectItem>
								<SelectItem value="qqmusic">QQ音乐</SelectItem>
								<SelectItem value="kugou">酷狗</SelectItem>
								<SelectItem value="kuwo">酷我</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-xs text-muted-foreground">选择您要获取歌单的音乐平台</p>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="id">歌单ID</Label>
						<Input
							id="id"
							name="id"
							required
							placeholder="请输入歌单ID"
						/>
						<p className="text-xs text-muted-foreground">在歌单分享链接或网址中可以找到歌单ID</p>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="aiStyle">回复风格</Label>
						<Select
							name="aiStyle"
							required
						>
							<SelectTrigger id="aiStyle">
								<SelectValue placeholder="回复风格" />
							</SelectTrigger>
							<SelectContent position="popper">
								{Object.keys(PROMPTS).map((key) => (
									<SelectItem
										key={key}
										value={key}
										title={PROMPTS[key].description}
									>
										{PROMPTS[key].name}
									</SelectItem>
								))}
								{/* <SelectItem value="sharp">锐评</SelectItem>
								<SelectItem value="praise">舔狗</SelectItem> */}
								<SelectItem
									value="null"
									className="text-muted-foreground"
									disabled
								>
									敬请期待...
								</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-xs text-muted-foreground">选择AI的评价态度</p>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						type="submit"
						disabled={isLoading}
						className="w-32 transition-all"
					>
						{isLoading ? (
							<span className="flex items-center">
								<span className="animate-spin mr-2">🌀</span>
								分析中...
							</span>
						) : (
							'开始解析'
						)}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
