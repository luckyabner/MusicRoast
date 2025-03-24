/**
 * 获取歌单
 * @param platform wyy, qqmusic, kugou, kuwo
 * @param id 歌单id
 * @returns
 */
export async function fetchSongsList(platform: string, id: string) {
	try {
		const res = await fetch(`/api/songslist/${platform}/${id}`);

		if (!res.ok) {
			const errorData = await res.json().catch(() => null);
			throw new Error(errorData?.error || `获取歌单失败 (${res.status})`);
		}
		return res.json();
	} catch (error) {
		console.error('获取歌单失败:', error);
		throw error;
	}
}
