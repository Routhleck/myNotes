import matplotlib.pyplot as plt
import numpy as np

# 对于给定的控制点和参数t, 计算贝塞尔曲线上的位置
def bezier_curve(points, t):
    n = len(points) - 1
    return sum(binomial_coeff(n, i) * ((1 - t) ** (n - i)) * (t ** i) * points[i] for i in range(n + 1))

# 计算二项式系数 "n choose k"
def binomial_coeff(n, k):
    return np.math.factorial(n) // (np.math.factorial(k) * np.math.factorial(n - k))

# 计算 de Casteljau 三角形
def de_casteljau(points, t):
    n = len(points)
    triangle = [points]
    for i in range(1, n):
        temp = []
        for j in range(n - i):
            temp.append((1 - t) * triangle[i - 1][j] + t * triangle[i - 1][j + 1])
        triangle.append(temp)
    return triangle

# 定义控制点
points = np.array([[30, 0], [60, 10], [80, 30], [90, 60], [90, 90]])

# 计算贝塞尔曲线上的点
t = 1/4
point_on_curve = bezier_curve(points, t)

# 计算 de Casteljau 三角形
triangle = de_casteljau(points, t)

# 画出控制点
plt.scatter(points[:,0], points[:,1], color='blue')

# 画出贝塞尔曲线
t_values = np.linspace(0, 1, 100)
bezier_points = np.array([bezier_curve(points, t) for t in t_values])
plt.plot(bezier_points[:,0], bezier_points[:,1], color='black')

# 画出 de Casteljau 三角形
colors = ['red', 'green', 'purple', 'orange']
for i, level in enumerate(triangle):
    if i == len(triangle) - 1:
        break
    level = np.array(level)
    plt.plot(level[:,0], level[:,1], color=colors[i % len(colors)])

    # 对每个点添加标签
    for j, point in enumerate(level):
        plt.annotate(f"{i}-{j}: {point}", (point[0], point[1]), textcoords="offset points", xytext=(-10,-10), ha='center')

# 画出曲线上的点
plt.scatter(point_on_curve[0], point_on_curve[1], color='green')
plt.annotate(f"Curve point: {point_on_curve}", (point_on_curve[0], point_on_curve[1]), textcoords="offset points", xytext=(-10,-10), ha='center')

plt.show()
