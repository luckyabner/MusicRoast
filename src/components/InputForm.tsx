'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { PROMPTS } from '@/lib/prompts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface InputFormProps {
	onSubmit: (formData: FormData) => void;
	isLoading?: boolean;
}
export default function InputForm({ onSubmit, isLoading = false }: InputFormProps) {
	const [inputMethod, setInputMethod] = useState<'id' | 'link'>('link');
	const [linkInput, setLinkInput] = useState('');
	const [idInput, setIdInput] = useState('');
	const [platformInput, setPlatformInput] = useState('');

	const extractInfoFromLink = (link: string): { platform: string; id: string } => {
		try {
			// 默认值
			let platform = '';
			let id = '';

			// 网易云音乐
			if (link.includes('music.163.com')) {
				platform = 'wyy';
			}
			// QQ音乐
			else if (link.includes('y.qq.com')) {
				platform = 'qqmusic';
			}
			// 酷狗音乐
			else if (link.includes('kugou.com')) {
				platform = 'kugou';
			}
			// 酷我音乐
			else if (link.includes('kuwo.cn')) {
				platform = 'kuwo';
			}
			const idMatch = link.match(/[?&]id=([^&]+)/);
			if (idMatch && idMatch[1]) {
				id = idMatch[1];
			}
			return { platform, id };
		} catch (error) {
			console.error('解析链接失败:', error);
			return { platform: '', id: '' };
		}
	};

	const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const link = e.target.value;
		setLinkInput(link);

		const { platform, id } = extractInfoFromLink(link);
		setIdInput(id);
		setPlatformInput(platform);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		// 如果是通过链接输入
		if (inputMethod === 'link') {
			if (idInput) formData.set('id', idInput);
			if (platformInput) formData.set('platform', platformInput);
		}

		onSubmit(formData);
	};

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>导入歌单</CardTitle>
				<CardDescription>
					<p className="text-red-400 inline">目前仅支持QQ音乐、网易云</p>
				</CardDescription>
			</CardHeader>
			<form
				onSubmit={handleSubmit}
				className="grid w-full items-center gap-4"
			>
				<CardContent className="space-y-4">
					<div className="flex flex-col space-y-1.5">
						<Tabs
							defaultValue="link"
							onValueChange={(v) => setInputMethod(v as 'id' | 'link')}
						>
							<TabsList className="grid grid-cols-2">
								<TabsTrigger value="link">链接输入</TabsTrigger>
								<TabsTrigger value="id">手动输入</TabsTrigger>
							</TabsList>
							<TabsContent value="link">
								<div className="flex flex-col space-y-1.5 mt-2">
									<Label htmlFor="link">歌单链接</Label>
									<Input
										id="link"
										name="link"
										value={linkInput}
										onChange={handleLinkChange}
										placeholder="请粘贴歌单分享链接"
									/>
									{idInput && platformInput && (
										<p className="text-xs text-green-600">
											已成功解析:{' '}
											{platformInput === 'wyy'
												? '网易云'
												: platformInput === 'qqmusic'
												? 'QQ音乐'
												: // : platformInput === 'kugou'
												  // ? '酷狗'
												  // : platformInput === 'kuwo'
												  // ? '酷我'
												  ''}{' '}
											歌单ID: {idInput}
										</p>
									)}
									{idInput && !platformInput && (
										<p className="text-xs text-amber-600">
											已解析ID: {idInput}，但未识别平台，请手动选择平台
										</p>
									)}
									<p className="text-xs text-muted-foreground">
										直接粘贴歌单链接，系统会自动识别平台并提取ID
									</p>
								</div>

								{/* 当链接解析无法识别平台时显示平台选择 */}
								{!platformInput && inputMethod === 'link' && (
									<div className="flex flex-col space-y-1.5 mt-4">
										<Label htmlFor="platform-link">平台</Label>
										<Select
											name="platform"
											required
											value={platformInput}
											onValueChange={setPlatformInput}
										>
											<SelectTrigger id="platform-link">
												<SelectValue placeholder="选择平台" />
											</SelectTrigger>
											<SelectContent position="popper">
												<SelectItem value="wyy">网易云</SelectItem>
												<SelectItem value="qqmusic">QQ音乐</SelectItem>
												{/* <SelectItem value="kugou">酷狗</SelectItem>
												<SelectItem value="kuwo">酷我</SelectItem> */}
											</SelectContent>
										</Select>
										<p className="text-xs text-muted-foreground">选择您要获取歌单的音乐平台</p>
									</div>
								)}
							</TabsContent>
							<TabsContent value="id">
								<div className="flex flex-col space-y-1.5 mt-2">
									<Label htmlFor="platform-id">平台</Label>
									<Select
										name="platform"
										required
									>
										<SelectTrigger id="platform-id">
											<SelectValue placeholder="选择平台" />
										</SelectTrigger>
										<SelectContent position="popper">
											<SelectItem value="wyy">网易云</SelectItem>
											<SelectItem value="qqmusic">QQ音乐</SelectItem>
											{/* <SelectItem value="kugou">酷狗</SelectItem>
											<SelectItem value="kuwo">酷我</SelectItem> */}
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">选择您要获取歌单的音乐平台</p>
								</div>

								<div className="flex flex-col space-y-1.5 mt-4">
									<Label htmlFor="id">歌单ID</Label>
									<Input
										id="id"
										name="id"
										required={inputMethod === 'id'}
										placeholder="请输入歌单ID"
										onChange={(e) => inputMethod === 'id' && setIdInput(e.target.value)}
									/>
									<p className="text-xs text-muted-foreground">
										在歌单分享链接或网址中可以找到歌单ID
									</p>
								</div>
							</TabsContent>
						</Tabs>
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
