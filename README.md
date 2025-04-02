# AI 歌单锐评

## 体验地址

[MusicRoast](https://music.luckyabner.top)

## 简介

输入歌单 id，AI 自动对歌单进行评价，给出评价结果。
![alt text](image.png)

## 模型使用

DeepSeek V3

## 支持平台

- [x] QQ 音乐
- [x] 网易云

## 部署

1. 安装依赖
2. 按照 .env.example 中的配置进行配置
3. `pnpm dev` 启动测试服务
4. `pnpm build` 打包
5. `pnpm start` 启动服务

## 贡献

欢迎任何人对本项目进行贡献：

- 若你想添加更多有趣的 Prompt, 请在[prompts.ts](/src/lib/prompts.ts) 中添加。
- 若有其它建议，欢迎提交 issue 或 pr。

## 相关链接

- 歌单获取 - [musicapi](https://github.com/Superheroff/musicapi.git)
- 网站图标 - [logocook](https://www.logocook.shop/)

## LICENSE

This project is licensed under the [MIT License](LICENSE).
