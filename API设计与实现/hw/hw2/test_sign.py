import hashlib
import uuid

def calculate_sign1(app_id, req_id, req_time, app_secret):
    sign_str = f"appId={app_id}&reqId={req_id}&reqTime={req_time}&appSecret={app_secret}"
    return hashlib.md5(sign_str.encode('utf-8')).hexdigest()

def calculate_sign2(app_id, req_id, req_time, app_secret, data):
    hash1 = hashlib.md5(data.encode('utf-8')).hexdigest()
    sign_str = f"appId={app_id}&data={hash1}&reqId={req_id}&reqTime={req_time}&appSecret={app_secret}"
    return hashlib.md5(sign_str.encode('utf-8')).hexdigest()

# data
app_id = "20301037"
req_id = f"API02_{str(uuid.uuid4())[:8]}"  # 使用UUID4生成req_id
req_time = "1682915696123"
app_secret = hashlib.md5(app_id.encode('utf-8')).hexdigest()
data = '{"name": "贺思超", "school": "软件学院", "course": "API设计与实现"}'


# 计算签名值
sign1 = calculate_sign1(app_id, req_id, req_time, app_secret)
sign2 = calculate_sign2(app_id, req_id, req_time, app_secret, data)

# 打印结果
print(f"appId: {app_id}, \nreqId: {req_id}, \nreqTime: {req_time}, \nappSecret: {app_secret}, \ndata: {data}")
print("1) 签名逻辑 1:", sign1)
print("2) 签名逻辑 2:", sign2)
