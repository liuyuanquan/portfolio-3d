/**
 * 资源路径配置模块
 * 统一管理项目中所有图片纹理和外部链接的路径
 *
 * 功能：
 * - 管理广告牌纹理路径
 * - 管理盒子纹理路径
 * - 管理文本图片路径
 * - 管理材质纹理路径
 * - 管理外部链接 URL
 */

// 获取 base URL（开发环境为 /，生产环境为 /portfolio-3d/）
const BASE_URL: string = (import.meta.env as any).BASE_URL;

/**
 * 广告牌纹理路径配置
 * 用于创建项目展示广告牌
 */
export const billboardTextures = {
	terpSolutionsTexture: `${BASE_URL}img/terpSolutions.png`,
	bagHolderBetsTexture: `${BASE_URL}img/Bagholdersbetsbillboard.png`,
	homeSweetHomeTexture: `${BASE_URL}img/home-sweet-home-portrait.png`,
} as const;

/**
 * 盒子纹理路径配置
 * 用于创建社交链接盒子和其他交互盒子
 */
export const boxTexture = {
	Github: `${BASE_URL}img/githubLogo.png`,
	twitter: `${BASE_URL}img/twitter.png`,
	LinkedIn: `${BASE_URL}img/linkedInLogo.png`,
	mail: `${BASE_URL}img/envelope.png`,
	globe: `${BASE_URL}img/thunder.png`,
	reactIcon: `${BASE_URL}img/react.png`,
	allSkills: `${BASE_URL}img/allSkills.png`,
	lensFlareMain: `${BASE_URL}img/lensflare0.png`,
	skrillex: `${BASE_URL}img/skrillex.png`,
	edmText: `${BASE_URL}img/EDM.png`,
	writing: `${BASE_URL}img/writing.png`,
} as const;

/**
 * 材质纹理路径配置
 * 用于创建墙壁、广告牌等物体的材质
 */
export const stoneTexture: string = `${BASE_URL}img/stone.png`;
export const woodTexture: string = `${BASE_URL}img/woodTexture.jpg`;

/**
 * 文本图片路径配置
 * 用于在 3D 场景中显示文本内容（以图片形式）
 */
export const inputText = {
	terpSolutionsText: `${BASE_URL}img/terp-solutions-text.png`,
	activities: `${BASE_URL}img/activities_text.png`,
	bagholderBetsText: `${BASE_URL}img/bagholderbets-text.png`,
	homeSweetHomeText: `${BASE_URL}img/home-sweet-home-text.png`,
	staticPortfolio: `${BASE_URL}img/static-portfolio.png`,
} as const;

/**
 * 外部链接 URL 配置
 * 点击盒子或广告牌时跳转的链接
 */
export const URL = {
	terpsolutions:
		"https://web.archive.org/web/20200302001846/https://terpsolutions.com/",
	bagholderBets: "https://bagholder-bets.herokuapp.com",
	homeSweetHomeURL: "https://github.com/0xFloyd/home-sweet-127.0.0.1",
	gitHub: "https://github.com/liuyuanquan/portfolio-3d",
	twitter: "https://twitter.com/0xFloyd",
	email: "mailto:xfloyd.eth@gmail.com",
	githubBagholder: "https://github.com/0xFloyd/bagholder-bets",
	githubHomeSweetHome: "https://github.com/0xFloyd/home-sweet-127.0.0.1",
	devTo:
		"https://dev.to/0xfloyd/create-an-interactive-3d-portfolio-website-that-stands-out-to-employers-47gc",
} as const;
