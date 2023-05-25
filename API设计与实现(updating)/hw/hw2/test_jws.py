import hashlib
import json
import base64
import hmac

def calculate_jws_token(sub, name, school, course, iat, key):
    header = {
        "alg": "HS256",
        "typ": "JWT"
    }

    payload = {
        "sub": sub,
        "name": name,
        "school": school,
        "course": course,
        "iat": iat
    }

    # 序列化 Header 和 Payload
    encoded_header = base64.urlsafe_b64encode(json.dumps(header).encode('utf-8')).decode('utf-8')
    encoded_payload = base64.urlsafe_b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8')

    # 构建待签名的数据
    data_to_sign = f"{encoded_header}.{encoded_payload}"

    # 使用密钥进行签名
    signature = hmac.new(key.encode('utf-8'), data_to_sign.encode('utf-8'), hashlib.sha256).digest()
    encoded_signature = base64.urlsafe_b64encode(signature).decode('utf-8')

    # 构建完整的 JWS Token
    jws_token = f"{data_to_sign}.{encoded_signature}"

    return jws_token

# 示例数据
sub = "20301037"
name = "贺思超"
school = "软件学院"
course = "API设计与实现"
iat = 1516239022
key = hashlib.md5(sub.encode('utf-8')).hexdigest()

# 计算 JWS Token
jws_token = calculate_jws_token(sub, name, school, course, iat, key)

# 打印结果
print("JWS Token:", jws_token)