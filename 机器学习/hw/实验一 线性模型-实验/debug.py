import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# 使用极大似然法实现线性回归
class LogisticRegression:
    def __init__(self) -> None:
        self.w = None
        self.b = None

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))
    
    def fit(self, X, y, lr=0.01, max_iter=1000):
        X = np.hstack([X, np.ones((X.shape[0], 1))])
        self.w = np.random.randn(X.shape[1])
        for i in range(max_iter):
            y_pred = self.sigmoid(X.dot(self.w))
            grad = X.T.dot(y_pred - y)
            self.w -= lr * grad
    
    def predict(self, X):
        X = np.hstack([X, np.ones((X.shape[0], 1))])
        return self.sigmoid(X.dot(self.w))
    
    def load(self, path):
        data = np.load(path)
        self.w = data['w']
        self.b = data['b']

    def save(self, path):
        np.savez(path, w=self.w, b=self.b)
    
    def accuracy(self, y_true, y_pred):
        y_pred = np.where(y_pred > 0.5, 1, 0)
        return np.mean(y_true == y_pred)
    def recall(self, y_true, y_pred):
        y_pred = np.where(y_pred > 0.5, 1, 0)
        return np.sum(y_true * y_pred) / np.sum(y_true)

# 数据处理
path = 'dataset/breast-cancer-wisconsin.data'
def data_process():
    # 将data加入第一行列表头'Sample code number', 'Clump Thickness', 'Uniformity of Cell Size', 'Uniformity of Cell Shape', 'Marginal Adhesion', 'Single Epithelial Cell Size', 'Bare Nuclei', 'Bland Chromatin', 'Normal Nucleoli', 'Mitoses', 'Class'
    data = pd.read_csv(path, header=None, names= ['Sample code number', 'Clump Thickness', 'Uniformity of Cell Size', 'Uniformity of Cell Shape', 'Marginal Adhesion', 'Single Epithelial Cell Size', 'Bare Nuclei', 'Bland Chromatin', 'Normal Nucleoli', 'Mitoses', 'Class'])
    # 去掉'Sample code number'列
    data = data.drop('Sample code number', axis=1)
    # 0填充'?'
    data = data.replace('?', 0)
    # 将所有数据转换为int类型
    data = data.astype(int)
    # Z-Score标准化
    for col in data.columns:
        data[col] = (data[col] - data[col].mean()) / data[col].std()
    # 分割数据集
    data = np.array(data)
    np.random.shuffle(data)
    X = data[:, 1:-1]
    y = data[:, -1]
    X_train = X[:int(0.8 * len(X))]
    y_train = y[:int(0.8 * len(y))]
    X_test = X[int(0.8 * len(X)):]
    y_test = y[int(0.8 * len(y)):]
    return X_train, y_train, X_test, y_test

# 主函数
X_train, y_train, X_test, y_test = data_process()
# y=2 为benign, y=4 为malignant
# 实例化模型
model = LogisticRegression()
# 训练模型
model.fit(X_train, y_train, lr=0.01, max_iter=1000)
# 保存模型
model.save('model/logistic_model_implement.npz')
# 评估模型
y_pred = model.predict(X_test)
print('accuracy:', model.accuracy(y_test, y_pred))
print('recall:', model.recall(y_test, y_pred))

# 混淆矩阵
y_pred = np.where(y_pred > 0.5, 1, 0)
confusion_matrix = np.zeros((2, 2))
for i in range(len(y_pred)):
    confusion_matrix[int(y_test[i]) - 2, int(y_pred[i]) - 2] += 1
print('confusion_matrix: ', confusion_matrix)