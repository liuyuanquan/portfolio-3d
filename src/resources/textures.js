// 获取 base URL（开发环境为 /，生产环境为 /portfolio-3d/）
const BASE_URL = import.meta.env.BASE_URL;

//billboardTextures
let billboardTextures = {};
billboardTextures.terpSolutionsTexture = `${BASE_URL}img/terpSolutions.png`;
billboardTextures.bagHolderBetsTexture = `${BASE_URL}img/Bagholdersbetsbillboard.png`;
billboardTextures.homeSweetHomeTexture = `${BASE_URL}img/home-sweet-home-portrait.png`;

//box textures
let boxTexture = {};
boxTexture.Github = `${BASE_URL}img/githubLogo.png`;
boxTexture.twitter = `${BASE_URL}img/twitter.png`;
boxTexture.LinkedIn = `${BASE_URL}img/linkedInLogo.png`;
boxTexture.mail = `${BASE_URL}img/envelope.png`;
boxTexture.globe = `${BASE_URL}img/thunder.png`;
boxTexture.reactIcon = `${BASE_URL}img/react.png`;
boxTexture.allSkills = `${BASE_URL}img/allSkills.png`;
boxTexture.lensFlareMain = `${BASE_URL}img/lensflare0.png`;
boxTexture.skrillex = `${BASE_URL}img/skrillex.png`;
boxTexture.edmText = `${BASE_URL}img/EDM.png`;
boxTexture.writing = `${BASE_URL}img/writing.png`;

//material textures
let stoneTexture = `${BASE_URL}img/stone.png`;
let woodTexture = `${BASE_URL}img/woodTexture.jpg`;

//text
let inputText = {};
inputText.terpSolutionsText = `${BASE_URL}img/terp-solutions-text.png`;
inputText.activities = `${BASE_URL}img/activities_text.png`;
inputText.bagholderBetsText = `${BASE_URL}img/bagholderbets-text.png`;
inputText.homeSweetHomeText = `${BASE_URL}img/home-sweet-home-text.png`;
inputText.staticPortfolio = `${BASE_URL}img/static-portfolio.png`;

//URLs
let URL = {};
URL.terpsolutions =
	"https://web.archive.org/web/20200302001846/https://terpsolutions.com/";
URL.bagholderBets = "https://bagholder-bets.herokuapp.com";
URL.homeSweetHomeURL = "https://github.com/0xFloyd/home-sweet-127.0.0.1";
URL.gitHub = "https://github.com/0xFloyd/Portfolio_2020";
URL.twitter = "https://twitter.com/0xFloyd";
URL.email = "https://mailto:xfloyd.eth@gmail.com";
URL.githubBagholder = "https://github.com/0xFloyd/bagholder-bets";
URL.githubHomeSweetHome = "https://github.com/0xFloyd/home-sweet-127.0.0.1";
URL.devTo =
	"https://dev.to/0xfloyd/create-an-interactive-3d-portfolio-website-that-stands-out-to-employers-47gc";

export {
	billboardTextures,
	boxTexture,
	inputText,
	URL,
	stoneTexture,
	woodTexture,
};
