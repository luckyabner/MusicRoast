import Script from 'next/script';

export default function GoogleAnalytics() {
	const gaId = process.env.GOOGLE_ANALYTICS_ID || '';

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
				strategy="afterInteractive"
			/>
			<Script
				id="google-analytics"
				strategy="afterInteractive"
			>
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
			</Script>
		</>
	);
}
