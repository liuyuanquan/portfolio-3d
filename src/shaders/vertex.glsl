/**
 * 星系粒子顶点着色器
 * 用于计算星系粒子的位置、大小和颜色，实现旋转动画效果
 */

uniform float uSize;
attribute float aScale;

varying vec3 vColor;
uniform float uTime;

attribute vec3 aRandomness;

void main() {
	/**
	 * 位置计算
	 */
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);

	/**
	 * 旋转动画
	 * 根据粒子到中心的距离和时间，计算旋转角度
	 * 距离中心越近的粒子旋转越快
	 */
	float angle = atan(modelPosition.x, modelPosition.z);
	float distanceToCenter = length(modelPosition.xz);
	float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
	angle += angleOffset;
	modelPosition.x = cos(angle) * distanceToCenter;
	modelPosition.z = sin(angle) * distanceToCenter;

	/**
	 * 随机偏移
	 * 添加随机性，使粒子分布更自然
	 */
	modelPosition.xyz += aRandomness;

	/**
	 * 坐标变换
	 * 从模型空间转换到裁剪空间
	 */
	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;
	gl_Position = projectedPosition;

	/**
	 * 粒子大小
	 * 根据距离相机的远近动态调整大小，实现透视效果
	 */
	gl_PointSize = uSize * aScale;
	gl_PointSize *= (50.0 / -viewPosition.z);

	/**
	 * 颜色传递
	 * 将顶点颜色传递给片段着色器
	 */
	vColor = color;
}
