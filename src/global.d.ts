/**
 * Ammo.js 全局类型声明
 * Ammo.js 通过 script 标签全局引入，返回一个 Promise
 */
declare function Ammo(): Promise<AmmoType>;

/**
 * Ammo.js 类型定义
 * 由于 Ammo.js 是全局引入的 UMD 模块，使用 any 类型
 */
type AmmoType = any;

/**
 * 广告牌返回类型
 * 用于 createBillboard 和 createBillboardRotated 函数的返回值
 */
interface BillboardResult {
	pole: THREE.Mesh;
	sign: THREE.Mesh;
}

