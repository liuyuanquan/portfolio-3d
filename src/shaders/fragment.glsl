/**
 * 星系粒子片段着色器
 * 用于渲染背景星系中的粒子点，创建光晕效果
 */

varying vec3 vColor;

void main() {
	/**
	 * 粒子形状效果选项（已注释，当前使用 Light point 效果）
	 */
	
	// Disc - 圆形粒子
	// float strength = distance(gl_PointCoord, vec2(0.5));
	// strength = step(0.5, strength);
	// strength = 1.0 - strength;

	// Diffuse point - 扩散点效果
	// float strength = distance(gl_PointCoord, vec2(0.5));
	// strength *= 2.0;
	// strength = 1.0 - strength;
	

	/**
	 * Light point - 光点效果（当前使用）
	 * 创建从中心向外衰减的光晕效果
	 */
	float strength = distance(gl_PointCoord, vec2(0.5));
	strength = 1.0 - strength;
	strength = pow(strength, 10.0);

	/**
	 * 最终颜色
	 * 根据强度混合黑色和粒子颜色，创建光晕渐变效果
	 */
	vec3 color = mix(vec3(0.0), vColor, strength);
	gl_FragColor = vec4(color, 1.0);

	// 调试用：显示点坐标（已注释）
	// gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);
}
