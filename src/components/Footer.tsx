import { Github } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
	return (
		<footer className="mt-auto py-6 mx-8 flex items-center justify-between text-sm text-muted-foreground">
			<p>Music Roast © {new Date().getFullYear()}</p>
			<div className="flex items-center gap-2">
				<Link
					target={'_blank'}
					href={'https://github.com/luckyabner/MusicRoast'}
				>
					<Github />
				</Link>
			</div>
		</footer>
	);
}
