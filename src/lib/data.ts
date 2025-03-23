import axios from 'axios';

/**
 * 获取歌单
 * @param platform wyy, qqmusic, kugou, kuwo
 * @param id 歌单id
 * @returns
 */
export async function fetchSongsList(platform: string, id: string) {
	try {
		const res = await axios.get(`/api/music/songlist?server=${platform}&id=${id}`);
		return res.data;
	} catch (e) {
		console.log(e);
	}
}
