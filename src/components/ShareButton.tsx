'use client';
import React from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export default function ShareButton() {
	return (
		<Button
			onClick={() =>
				toast('功能未完成', {
					description: '敬请期待',
					action: {
						label: 'Undo',
						onClick: () => console.log('Undo'),
					},
				})
			}
		>
			生成分享卡片
		</Button>
	);
}
