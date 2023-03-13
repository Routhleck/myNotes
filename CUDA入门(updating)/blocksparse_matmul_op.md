# Function

## Status XpropShape

用于在推断阶段计算输出Tensor的形状

### Parameter

#### input

| 参数名 | 参数类型          | 参数说明   |
| ------ | ----------------- | ---------- |
| ctx    | InferenceContext* | 推断上下文 |

但还包含了两个输入参数

```c++
int    K; TF_RETURN_IF_ERROR(ctx->GetAttr(   "K",    &K));
int axis; TF_RETURN_IF_ERROR(ctx->GetAttr("axis", &axis));
```

| 参数名 | 参数类型 | 参数说明   |
| ------ | -------- | ---------- |
| K      | int      | 推断上下文 |

#### output



### procedure



## Status UpdatShape

### Parameter

#### input



#### output



### procedure



## bool BlocksparseGateGrad

### Parameter

#### input



#### output



### procedure



## bool IdentityInitCK

### Parameter

#### input



#### output



### procedure

## Status ReducedDWShape

### Parameter

#### input



#### output



### procedure



# Class-BlocksparseMatmulOp

## Data Members



## Function

### 

# Class-BlocksparseMatmulDGOp

## Data Members



## Function

### 

# Class-BlocksparseMatmulIdentityInitOp

## Data Members



## Function

### 

# Class-BlocksparseReducedDWOp

## Data Members



## Function

### 