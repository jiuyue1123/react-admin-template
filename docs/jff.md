---
title: jff
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# jff

Base URLs:

# Authentication

# 管理端 - 认证

<a id="opIdrefreshToken_1"></a>

## POST 刷新 Token

POST /admin/auth/refresh

> Body 请求参数

```json
{
  "refreshToken": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TokenRequest](#schematokenrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"accessToken":"string","refreshToken":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultLoginVO](#schemaresultloginvo)|

<a id="opIdlogout_1"></a>

## POST 管理员登出

POST /admin/auth/logout

> Body 请求参数

```json
{
  "refreshToken": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TokenRequest](#schematokenrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdlogin"></a>

## POST 管理员登录

POST /admin/auth/login

> Body 请求参数

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[LoginRequest](#schemaloginrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"accessToken":"string","refreshToken":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultLoginVO](#schemaresultloginvo)|

<a id="opIdgetUserInfo"></a>

## GET 获取当前管理员信息

GET /admin/auth/userinfo

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"username":"string","roles":["string"],"buttons":["string"]},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultUserInfoVO](#schemaresultuserinfovo)|

# 租户端 - 认证

<a id="opIdsendCode"></a>

## POST 发送验证码

POST /tenant/auth/send-code

> Body 请求参数

```json
{
  "phone": "13800138000",
  "scene": "LOGIN"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[SmsCodeRequest](#schemasmscoderequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdregister"></a>

## POST 租户注册

POST /tenant/auth/register

> Body 请求参数

```json
{
  "tenantName": "杭州某某科技有限公司",
  "phone": "13800138000",
  "password": "abc123456",
  "code": "123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TenantRegisterRequest](#schematenantregisterrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"accessToken":"string","refreshToken":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultTenantLoginVO](#schemaresulttenantloginvo)|

<a id="opIdrefreshToken"></a>

## POST 刷新 Token

POST /tenant/auth/refresh

> Body 请求参数

```json
{
  "refreshToken": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TenantTokenRequest](#schematenanttokenrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"accessToken":"string","refreshToken":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultTenantLoginVO](#schemaresulttenantloginvo)|

<a id="opIdchangePhone"></a>

## POST 换绑手机号

POST /tenant/auth/phone/change

> Body 请求参数

```json
{
  "newPhone": "13900139000",
  "oldPhoneCode": "123456",
  "newPhoneCode": "654321"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TenantPhoneChangeRequest](#schematenantphonechangerequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdresetPassword"></a>

## POST 手机号+验证码重置密码

POST /tenant/auth/password/reset

> Body 请求参数

```json
{
  "phone": "13800138000",
  "code": "123456",
  "newPassword": "abc123456",
  "refreshToken": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TenantResetPasswordRequest](#schematenantresetpasswordrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdlogout"></a>

## POST 租户登出

POST /tenant/auth/logout

> Body 请求参数

```json
{
  "refreshToken": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TenantTokenRequest](#schematenanttokenrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdloginByPassword"></a>

## POST 手机号+密码登录

POST /tenant/auth/login/password

> Body 请求参数

```json
{
  "phone": "13800138000",
  "password": "abc123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TenantPasswordLoginRequest](#schematenantpasswordloginrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"accessToken":"string","refreshToken":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultTenantLoginVO](#schemaresulttenantloginvo)|

<a id="opIdloginByCode"></a>

## POST 手机号+验证码登录

POST /tenant/auth/login/code

> Body 请求参数

```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TenantCodeLoginRequest](#schematenantcodeloginrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"accessToken":"string","refreshToken":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultTenantLoginVO](#schemaresulttenantloginvo)|

# 租户端 - Profile

<a id="opIdgetProfile"></a>

## GET 获取当前租户 Profile

GET /tenant/profile

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"tenantId":0,"tenantName":"string","tenantCode":"string","contactName":"string","contactPhone":"string","contactEmail":"string","remark":"string","userId":0,"username":"string","nickname":"string","phone":"string","email":"string","avatar":"string","gender":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultTenantProfileVO](#schemaresulttenantprofilevo)|

<a id="opIdupdateProfile"></a>

## PUT 更新租户 Profile

PUT /tenant/profile

> Body 请求参数

```json
{
  "tenantName": "杭州某某科技有限公司",
  "contactName": "张三",
  "contactEmail": "contact@example.com",
  "remark": "string",
  "nickname": "张三",
  "email": "zhangsan@example.com",
  "avatar": "https://example.com/avatar.png",
  "gender": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[TenantProfileUpdateRequest](#schematenantprofileupdaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"tenantId":0,"tenantName":"string","tenantCode":"string","contactName":"string","contactPhone":"string","contactEmail":"string","remark":"string","userId":0,"username":"string","nickname":"string","phone":"string","email":"string","avatar":"string","gender":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultTenantProfileVO](#schemaresulttenantprofilevo)|

# 平台管理端 - 套餐

<a id="opIdgetDetail"></a>

## GET 套餐详情

GET /admin/plans/{planCode}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|planCode|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"planName":"string","planCode":"string","tagText":"string","price":0,"originalPrice":0,"durationDays":0,"description":"string","features":"string","sortOrder":0,"status":0,"remark":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultPricingPlanVO](#schemaresultpricingplanvo)|

<a id="opIdupdate_3"></a>

## PUT 更新套餐

PUT /admin/plans/{planCode}

> Body 请求参数

```json
{
  "planName": "启航版",
  "tagText": "string",
  "price": 499,
  "originalPrice": 0,
  "durationDays": 365,
  "description": "string",
  "features": "string",
  "sortOrder": 0,
  "status": 0,
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|planCode|path|string| 是 |none|
|body|body|[PricingPlanUpdateRequest](#schemapricingplanupdaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"planName":"string","planCode":"string","tagText":"string","price":0,"originalPrice":0,"durationDays":0,"description":"string","features":"string","sortOrder":0,"status":0,"remark":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultPricingPlanVO](#schemaresultpricingplanvo)|

<a id="opIddelete_2"></a>

## DELETE 删除套餐

DELETE /admin/plans/{planCode}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|planCode|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdlist_5"></a>

## GET 套餐列表

GET /admin/plans

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"planName":"string","planCode":"string","tagText":"string","price":0,"originalPrice":0,"durationDays":0,"description":"string","features":"string","sortOrder":0,"status":0,"remark":"string"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListPricingPlanVO](#schemaresultlistpricingplanvo)|

<a id="opIdcreate_2"></a>

## POST 创建套餐

POST /admin/plans

> Body 请求参数

```json
{
  "planName": "启航版",
  "planCode": "basic",
  "tagText": "热销推荐",
  "price": 499,
  "originalPrice": 899,
  "durationDays": 365,
  "description": "string",
  "features": "string",
  "sortOrder": 0,
  "status": 0,
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[PricingPlanCreateRequest](#schemapricingplancreaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"planName":"string","planCode":"string","tagText":"string","price":0,"originalPrice":0,"durationDays":0,"description":"string","features":"string","sortOrder":0,"status":0,"remark":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultPricingPlanVO](#schemaresultpricingplanvo)|

# 平台管理端 - 文档内容

<a id="opIdgetDetail_1"></a>

## GET 文档详情

GET /admin/content/documents/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"docKey":"string","docType":1,"category":"string","title":"string","content":"string","publishedTitle":"string","publishedContent":"string","status":0,"version":0,"sortOrder":0,"isPinned":0,"publishAt":"2019-08-24T14:15:22Z","remark":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultContentDocumentVO](#schemaresultcontentdocumentvo)|

<a id="opIdupdate_4"></a>

## PUT 更新文档

PUT /admin/content/documents/{id}

> Body 请求参数

```json
{
  "title": "string",
  "content": "string",
  "category": "string",
  "sortOrder": 0,
  "isPinned": 0,
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[ContentDocumentUpdateRequest](#schemacontentdocumentupdaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"docKey":"string","docType":1,"category":"string","title":"string","content":"string","publishedTitle":"string","publishedContent":"string","status":0,"version":0,"sortOrder":0,"isPinned":0,"publishAt":"2019-08-24T14:15:22Z","remark":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultContentDocumentVO](#schemaresultcontentdocumentvo)|

<a id="opIddelete_3"></a>

## DELETE 删除文档

DELETE /admin/content/documents/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdpublish_1"></a>

## PUT 发布文档

PUT /admin/content/documents/{id}/publish

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"docKey":"string","docType":1,"category":"string","title":"string","content":"string","publishedTitle":"string","publishedContent":"string","status":0,"version":0,"sortOrder":0,"isPinned":0,"publishAt":"2019-08-24T14:15:22Z","remark":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultContentDocumentVO](#schemaresultcontentdocumentvo)|

<a id="opIdoffline"></a>

## PUT 下架文档

PUT /admin/content/documents/{id}/offline

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"docKey":"string","docType":1,"category":"string","title":"string","content":"string","publishedTitle":"string","publishedContent":"string","status":0,"version":0,"sortOrder":0,"isPinned":0,"publishAt":"2019-08-24T14:15:22Z","remark":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultContentDocumentVO](#schemaresultcontentdocumentvo)|

<a id="opIdlist_7"></a>

## GET 文档列表

GET /admin/content/documents

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|docType|query|string| 否 |none|
|status|query|string| 否 |none|
|keyword|query|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"docKey":"string","docType":1,"category":"string","title":"string","publishedTitle":"string","status":0,"version":0,"sortOrder":0,"isPinned":0,"publishAt":"2019-08-24T14:15:22Z","remark":"string"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListContentDocumentListItemVO](#schemaresultlistcontentdocumentlistitemvo)|

<a id="opIdcreate_3"></a>

## POST 新建文档（草稿）

POST /admin/content/documents

> Body 请求参数

```json
{
  "docKey": "help-get-started",
  "docType": 1,
  "category": "入门指南",
  "title": "如何开始使用？",
  "content": "string",
  "sortOrder": 0,
  "isPinned": 0,
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[ContentDocumentCreateRequest](#schemacontentdocumentcreaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"docKey":"string","docType":1,"category":"string","title":"string","content":"string","publishedTitle":"string","publishedContent":"string","status":0,"version":0,"sortOrder":0,"isPinned":0,"publishAt":"2019-08-24T14:15:22Z","remark":"string"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultContentDocumentVO](#schemaresultcontentdocumentvo)|

# 租户端 - 在线客服

<a id="opIdlist"></a>

## GET 我的会话列表

GET /tenant/support/conversations

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"customerType":1,"customerId":0,"guestId":"string","agentId":0,"topic":"string","source":0,"status":0,"lastMessageAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListConversationVO](#schemaresultlistconversationvo)|

<a id="opIdopen"></a>

## POST 发起/打开会话

POST /tenant/support/conversations

> Body 请求参数

```json
{
  "topic": "套餐咨询"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OpenConversationRequest](#schemaopenconversationrequest)| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"customerType":1,"customerId":0,"guestId":"string","agentId":0,"topic":"string","source":0,"status":0,"lastMessageAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultConversationVO](#schemaresultconversationvo)|

<a id="opIdmessages"></a>

## GET 会话消息列表（afterId 增量拉取）

GET /tenant/support/conversations/{id}/messages

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|afterId|query|integer(int64)| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"conversationId":0,"senderType":1,"senderId":0,"msgType":1,"content":"string","createdAt":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListMessageVO](#schemaresultlistmessagevo)|

<a id="opIdsend"></a>

## POST 发送消息

POST /tenant/support/conversations/{id}/messages

> Body 请求参数

```json
{
  "content": "你好，我想咨询一下套餐",
  "clientMsgId": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[SendMessageRequest](#schemasendmessagerequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"conversationId":0,"senderType":1,"senderId":0,"msgType":1,"content":"string","createdAt":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultMessageVO](#schemaresultmessagevo)|

<a id="opIdclose"></a>

## POST 关闭会话

POST /tenant/support/conversations/{id}/close

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

# 官网 - 在线客服

<a id="opIdlist_4"></a>

## GET 我的会话列表

GET /support/visitor/conversations

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Guest-Id|header|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"customerType":1,"customerId":0,"guestId":"string","agentId":0,"topic":"string","source":0,"status":0,"lastMessageAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListConversationVO](#schemaresultlistconversationvo)|

<a id="opIdopen_1"></a>

## POST 发起/打开会话

POST /support/visitor/conversations

> Body 请求参数

```json
{
  "topic": "套餐咨询"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Guest-Id|header|string| 否 |none|
|body|body|[OpenConversationRequest](#schemaopenconversationrequest)| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"customerType":1,"customerId":0,"guestId":"string","agentId":0,"topic":"string","source":0,"status":0,"lastMessageAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultConversationVO](#schemaresultconversationvo)|

<a id="opIdmessages_1"></a>

## GET 会话消息列表（afterId 增量拉取）

GET /support/visitor/conversations/{id}/messages

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|afterId|query|integer(int64)| 否 |none|
|X-Guest-Id|header|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"conversationId":0,"senderType":1,"senderId":0,"msgType":1,"content":"string","createdAt":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListMessageVO](#schemaresultlistmessagevo)|

<a id="opIdsend_1"></a>

## POST 发送消息

POST /support/visitor/conversations/{id}/messages

> Body 请求参数

```json
{
  "content": "你好，我想咨询一下套餐",
  "clientMsgId": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|X-Guest-Id|header|string| 否 |none|
|body|body|[SendMessageRequest](#schemasendmessagerequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"conversationId":0,"senderType":1,"senderId":0,"msgType":1,"content":"string","createdAt":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultMessageVO](#schemaresultmessagevo)|

<a id="opIdclose_1"></a>

## POST 关闭会话

POST /support/visitor/conversations/{id}/close

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|X-Guest-Id|header|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

# 平台端 - 在线客服

<a id="opIdmessages_2"></a>

## GET 会话消息（afterId 增量拉取）

GET /admin/support/conversations/{id}/messages

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|afterId|query|integer(int64)| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"conversationId":0,"senderType":1,"senderId":0,"msgType":1,"content":"string","createdAt":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListMessageVO](#schemaresultlistmessagevo)|

<a id="opIdreply"></a>

## POST 回复消息

POST /admin/support/conversations/{id}/messages

> Body 请求参数

```json
{
  "content": "你好，我想咨询一下套餐",
  "clientMsgId": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[SendMessageRequest](#schemasendmessagerequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"conversationId":0,"senderType":1,"senderId":0,"msgType":1,"content":"string","createdAt":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultMessageVO](#schemaresultmessagevo)|

<a id="opIdclose_2"></a>

## POST 关闭会话

POST /admin/support/conversations/{id}/close

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdaccept"></a>

## POST 接入会话

POST /admin/support/conversations/{id}/accept

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"customerType":1,"customerId":0,"guestId":"string","agentId":0,"topic":"string","source":0,"status":0,"lastMessageAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultConversationVO](#schemaresultconversationvo)|

<a id="opIdconversations"></a>

## GET 我的进行中会话

GET /admin/support/conversations

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"customerType":1,"customerId":0,"guestId":"string","agentId":0,"topic":"string","source":0,"status":0,"lastMessageAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListConversationVO](#schemaresultlistconversationvo)|

<a id="opIdqueue"></a>

## GET 待接入队列

GET /admin/support/conversations/queue

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"customerType":1,"customerId":0,"guestId":"string","agentId":0,"topic":"string","source":0,"status":0,"lastMessageAt":"2019-08-24T14:15:22Z","createdAt":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListConversationVO](#schemaresultlistconversationvo)|

# 公开端 - 套餐目录

<a id="opIdlist_9"></a>

## GET 套餐目录（启用中）

GET /public/plans

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"planCode":"string","planName":"string","tagText":"string","price":0,"originalPrice":0,"durationDays":0,"description":"string","features":"string","sortOrder":0}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListPublicPricingPlanVO](#schemaresultlistpublicpricingplanvo)|

# 公开端 - 文档内容

<a id="opIdlistPublished"></a>

## GET 按类型列出已发布文档

GET /content/documents

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|docType|query|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"docKey":"string","docType":1,"category":"string","title":"string","isPinned":0,"publishAt":"2019-08-24T14:15:22Z","version":0}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListContentDocumentPublishedListItemVO](#schemaresultlistcontentdocumentpublishedlistitemvo)|

<a id="opIdgetPublished"></a>

## GET 按编码获取已发布文档详情

GET /content/documents/{docKey}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|docKey|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"docKey":"string","docType":1,"category":"string","title":"string","content":"string","isPinned":0,"publishAt":"2019-08-24T14:15:22Z","version":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultContentDocumentPublishedVO](#schemaresultcontentdocumentpublishedvo)|

# 平台端 - 线索管理

<a id="opIdhandle"></a>

## PUT 跟进线索

PUT /admin/support/leads/{id}/handle

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"name":"string","phone":"string","demand":"string","leadState":0,"handleBy":0,"gmtHandled":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSupportLeadVO](#schemaresultsupportleadvo)|

<a id="opIdlist_11"></a>

## GET 线索列表

GET /admin/support/leads

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|state|query|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"name":"string","phone":"string","demand":"string","leadState":0,"handleBy":0,"gmtHandled":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListSupportLeadVO](#schemaresultlistsupportleadvo)|

# 官网 - 联系我们

<a id="opIdsubmit_1"></a>

## POST 提交联系我们表单

POST /support/visitor/leads

> Body 请求参数

```json
{
  "name": "张三",
  "phone": "13800138000",
  "demand": "想了解套餐价格与交付周期"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[SupportLeadSubmitRequest](#schemasupportleadsubmitrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

# 租户端 - 站点

<a id="opIdget"></a>

## GET 获取当前租户站点

GET /tenant/site

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"tenantId":0,"siteName":"string","siteIntro":"string","logo":"string","favicon":"string","siteState":0,"publishAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSiteVO](#schemaresultsitevo)|

<a id="opIdupdate"></a>

## PUT 更新当前租户站点

PUT /tenant/site

> Body 请求参数

```json
{
  "siteName": "杭州某某科技",
  "siteIntro": "string",
  "logo": "https://example.com/logo.png",
  "favicon": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[SiteUpdateRequest](#schemasiteupdaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"tenantId":0,"siteName":"string","siteIntro":"string","logo":"string","favicon":"string","siteState":0,"publishAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSiteVO](#schemaresultsitevo)|

<a id="opIdstatus"></a>

## GET 站点生命周期状态 + 建站进度

GET /tenant/site/status

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"siteId":0,"siteName":"string","siteState":0,"publishAt":"2019-08-24T14:15:22Z","buildProgress":[{"stage":1,"stageState":0,"remark":"string"}]},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSiteStatusVO](#schemaresultsitestatusvo)|

<a id="opIdpublish"></a>

## PUT 站点上线（需实名认证通过且未过期）

PUT /tenant/site/publish

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"tenantId":0,"siteName":"string","siteIntro":"string","logo":"string","favicon":"string","siteState":0,"publishAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSiteVO](#schemaresultsitevo)|

# 租户端 - 媒体库

<a id="opIdrenameFolder"></a>

## PUT 重命名文件夹

PUT /tenant/media/folders/{id}

> Body 请求参数

```json
{
  "folderName": "产品图-新"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[MediaFolderRenameRequest](#schemamediafolderrenamerequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"parentId":0,"folderName":"string","sortOrder":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultMediaFolderVO](#schemaresultmediafoldervo)|

<a id="opIddeleteFolder"></a>

## DELETE 删除文件夹

DELETE /tenant/media/folders/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdlist_3"></a>

## GET 媒体列表

GET /tenant/media

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|folderId|query|integer(int64)| 否 |none|
|fileType|query|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"folderId":0,"fileName":"string","fileType":1,"contentType":"string","url":"string","fileSize":0,"width":0,"height":0,"gmtCreate":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListMediaAssetVO](#schemaresultlistmediaassetvo)|

<a id="opIdupload"></a>

## POST 上传媒体

POST /tenant/media

> Body 请求参数

```json
{
  "file": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|folderId|query|integer(int64)| 否 |none|
|body|body|object| 否 |none|
|» file|body|string(binary)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"folderId":0,"fileName":"string","fileType":1,"contentType":"string","url":"string","fileSize":0,"width":0,"height":0,"gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultMediaAssetVO](#schemaresultmediaassetvo)|

<a id="opIdlistFolders"></a>

## GET 文件夹列表

GET /tenant/media/folders

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|parentId|query|integer(int64)| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"parentId":0,"folderName":"string","sortOrder":0}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListMediaFolderVO](#schemaresultlistmediafoldervo)|

<a id="opIdcreateFolder"></a>

## POST 创建文件夹

POST /tenant/media/folders

> Body 请求参数

```json
{
  "folderName": "产品图",
  "parentId": 0,
  "sortOrder": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[MediaFolderCreateRequest](#schemamediafoldercreaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"parentId":0,"folderName":"string","sortOrder":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultMediaFolderVO](#schemaresultmediafoldervo)|

<a id="opIddelete_4"></a>

## DELETE 删除媒体

DELETE /tenant/media/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

# 租户端 - 站点页面

<a id="opIddetail"></a>

## GET 页面详情

GET /tenant/site/pages/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"pageTitle":"string","pagePath":"string","content":"string","pageState":0,"sortOrder":0,"version":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSitePageDetailVO](#schemaresultsitepagedetailvo)|

<a id="opIdupdate_1"></a>

## PUT 更新页面基础信息

PUT /tenant/site/pages/{id}

> Body 请求参数

```json
{
  "pageTitle": "首页",
  "pagePath": "home",
  "pageState": 0,
  "sortOrder": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[SitePageUpdateRequest](#schemasitepageupdaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"pageTitle":"string","pagePath":"string","pageState":0,"sortOrder":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSitePageVO](#schemaresultsitepagevo)|

<a id="opIddelete"></a>

## DELETE 删除页面

DELETE /tenant/site/pages/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdrollback"></a>

## PUT 回滚到历史版本

PUT /tenant/site/pages/{id}/versions/{versionId}/rollback

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|versionId|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"pageTitle":"string","pagePath":"string","content":"string","pageState":0,"sortOrder":0,"version":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSitePageDetailVO](#schemaresultsitepagedetailvo)|

<a id="opIdsaveContent"></a>

## PUT 保存页面内容草稿

PUT /tenant/site/pages/{id}/content

> Body 请求参数

```json
{
  "content": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[SitePageContentRequest](#schemasitepagecontentrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"pageTitle":"string","pagePath":"string","content":"string","pageState":0,"sortOrder":0,"version":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSitePageDetailVO](#schemaresultsitepagedetailvo)|

<a id="opIdsort"></a>

## PUT 批量排序

PUT /tenant/site/pages/sort

> Body 请求参数

```json
{
  "items": [
    {
      "id": 0,
      "sortOrder": 0
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[SitePageSortRequest](#schemasitepagesortrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdlist_1"></a>

## GET 页面列表

GET /tenant/site/pages

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageState|query|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"pageTitle":"string","pagePath":"string","pageState":0,"sortOrder":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListSitePageVO](#schemaresultlistsitepagevo)|

<a id="opIdcreate"></a>

## POST 新增页面

POST /tenant/site/pages

> Body 请求参数

```json
{
  "pageTitle": "首页",
  "pagePath": "home",
  "content": "string",
  "sortOrder": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[SitePageCreateRequest](#schemasitepagecreaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"pageTitle":"string","pagePath":"string","pageState":0,"sortOrder":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSitePageVO](#schemaresultsitepagevo)|

<a id="opIdversions"></a>

## GET 页面版本列表

GET /tenant/site/pages/{id}/versions

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"version":0,"pageTitle":"string","gmtCreate":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListSitePageVersionVO](#schemaresultlistsitepageversionvo)|

# 租户端 - 站点导航

<a id="opIdupdate_2"></a>

## PUT 更新导航项

PUT /tenant/site/menus/{id}

> Body 请求参数

```json
{
  "menuName": "string",
  "linkType": 1,
  "linkTarget": "string",
  "sortOrder": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[SiteMenuUpdateRequest](#schemasitemenuupdaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"parentId":0,"menuName":"string","linkType":1,"linkTarget":"string","sortOrder":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSiteMenuVO](#schemaresultsitemenuvo)|

<a id="opIddelete_1"></a>

## DELETE 删除导航项

DELETE /tenant/site/menus/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdsort_1"></a>

## PUT 批量排序

PUT /tenant/site/menus/sort

> Body 请求参数

```json
{
  "items": [
    {
      "id": 0,
      "sortOrder": 0
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[SiteMenuSortRequest](#schemasitemenusortrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdlist_2"></a>

## GET 导航列表

GET /tenant/site/menus

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|parentId|query|integer(int64)| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"parentId":0,"menuName":"string","linkType":1,"linkTarget":"string","sortOrder":0}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListSiteMenuVO](#schemaresultlistsitemenuvo)|

<a id="opIdcreate_1"></a>

## POST 新增导航项

POST /tenant/site/menus

> Body 请求参数

```json
{
  "menuName": "产品",
  "linkType": 1,
  "linkTarget": "12",
  "parentId": 0,
  "sortOrder": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[SiteMenuCreateRequest](#schemasitemenucreaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"parentId":0,"menuName":"string","linkType":1,"linkTarget":"string","sortOrder":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSiteMenuVO](#schemaresultsitemenuvo)|

# 租户端 - 计费

<a id="opIdorders"></a>

## GET 我的订单列表

GET /tenant/billing/orders

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListOrderVO](#schemaresultlistordervo)|

<a id="opIdcreateOrder"></a>

## POST 创建订单

POST /tenant/billing/orders

> Body 请求参数

```json
{
  "planCode": "basic",
  "orderType": "PURCHASE"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[OrderCreateRequest](#schemaordercreaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultOrderVO](#schemaresultordervo)|

<a id="opIdpay"></a>

## POST 发起支付，返回支付表单

POST /tenant/billing/orders/{orderNo}/pay

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultOrderVO](#schemaresultordervo)|

<a id="opIdpaidConfirm"></a>

## POST 我已付款（二次查询或转人工确认）

POST /tenant/billing/orders/{orderNo}/paid-confirm

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultOrderVO](#schemaresultordervo)|

<a id="opIdplans"></a>

## GET 套餐列表（启用中）

GET /tenant/billing/plans

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"planCode":"string","planName":"string","tagText":"string","price":0,"originalPrice":0,"durationDays":0,"description":"string","features":"string","sortOrder":0}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListPublicPricingPlanVO](#schemaresultlistpublicpricingplanvo)|

<a id="opIdorderDetail"></a>

## GET 订单详情（含支付流水）

GET /tenant/billing/orders/{orderNo}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"order":{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"},"payRecords":[{"id":0,"orderNo":"string","payChannel":"alipay","tradeNo":"string","amount":0,"payState":0,"notifyTime":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"}],"logs":[{"id":0,"bizType":0,"bizNo":"string","tenantId":0,"action":"string","operatorType":0,"operatorId":0,"detail":"string","isDelete":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"}]},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultOrderDetailVO](#schemaresultorderdetailvo)|

<a id="opIdsubscriptions"></a>

## GET 当前订阅（含剩余天数/权益）

GET /tenant/billing/subscriptions

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"planId":0,"changeType":1,"subscriptionState":0,"startAt":"2019-08-24T14:15:22Z","expiredAt":"2019-08-24T14:15:22Z","daysLeft":0,"maxRefundable":0,"planSnapshot":"string","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSubscriptionVO](#schemaresultsubscriptionvo)|

<a id="opIdsubscriptionsHistory"></a>

## GET 订阅历史记录（变更日志）

GET /tenant/billing/subscriptions/history

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"subscriptionId":0,"orderId":0,"tenantId":0,"changeType":0,"fromPlanCode":"string","toPlanCode":"string","operatorType":0,"operatorId":0,"remark":"string","isDelete":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListSubscriptionChangeLog](#schemaresultlistsubscriptionchangelog)|

<a id="opIdrefund"></a>

## POST 申请退款

POST /tenant/billing/orders/{orderNo}/refund

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultOrderVO](#schemaresultordervo)|

<a id="opIddowngrade"></a>

## POST 降配（记录下期套餐，到期续费生效）

POST /tenant/billing/downgrade

> Body 请求参数

```json
{
  "planCode": "basic"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[DowngradeRequest](#schemadowngraderequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"planId":0,"changeType":1,"subscriptionState":0,"startAt":"2019-08-24T14:15:22Z","expiredAt":"2019-08-24T14:15:22Z","daysLeft":0,"maxRefundable":0,"planSnapshot":"string","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSubscriptionVO](#schemaresultsubscriptionvo)|

<a id="opIdrefundSubscription"></a>

## POST 申请退款（订阅级：退当前订阅全部剩余价值，按支付订单拆单并待管理员审核）

POST /tenant/billing/subscriptions/refund

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListOrderVO](#schemaresultlistordervo)|

# 支付宝回调

<a id="opIdnotify"></a>

## POST 支付宝异步通知

POST /public/billing/alipay/notify

> 返回示例

> 200 Response

```
"string"
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|

# 平台端 - 通知

<a id="opIdtestEmail"></a>

## POST 发送测试邮件（联调）

POST /admin/notify/test-email

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|to|query|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

# 平台端 - 媒体库

<a id="opIdrenameFolder_1"></a>

## PUT 重命名文件夹

PUT /admin/media/folders/{id}

> Body 请求参数

```json
{
  "folderName": "产品图-新"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[MediaFolderRenameRequest](#schemamediafolderrenamerequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"parentId":0,"folderName":"string","sortOrder":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultMediaFolderVO](#schemaresultmediafoldervo)|

<a id="opIddeleteFolder_1"></a>

## DELETE 删除文件夹

DELETE /admin/media/folders/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdlist_6"></a>

## GET 媒体列表

GET /admin/media

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|folderId|query|integer(int64)| 否 |none|
|fileType|query|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"folderId":0,"fileName":"string","fileType":1,"contentType":"string","url":"string","fileSize":0,"width":0,"height":0,"gmtCreate":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListMediaAssetVO](#schemaresultlistmediaassetvo)|

<a id="opIdupload_1"></a>

## POST 上传媒体

POST /admin/media

> Body 请求参数

```json
{
  "file": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|folderId|query|integer(int64)| 否 |none|
|body|body|object| 否 |none|
|» file|body|string(binary)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"folderId":0,"fileName":"string","fileType":1,"contentType":"string","url":"string","fileSize":0,"width":0,"height":0,"gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultMediaAssetVO](#schemaresultmediaassetvo)|

<a id="opIdlistFolders_1"></a>

## GET 文件夹列表

GET /admin/media/folders

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|parentId|query|integer(int64)| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"parentId":0,"folderName":"string","sortOrder":0}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListMediaFolderVO](#schemaresultlistmediafoldervo)|

<a id="opIdcreateFolder_1"></a>

## POST 创建文件夹

POST /admin/media/folders

> Body 请求参数

```json
{
  "folderName": "产品图",
  "parentId": 0,
  "sortOrder": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[MediaFolderCreateRequest](#schemamediafoldercreaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"parentId":0,"folderName":"string","sortOrder":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultMediaFolderVO](#schemaresultmediafoldervo)|

<a id="opIddelete_5"></a>

## DELETE 删除媒体

DELETE /admin/media/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

# 租户端 - 站内信

<a id="opIdmarkRead"></a>

## PUT 标记单条已读

PUT /tenant/messages/{id}/read

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdmarkAllRead"></a>

## PUT 全部标记已读

PUT /tenant/messages/read-all

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdlist_8"></a>

## GET 站内信列表（分页，可按未读筛选）

GET /tenant/messages

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer(int64)| 否 |none|
|size|query|integer(int64)| 否 |none|
|unreadOnly|query|boolean| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"records":[{"id":0,"receiverId":0,"title":"string","content":"string","isRead":0,"readAt":"2019-08-24T14:15:22Z","isDelete":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"}],"total":0,"size":0,"current":0,"pages":0},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultPageInAppMessage](#schemaresultpageinappmessage)|

<a id="opIdunreadCount"></a>

## GET 未读数（角标）

GET /tenant/messages/unread-count

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":0,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultLong](#schemaresultlong)|

# 平台端 - 站点管理

<a id="opIdupdateState"></a>

## PUT 手动更新站点状态（管理端可绕过实名/订阅门禁，请人工把关）

PUT /admin/sites/{tenantId}/state

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tenantId|path|integer(int64)| 是 |none|
|siteState|query|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"tenantId":0,"siteName":"string","siteIntro":"string","logo":"string","favicon":"string","siteState":0,"publishAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultSiteVO](#schemaresultsitevo)|

<a id="opIdnotifyTenant"></a>

## POST 向租户推送站内信

POST /admin/sites/{tenantId}/notify

> Body 请求参数

```json
{
  "title": "站点到期提醒",
  "content": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tenantId|path|integer(int64)| 是 |none|
|body|body|[SiteNotifyRequest](#schemasitenotifyrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdlist_12"></a>

## GET 全部租户站点列表

GET /admin/sites

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"tenantId":0,"siteName":"string","siteIntro":"string","logo":"string","favicon":"string","siteState":0,"publishAt":"2019-08-24T14:15:22Z","remark":"string","isDelete":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListSite](#schemaresultlistsite)|

<a id="opIdprogress"></a>

## GET 租户站点建站进度

GET /admin/sites/{tenantId}/progress

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tenantId|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"siteId":0,"stage":1,"stageState":0,"remark":"string","isDelete":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListSiteBuildProgress](#schemaresultlistsitebuildprogress)|

# 租户端 - 实名认证

<a id="opIdcurrent"></a>

## GET 当前实名认证状态

GET /tenant/verification

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"tenantId":0,"verifyType":1,"legalName":"string","creditCode":"string","legalPerson":"string","businessLicense":"string","idCardNo":"string","idCardFront":"string","idCardBack":"string","verifyState":0,"rejectReason":"string","verifiedAt":"2019-08-24T14:15:22Z","verifiedExpireAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVerificationVO](#schemaresultverificationvo)|

<a id="opIdsubmit"></a>

## POST 提交实名认证

POST /tenant/verification

> Body 请求参数

```json
{
  "verifyType": 1,
  "legalName": "杭州某某科技有限公司",
  "creditCode": "91330100MA27XXXXX",
  "legalPerson": "张三",
  "businessLicense": "string",
  "idCardNo": "330102199001011234",
  "idCardFront": "string",
  "idCardBack": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[VerificationSubmitRequest](#schemaverificationsubmitrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"tenantId":0,"verifyType":1,"legalName":"string","creditCode":"string","legalPerson":"string","businessLicense":"string","idCardNo":"string","idCardFront":"string","idCardBack":"string","verifyState":0,"rejectReason":"string","verifiedAt":"2019-08-24T14:15:22Z","verifiedExpireAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVerificationVO](#schemaresultverificationvo)|

# 平台端 - 实名认证审核

<a id="opIdreject"></a>

## POST 审核驳回

POST /admin/verification/{id}/reject

> Body 请求参数

```json
{
  "rejectReason": "营业执照信息不清晰，请重新上传"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[VerificationRejectRequest](#schemaverificationrejectrequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"tenantId":0,"verifyType":1,"legalName":"string","creditCode":"string","legalPerson":"string","businessLicense":"string","idCardNo":"string","idCardFront":"string","idCardBack":"string","verifyState":0,"rejectReason":"string","verifiedAt":"2019-08-24T14:15:22Z","verifiedExpireAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVerificationVO](#schemaresultverificationvo)|

<a id="opIdapprove"></a>

## POST 审核通过

POST /admin/verification/{id}/approve

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"tenantId":0,"verifyType":1,"legalName":"string","creditCode":"string","legalPerson":"string","businessLicense":"string","idCardNo":"string","idCardFront":"string","idCardBack":"string","verifyState":0,"rejectReason":"string","verifiedAt":"2019-08-24T14:15:22Z","verifiedExpireAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVerificationVO](#schemaresultverificationvo)|

<a id="opIdlist_10"></a>

## GET 认证记录列表（可按状态筛选）

GET /admin/verification

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|state|query|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"tenantId":0,"verifyType":1,"legalName":"string","creditCode":"string","legalPerson":"string","businessLicense":"string","idCardNo":"string","idCardFront":"string","idCardBack":"string","verifyState":0,"rejectReason":"string","verifiedAt":"2019-08-24T14:15:22Z","verifiedExpireAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListVerificationVO](#schemaresultlistverificationvo)|

<a id="opIdhistory"></a>

## GET 全部历史认证记录

GET /admin/verification/history

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"tenantId":0,"verifyType":1,"legalName":"string","creditCode":"string","legalPerson":"string","businessLicense":"string","idCardNo":"string","idCardFront":"string","idCardBack":"string","verifyState":0,"rejectReason":"string","verifiedAt":"2019-08-24T14:15:22Z","verifiedExpireAt":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListVerificationVO](#schemaresultlistverificationvo)|

# 平台端 - 计费管理

<a id="opIdadjustSubscription"></a>

## POST 手动调整订阅（到期日/套餐/状态，记录操作日志）

POST /admin/billing/subscriptions/{id}/adjust

> Body 请求参数

```json
{
  "planId": 0,
  "expiredAt": "2019-08-24T14:15:22Z",
  "subscriptionState": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|
|body|body|[SubscriptionUpdateRequest](#schemasubscriptionupdaterequest)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"tenantId":0,"planId":0,"planSnapshot":"string","orderId":0,"changeType":1,"startAt":"2019-08-24T14:15:22Z","trialEndAt":"2019-08-24T14:15:22Z","expiredAt":"2019-08-24T14:15:22Z","subscriptionState":0,"lastRemindAt":"2019-08-24T14:15:22Z","nextPlanId":0,"nextPlanCode":"string","remark":"string","isDelete":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultTenantSubscription](#schemaresulttenantsubscription)|

<a id="opIdrefundReject"></a>

## POST 退款审核驳回（恢复支付）

POST /admin/billing/orders/{orderNo}/refund-reject

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdrefundApprove"></a>

## POST 退款审核通过（原路退回）

POST /admin/billing/orders/{orderNo}/refund-approve

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdmanualPaid"></a>

## POST 手动标记支付成功（异常订单人工补单）

POST /admin/billing/orders/{orderNo}/manual-paid

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultOrderVO](#schemaresultordervo)|

<a id="opIdcancel"></a>

## POST 手动取消订单

POST /admin/billing/orders/{orderNo}/cancel

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|
|reason|query|string| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":null,"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultVoid](#schemaresultvoid)|

<a id="opIdsubscriptions_1"></a>

## GET 订阅列表

GET /admin/billing/subscriptions

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"tenantId":0,"planId":0,"planSnapshot":"string","orderId":0,"changeType":1,"startAt":"2019-08-24T14:15:22Z","trialEndAt":"2019-08-24T14:15:22Z","expiredAt":"2019-08-24T14:15:22Z","subscriptionState":0,"lastRemindAt":"2019-08-24T14:15:22Z","nextPlanId":0,"nextPlanCode":"string","remark":"string","isDelete":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListTenantSubscription](#schemaresultlisttenantsubscription)|

<a id="opIdsubscriptionLogs"></a>

## GET 订阅操作日志

GET /admin/billing/subscriptions/{id}/logs

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"bizType":0,"bizNo":"string","tenantId":0,"action":"string","operatorType":0,"operatorId":0,"detail":"string","isDelete":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListBillingOperationLog](#schemaresultlistbillingoperationlog)|

<a id="opIdexportSubscriptions"></a>

## GET 订阅报表导出（CSV，财务对账）

GET /admin/billing/subscriptions/export

> 返回示例

> 200 Response

```
"string"
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|

<a id="opIdorders_1"></a>

## GET 订单列表（可按状态/套餐/时间筛选）

GET /admin/billing/orders

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderState|query|string| 否 |none|
|planId|query|integer(int64)| 否 |none|
|startTime|query|string(date-time)| 否 |none|
|endTime|query|string(date-time)| 否 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":[{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListOrderVO](#schemaresultlistordervo)|

<a id="opIdorderDetail_1"></a>

## GET 订单详情（含支付流水 / 操作日志）

GET /admin/billing/orders/{orderNo}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"order":{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"},"payRecords":[{"id":0,"orderNo":"string","payChannel":"alipay","tradeNo":"string","amount":0,"payState":0,"notifyTime":"2019-08-24T14:15:22Z","gmtCreate":"2019-08-24T14:15:22Z"}],"logs":[{"id":0,"bizType":0,"bizNo":"string","tenantId":0,"action":"string","operatorType":0,"operatorId":0,"detail":"string","isDelete":0,"gmtCreate":"2019-08-24T14:15:22Z","gmtModified":"2019-08-24T14:15:22Z"}]},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultOrderDetailVO](#schemaresultorderdetailvo)|

<a id="opIdmarkReview"></a>

## POST 置待人工确认（异常单人工介入）

POST /admin/billing/orders/{orderNo}/mark-review

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderNo|path|string| 是 |none|

> 返回示例

> 200 Response

```
{"code":"string","msg":"string","data":{"id":0,"orderNo":"string","orderType":1,"planCode":"string","planName":"string","planPrice":0,"durationDays":0,"payChannel":"alipay","originalAmount":0,"amount":0,"orderState":0,"payTime":"2019-08-24T14:15:22Z","payForm":"string","refundAmount":0,"refundTime":"2019-08-24T14:15:22Z","refundReason":"string","gmtCreate":"2019-08-24T14:15:22Z"},"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultOrderVO](#schemaresultordervo)|

# 数据模型

<h2 id="tocS_TokenRequest">TokenRequest</h2>

<a id="schematokenrequest"></a>
<a id="schema_TokenRequest"></a>
<a id="tocStokenrequest"></a>
<a id="tocstokenrequest"></a>

```json
{
  "refreshToken": "string"
}

```

Token 请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|refreshToken|string|true|none||refreshToken|

<h2 id="tocS_LoginVO">LoginVO</h2>

<a id="schemaloginvo"></a>
<a id="schema_LoginVO"></a>
<a id="tocSloginvo"></a>
<a id="tocsloginvo"></a>

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}

```

登录结果

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|accessToken|string|false|none||accessToken|
|refreshToken|string|false|none||refreshToken|

<h2 id="tocS_ResultLoginVO">ResultLoginVO</h2>

<a id="schemaresultloginvo"></a>
<a id="schema_ResultLoginVO"></a>
<a id="tocSresultloginvo"></a>
<a id="tocsresultloginvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[LoginVO](#schemaloginvo)|false|none||登录结果|
|traceId|string|false|none||none|

<h2 id="tocS_ResultVoid">ResultVoid</h2>

<a id="schemaresultvoid"></a>
<a id="schema_ResultVoid"></a>
<a id="tocSresultvoid"></a>
<a id="tocsresultvoid"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": null,
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|any|false|none||none|
|traceId|string|false|none||none|

<h2 id="tocS_LoginRequest">LoginRequest</h2>

<a id="schemaloginrequest"></a>
<a id="schema_LoginRequest"></a>
<a id="tocSloginrequest"></a>
<a id="tocsloginrequest"></a>

```json
{
  "username": "admin",
  "password": "admin123"
}

```

登录请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|username|string|true|none||用户名|
|password|string|true|none||密码|

<h2 id="tocS_ResultUserInfoVO">ResultUserInfoVO</h2>

<a id="schemaresultuserinfovo"></a>
<a id="schema_ResultUserInfoVO"></a>
<a id="tocSresultuserinfovo"></a>
<a id="tocsresultuserinfovo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "username": "string",
    "roles": [
      "string"
    ],
    "buttons": [
      "string"
    ]
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[UserInfoVO](#schemauserinfovo)|false|none||当前用户信息|
|traceId|string|false|none||none|

<h2 id="tocS_UserInfoVO">UserInfoVO</h2>

<a id="schemauserinfovo"></a>
<a id="schema_UserInfoVO"></a>
<a id="tocSuserinfovo"></a>
<a id="tocsuserinfovo"></a>

```json
{
  "id": 0,
  "username": "string",
  "roles": [
    "string"
  ],
  "buttons": [
    "string"
  ]
}

```

当前用户信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||用户ID|
|username|string|false|none||用户名|
|roles|[string]|false|none||角色编码列表|
|buttons|[string]|false|none||权限标识码列表（按钮权限）|

<h2 id="tocS_SmsCodeRequest">SmsCodeRequest</h2>

<a id="schemasmscoderequest"></a>
<a id="schema_SmsCodeRequest"></a>
<a id="tocSsmscoderequest"></a>
<a id="tocssmscoderequest"></a>

```json
{
  "phone": "13800138000",
  "scene": "LOGIN"
}

```

发送短信验证码请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|phone|string|true|none||手机号|
|scene|string|true|none||验证码场景|

#### 枚举值

|属性|值|
|---|---|
|scene|LOGIN|
|scene|REGISTER|
|scene|RESET_PASSWORD|
|scene|BIND_PHONE|
|scene|CHANGE_PHONE|
|scene|TENANT_REGISTER|
|scene|TENANT_LOGIN|

<h2 id="tocS_TenantRegisterRequest">TenantRegisterRequest</h2>

<a id="schematenantregisterrequest"></a>
<a id="schema_TenantRegisterRequest"></a>
<a id="tocStenantregisterrequest"></a>
<a id="tocstenantregisterrequest"></a>

```json
{
  "tenantName": "杭州某某科技有限公司",
  "phone": "13800138000",
  "password": "abc123456",
  "code": "123456"
}

```

租户注册请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tenantName|string|true|none||租户名称（公司/组织名）|
|phone|string|true|none||联系人手机号|
|password|string|true|none||密码|
|code|string|true|none||短信验证码|

<h2 id="tocS_ResultTenantLoginVO">ResultTenantLoginVO</h2>

<a id="schemaresulttenantloginvo"></a>
<a id="schema_ResultTenantLoginVO"></a>
<a id="tocSresulttenantloginvo"></a>
<a id="tocsresulttenantloginvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[TenantLoginVO](#schematenantloginvo)|false|none||租户登录结果|
|traceId|string|false|none||none|

<h2 id="tocS_TenantLoginVO">TenantLoginVO</h2>

<a id="schematenantloginvo"></a>
<a id="schema_TenantLoginVO"></a>
<a id="tocStenantloginvo"></a>
<a id="tocstenantloginvo"></a>

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}

```

租户登录结果

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|accessToken|string|false|none||accessToken|
|refreshToken|string|false|none||refreshToken|

<h2 id="tocS_TenantTokenRequest">TenantTokenRequest</h2>

<a id="schematenanttokenrequest"></a>
<a id="schema_TenantTokenRequest"></a>
<a id="tocStenanttokenrequest"></a>
<a id="tocstenanttokenrequest"></a>

```json
{
  "refreshToken": "string"
}

```

Token 请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|refreshToken|string|true|none||refreshToken|

<h2 id="tocS_TenantPasswordLoginRequest">TenantPasswordLoginRequest</h2>

<a id="schematenantpasswordloginrequest"></a>
<a id="schema_TenantPasswordLoginRequest"></a>
<a id="tocStenantpasswordloginrequest"></a>
<a id="tocstenantpasswordloginrequest"></a>

```json
{
  "phone": "13800138000",
  "password": "abc123456"
}

```

租户登录请求（手机号 + 密码）

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|phone|string|true|none||手机号|
|password|string|true|none||密码|

<h2 id="tocS_TenantCodeLoginRequest">TenantCodeLoginRequest</h2>

<a id="schematenantcodeloginrequest"></a>
<a id="schema_TenantCodeLoginRequest"></a>
<a id="tocStenantcodeloginrequest"></a>
<a id="tocstenantcodeloginrequest"></a>

```json
{
  "phone": "13800138000",
  "code": "123456"
}

```

租户登录请求（手机号 + 验证码）

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|phone|string|true|none||手机号|
|code|string|true|none||短信验证码|

<h2 id="tocS_TenantResetPasswordRequest">TenantResetPasswordRequest</h2>

<a id="schematenantresetpasswordrequest"></a>
<a id="schema_TenantResetPasswordRequest"></a>
<a id="tocStenantresetpasswordrequest"></a>
<a id="tocstenantresetpasswordrequest"></a>

```json
{
  "phone": "13800138000",
  "code": "123456",
  "newPassword": "abc123456",
  "refreshToken": "string"
}

```

重置登录密码请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|phone|string|true|none||手机号|
|code|string|true|none||短信验证码|
|newPassword|string|true|none||新密码|
|refreshToken|string|true|none||当前 refreshToken，重置后加入黑名单|

<h2 id="tocS_TenantPhoneChangeRequest">TenantPhoneChangeRequest</h2>

<a id="schematenantphonechangerequest"></a>
<a id="schema_TenantPhoneChangeRequest"></a>
<a id="tocStenantphonechangerequest"></a>
<a id="tocstenantphonechangerequest"></a>

```json
{
  "newPhone": "13900139000",
  "oldPhoneCode": "123456",
  "newPhoneCode": "654321"
}

```

换绑手机号请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|newPhone|string|true|none||新手机号|
|oldPhoneCode|string|true|none||发送到当前手机号的验证码|
|newPhoneCode|string|true|none||发送到新手机号的验证码|

<h2 id="tocS_TenantProfileUpdateRequest">TenantProfileUpdateRequest</h2>

<a id="schematenantprofileupdaterequest"></a>
<a id="schema_TenantProfileUpdateRequest"></a>
<a id="tocStenantprofileupdaterequest"></a>
<a id="tocstenantprofileupdaterequest"></a>

```json
{
  "tenantName": "杭州某某科技有限公司",
  "contactName": "张三",
  "contactEmail": "contact@example.com",
  "remark": "string",
  "nickname": "张三",
  "email": "zhangsan@example.com",
  "avatar": "https://example.com/avatar.png",
  "gender": 0
}

```

更新租户 Profile 请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tenantName|string|true|none||租户名称|
|contactName|string|false|none||联系人姓名|
|contactEmail|string(email)|false|none||联系人邮箱|
|remark|string|false|none||租户备注|
|nickname|string|false|none||昵称|
|email|string(email)|false|none||邮箱|
|avatar|string|false|none||头像 URL|
|gender|integer(int32)|false|none||性别|

#### 枚举值

|属性|值|
|---|---|
|gender|0|
|gender|1|
|gender|2|

<h2 id="tocS_ResultTenantProfileVO">ResultTenantProfileVO</h2>

<a id="schemaresulttenantprofilevo"></a>
<a id="schema_ResultTenantProfileVO"></a>
<a id="tocSresulttenantprofilevo"></a>
<a id="tocsresulttenantprofilevo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "tenantId": 0,
    "tenantName": "string",
    "tenantCode": "string",
    "contactName": "string",
    "contactPhone": "string",
    "contactEmail": "string",
    "remark": "string",
    "userId": 0,
    "username": "string",
    "nickname": "string",
    "phone": "string",
    "email": "string",
    "avatar": "string",
    "gender": 0
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[TenantProfileVO](#schematenantprofilevo)|false|none||租户 Profile|
|traceId|string|false|none||none|

<h2 id="tocS_TenantProfileVO">TenantProfileVO</h2>

<a id="schematenantprofilevo"></a>
<a id="schema_TenantProfileVO"></a>
<a id="tocStenantprofilevo"></a>
<a id="tocstenantprofilevo"></a>

```json
{
  "tenantId": 0,
  "tenantName": "string",
  "tenantCode": "string",
  "contactName": "string",
  "contactPhone": "string",
  "contactEmail": "string",
  "remark": "string",
  "userId": 0,
  "username": "string",
  "nickname": "string",
  "phone": "string",
  "email": "string",
  "avatar": "string",
  "gender": 0
}

```

租户 Profile

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|tenantId|integer(int64)|false|none||租户ID|
|tenantName|string|false|none||租户名称|
|tenantCode|string|false|none||租户编码|
|contactName|string|false|none||联系人姓名|
|contactPhone|string|false|none||联系人手机号|
|contactEmail|string|false|none||联系人邮箱|
|remark|string|false|none||租户备注|
|userId|integer(int64)|false|none||用户ID|
|username|string|false|none||用户名|
|nickname|string|false|none||昵称|
|phone|string|false|none||手机号|
|email|string|false|none||邮箱|
|avatar|string|false|none||头像 URL|
|gender|integer(int32)|false|none||性别|

#### 枚举值

|属性|值|
|---|---|
|gender|0|
|gender|1|
|gender|2|

<h2 id="tocS_PricingPlanUpdateRequest">PricingPlanUpdateRequest</h2>

<a id="schemapricingplanupdaterequest"></a>
<a id="schema_PricingPlanUpdateRequest"></a>
<a id="tocSpricingplanupdaterequest"></a>
<a id="tocspricingplanupdaterequest"></a>

```json
{
  "planName": "启航版",
  "tagText": "string",
  "price": 499,
  "originalPrice": 0,
  "durationDays": 365,
  "description": "string",
  "features": "string",
  "sortOrder": 0,
  "status": 0,
  "remark": "string"
}

```

更新套餐请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|planName|string|true|none||套餐名称|
|tagText|string|false|none||套餐标签文案|
|price|number|true|none||售价（元），0表示免费|
|originalPrice|number|false|none||原价/划线价（元）|
|durationDays|integer(int32)|true|none||有效期（天），0表示永久有效|
|description|string|false|none||套餐简介|
|features|string|false|none||套餐权益 JSON（写 Redis + 同步 DB 快照），传 null 表示不修改|
|sortOrder|integer(int32)|false|none||排序号，升序排列|
|status|integer(int32)|false|none||状态|
|remark|string|false|none||备注|

#### 枚举值

|属性|值|
|---|---|
|status|0|
|status|1|

<h2 id="tocS_PricingPlanVO">PricingPlanVO</h2>

<a id="schemapricingplanvo"></a>
<a id="schema_PricingPlanVO"></a>
<a id="tocSpricingplanvo"></a>
<a id="tocspricingplanvo"></a>

```json
{
  "id": 0,
  "planName": "string",
  "planCode": "string",
  "tagText": "string",
  "price": 0,
  "originalPrice": 0,
  "durationDays": 0,
  "description": "string",
  "features": "string",
  "sortOrder": 0,
  "status": 0,
  "remark": "string"
}

```

套餐信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|planName|string|false|none||套餐名称|
|planCode|string|false|none||套餐编码|
|tagText|string|false|none||套餐标签文案|
|price|number|false|none||售价（元），0表示免费|
|originalPrice|number|false|none||原价/划线价（元）|
|durationDays|integer(int32)|false|none||有效期（天），0表示永久有效|
|description|string|false|none||套餐简介|
|features|string|false|none||套餐权益 JSON（实时值，Redis 优先）|
|sortOrder|integer(int32)|false|none||排序号|
|status|integer(int32)|false|none||状态|
|remark|string|false|none||备注|

#### 枚举值

|属性|值|
|---|---|
|status|0|
|status|1|

<h2 id="tocS_ResultPricingPlanVO">ResultPricingPlanVO</h2>

<a id="schemaresultpricingplanvo"></a>
<a id="schema_ResultPricingPlanVO"></a>
<a id="tocSresultpricingplanvo"></a>
<a id="tocsresultpricingplanvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "planName": "string",
    "planCode": "string",
    "tagText": "string",
    "price": 0,
    "originalPrice": 0,
    "durationDays": 0,
    "description": "string",
    "features": "string",
    "sortOrder": 0,
    "status": 0,
    "remark": "string"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[PricingPlanVO](#schemapricingplanvo)|false|none||套餐信息|
|traceId|string|false|none||none|

<h2 id="tocS_PricingPlanCreateRequest">PricingPlanCreateRequest</h2>

<a id="schemapricingplancreaterequest"></a>
<a id="schema_PricingPlanCreateRequest"></a>
<a id="tocSpricingplancreaterequest"></a>
<a id="tocspricingplancreaterequest"></a>

```json
{
  "planName": "启航版",
  "planCode": "basic",
  "tagText": "热销推荐",
  "price": 499,
  "originalPrice": 899,
  "durationDays": 365,
  "description": "string",
  "features": "string",
  "sortOrder": 0,
  "status": 0,
  "remark": "string"
}

```

创建套餐请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|planName|string|true|none||套餐名称|
|planCode|string|true|none||套餐编码，唯一标识|
|tagText|string|false|none||套餐标签文案|
|price|number|true|none||售价（元），0表示免费|
|originalPrice|number|false|none||原价/划线价（元）|
|durationDays|integer(int32)|true|none||有效期（天），0表示永久有效|
|description|string|false|none||套餐简介|
|features|string|false|none||套餐权益 JSON（写 Redis + 同步 DB 快照）|
|sortOrder|integer(int32)|false|none||排序号，升序排列|
|status|integer(int32)|false|none||状态，默认启用|
|remark|string|false|none||备注|

#### 枚举值

|属性|值|
|---|---|
|status|0|
|status|1|

<h2 id="tocS_ResultListPricingPlanVO">ResultListPricingPlanVO</h2>

<a id="schemaresultlistpricingplanvo"></a>
<a id="schema_ResultListPricingPlanVO"></a>
<a id="tocSresultlistpricingplanvo"></a>
<a id="tocsresultlistpricingplanvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "planName": "string",
      "planCode": "string",
      "tagText": "string",
      "price": 0,
      "originalPrice": 0,
      "durationDays": 0,
      "description": "string",
      "features": "string",
      "sortOrder": 0,
      "status": 0,
      "remark": "string"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[PricingPlanVO](#schemapricingplanvo)]|false|none||[套餐信息]|
|traceId|string|false|none||none|

<h2 id="tocS_ContentDocumentUpdateRequest">ContentDocumentUpdateRequest</h2>

<a id="schemacontentdocumentupdaterequest"></a>
<a id="schema_ContentDocumentUpdateRequest"></a>
<a id="tocScontentdocumentupdaterequest"></a>
<a id="tocscontentdocumentupdaterequest"></a>

```json
{
  "title": "string",
  "content": "string",
  "category": "string",
  "sortOrder": 0,
  "isPinned": 0,
  "remark": "string"
}

```

更新文档请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|title|string|true|none||标题（FAQ 为问题）|
|content|string|true|none||正文（Markdown；FAQ 为答案）|
|category|string|false|none||分类|
|sortOrder|integer(int32)|false|none||排序号|
|isPinned|integer(int32)|false|none||是否置顶，0-否，1-是|
|remark|string|false|none||备注|

<h2 id="tocS_ContentDocumentVO">ContentDocumentVO</h2>

<a id="schemacontentdocumentvo"></a>
<a id="schema_ContentDocumentVO"></a>
<a id="tocScontentdocumentvo"></a>
<a id="tocscontentdocumentvo"></a>

```json
{
  "id": 0,
  "docKey": "string",
  "docType": 1,
  "category": "string",
  "title": "string",
  "content": "string",
  "publishedTitle": "string",
  "publishedContent": "string",
  "status": 0,
  "version": 0,
  "sortOrder": 0,
  "isPinned": 0,
  "publishAt": "2019-08-24T14:15:22Z",
  "remark": "string"
}

```

文档信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|docKey|string|false|none||文档编码|
|docType|integer(int32)|false|none||文档类型|
|category|string|false|none||分类|
|title|string|false|none||当前标题|
|content|string|false|none||当前正文（草稿）|
|publishedTitle|string|false|none||最近一次发布的标题快照|
|publishedContent|string|false|none||最近一次发布的正文快照|
|status|integer(int32)|false|none||状态|
|version|integer(int32)|false|none||版本号|
|sortOrder|integer(int32)|false|none||排序号|
|isPinned|integer(int32)|false|none||是否置顶|
|publishAt|string(date-time)|false|none||最近发布时间|
|remark|string|false|none||备注|

#### 枚举值

|属性|值|
|---|---|
|docType|1|
|docType|2|
|docType|3|
|docType|4|
|docType|5|
|status|0|
|status|1|
|status|2|

<h2 id="tocS_ResultContentDocumentVO">ResultContentDocumentVO</h2>

<a id="schemaresultcontentdocumentvo"></a>
<a id="schema_ResultContentDocumentVO"></a>
<a id="tocSresultcontentdocumentvo"></a>
<a id="tocsresultcontentdocumentvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "docKey": "string",
    "docType": 1,
    "category": "string",
    "title": "string",
    "content": "string",
    "publishedTitle": "string",
    "publishedContent": "string",
    "status": 0,
    "version": 0,
    "sortOrder": 0,
    "isPinned": 0,
    "publishAt": "2019-08-24T14:15:22Z",
    "remark": "string"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[ContentDocumentVO](#schemacontentdocumentvo)|false|none||文档信息|
|traceId|string|false|none||none|

<h2 id="tocS_ContentDocumentCreateRequest">ContentDocumentCreateRequest</h2>

<a id="schemacontentdocumentcreaterequest"></a>
<a id="schema_ContentDocumentCreateRequest"></a>
<a id="tocScontentdocumentcreaterequest"></a>
<a id="tocscontentdocumentcreaterequest"></a>

```json
{
  "docKey": "help-get-started",
  "docType": 1,
  "category": "入门指南",
  "title": "如何开始使用？",
  "content": "string",
  "sortOrder": 0,
  "isPinned": 0,
  "remark": "string"
}

```

创建文档请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|docKey|string|true|none||文档编码，唯一标识；隐私政策/用户协议建议用固定编码，如 privacy-policy|
|docType|integer(int32)|true|none||文档类型|
|category|string|false|none||分类|
|title|string|true|none||标题（FAQ 为问题）|
|content|string|true|none||正文（Markdown；FAQ 为答案）|
|sortOrder|integer(int32)|false|none||排序号，升序排列|
|isPinned|integer(int32)|false|none||是否置顶，0-否，1-是|
|remark|string|false|none||备注|

#### 枚举值

|属性|值|
|---|---|
|docType|1|
|docType|2|
|docType|3|
|docType|4|
|docType|5|

<h2 id="tocS_ContentDocumentPublishedVO">ContentDocumentPublishedVO</h2>

<a id="schemacontentdocumentpublishedvo"></a>
<a id="schema_ContentDocumentPublishedVO"></a>
<a id="tocScontentdocumentpublishedvo"></a>
<a id="tocscontentdocumentpublishedvo"></a>

```json
{
  "docKey": "string",
  "docType": 1,
  "category": "string",
  "title": "string",
  "content": "string",
  "isPinned": 0,
  "publishAt": "2019-08-24T14:15:22Z",
  "version": 0
}

```

已发布文档信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|docKey|string|false|none||文档编码|
|docType|integer(int32)|false|none||文档类型|
|category|string|false|none||分类|
|title|string|false|none||标题|
|content|string|false|none||正文|
|isPinned|integer(int32)|false|none||是否置顶|
|publishAt|string(date-time)|false|none||发布时间|
|version|integer(int32)|false|none||版本号|

#### 枚举值

|属性|值|
|---|---|
|docType|1|
|docType|2|
|docType|3|
|docType|4|
|docType|5|

<h2 id="tocS_ResultListContentDocumentPublishedVO">ResultListContentDocumentPublishedVO</h2>

<a id="schemaresultlistcontentdocumentpublishedvo"></a>
<a id="schema_ResultListContentDocumentPublishedVO"></a>
<a id="tocSresultlistcontentdocumentpublishedvo"></a>
<a id="tocsresultlistcontentdocumentpublishedvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "docKey": "string",
      "docType": 1,
      "category": "string",
      "title": "string",
      "content": "string",
      "isPinned": 0,
      "publishAt": "2019-08-24T14:15:22Z",
      "version": 0
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[ContentDocumentPublishedVO](#schemacontentdocumentpublishedvo)]|false|none||[已发布文档信息]|
|traceId|string|false|none||none|

<h2 id="tocS_ResultContentDocumentPublishedVO">ResultContentDocumentPublishedVO</h2>

<a id="schemaresultcontentdocumentpublishedvo"></a>
<a id="schema_ResultContentDocumentPublishedVO"></a>
<a id="tocSresultcontentdocumentpublishedvo"></a>
<a id="tocsresultcontentdocumentpublishedvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "docKey": "string",
    "docType": 1,
    "category": "string",
    "title": "string",
    "content": "string",
    "isPinned": 0,
    "publishAt": "2019-08-24T14:15:22Z",
    "version": 0
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[ContentDocumentPublishedVO](#schemacontentdocumentpublishedvo)|false|none||已发布文档信息|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListContentDocumentVO">ResultListContentDocumentVO</h2>

<a id="schemaresultlistcontentdocumentvo"></a>
<a id="schema_ResultListContentDocumentVO"></a>
<a id="tocSresultlistcontentdocumentvo"></a>
<a id="tocsresultlistcontentdocumentvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "docKey": "string",
      "docType": 1,
      "category": "string",
      "title": "string",
      "content": "string",
      "publishedTitle": "string",
      "publishedContent": "string",
      "status": 0,
      "version": 0,
      "sortOrder": 0,
      "isPinned": 0,
      "publishAt": "2019-08-24T14:15:22Z",
      "remark": "string"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[ContentDocumentVO](#schemacontentdocumentvo)]|false|none||[文档信息]|
|traceId|string|false|none||none|

<h2 id="tocS_OpenConversationRequest">OpenConversationRequest</h2>

<a id="schemaopenconversationrequest"></a>
<a id="schema_OpenConversationRequest"></a>
<a id="tocSopenconversationrequest"></a>
<a id="tocsopenconversationrequest"></a>

```json
{
  "topic": "套餐咨询"
}

```

发起客服会话请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|topic|string|false|none||咨询主题/分类|

<h2 id="tocS_ConversationVO">ConversationVO</h2>

<a id="schemaconversationvo"></a>
<a id="schema_ConversationVO"></a>
<a id="tocSconversationvo"></a>
<a id="tocsconversationvo"></a>

```json
{
  "id": 0,
  "customerType": 1,
  "customerId": 0,
  "guestId": "string",
  "agentId": 0,
  "topic": "string",
  "source": 0,
  "status": 0,
  "lastMessageAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

客服会话信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||会话ID|
|customerType|integer(int32)|false|none||咨询方类型|
|customerId|integer(int64)|false|none||租户用户ID（官网访客为 null）|
|guestId|string|false|none||官网访客标识|
|agentId|integer(int64)|false|none||接待客服ID，NULL表示未分配|
|topic|string|false|none||咨询主题/分类|
|source|integer(int32)|false|none||来源渠道：1-官网 2-租户端|
|status|integer(int32)|false|none||会话状态|
|lastMessageAt|string(date-time)|false|none||最后消息时间|
|createdAt|string(date-time)|false|none||创建时间|

#### 枚举值

|属性|值|
|---|---|
|customerType|1|
|customerType|2|
|status|0|
|status|1|
|status|2|

<h2 id="tocS_ResultConversationVO">ResultConversationVO</h2>

<a id="schemaresultconversationvo"></a>
<a id="schema_ResultConversationVO"></a>
<a id="tocSresultconversationvo"></a>
<a id="tocsresultconversationvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "customerType": 1,
    "customerId": 0,
    "guestId": "string",
    "agentId": 0,
    "topic": "string",
    "source": 0,
    "status": 0,
    "lastMessageAt": "2019-08-24T14:15:22Z",
    "createdAt": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[ConversationVO](#schemaconversationvo)|false|none||客服会话信息|
|traceId|string|false|none||none|

<h2 id="tocS_SendMessageRequest">SendMessageRequest</h2>

<a id="schemasendmessagerequest"></a>
<a id="schema_SendMessageRequest"></a>
<a id="tocSsendmessagerequest"></a>
<a id="tocssendmessagerequest"></a>

```json
{
  "content": "你好，我想咨询一下套餐",
  "clientMsgId": "string"
}

```

发送客服消息请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|content|string|true|none||消息内容|
|clientMsgId|string|false|none||客户端幂等ID（同一会话内重复提交不重复入库）|

<h2 id="tocS_MessageVO">MessageVO</h2>

<a id="schemamessagevo"></a>
<a id="schema_MessageVO"></a>
<a id="tocSmessagevo"></a>
<a id="tocsmessagevo"></a>

```json
{
  "id": 0,
  "conversationId": 0,
  "senderType": 1,
  "senderId": 0,
  "msgType": 1,
  "content": "string",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

客服消息信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||消息ID|
|conversationId|integer(int64)|false|none||会话ID|
|senderType|integer(int32)|false|none||发送方类型|
|senderId|integer(int64)|false|none||发送人ID|
|msgType|integer(int32)|false|none||消息类型|
|content|string|false|none||消息内容|
|createdAt|string(date-time)|false|none||发送时间|

#### 枚举值

|属性|值|
|---|---|
|senderType|1|
|senderType|2|
|senderType|3|
|msgType|1|
|msgType|2|
|msgType|3|

<h2 id="tocS_ResultMessageVO">ResultMessageVO</h2>

<a id="schemaresultmessagevo"></a>
<a id="schema_ResultMessageVO"></a>
<a id="tocSresultmessagevo"></a>
<a id="tocsresultmessagevo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "conversationId": 0,
    "senderType": 1,
    "senderId": 0,
    "msgType": 1,
    "content": "string",
    "createdAt": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[MessageVO](#schemamessagevo)|false|none||客服消息信息|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListConversationVO">ResultListConversationVO</h2>

<a id="schemaresultlistconversationvo"></a>
<a id="schema_ResultListConversationVO"></a>
<a id="tocSresultlistconversationvo"></a>
<a id="tocsresultlistconversationvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "customerType": 1,
      "customerId": 0,
      "guestId": "string",
      "agentId": 0,
      "topic": "string",
      "source": 0,
      "status": 0,
      "lastMessageAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[ConversationVO](#schemaconversationvo)]|false|none||[客服会话信息]|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListMessageVO">ResultListMessageVO</h2>

<a id="schemaresultlistmessagevo"></a>
<a id="schema_ResultListMessageVO"></a>
<a id="tocSresultlistmessagevo"></a>
<a id="tocsresultlistmessagevo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "conversationId": 0,
      "senderType": 1,
      "senderId": 0,
      "msgType": 1,
      "content": "string",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[MessageVO](#schemamessagevo)]|false|none||[客服消息信息]|
|traceId|string|false|none||none|

<h2 id="tocS_PublicPricingPlanVO">PublicPricingPlanVO</h2>

<a id="schemapublicpricingplanvo"></a>
<a id="schema_PublicPricingPlanVO"></a>
<a id="tocSpublicpricingplanvo"></a>
<a id="tocspublicpricingplanvo"></a>

```json
{
  "planCode": "string",
  "planName": "string",
  "tagText": "string",
  "price": 0,
  "originalPrice": 0,
  "durationDays": 0,
  "description": "string",
  "features": "string",
  "sortOrder": 0
}

```

公开套餐信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|planCode|string|false|none||套餐编码|
|planName|string|false|none||套餐名称|
|tagText|string|false|none||套餐标签文案|
|price|number|false|none||售价（元），0表示免费|
|originalPrice|number|false|none||原价/划线价（元）|
|durationDays|integer(int32)|false|none||有效期（天），0表示永久有效|
|description|string|false|none||套餐简介|
|features|string|false|none||套餐权益 JSON（Redis 实时值）|
|sortOrder|integer(int32)|false|none||排序号|

<h2 id="tocS_ResultListPublicPricingPlanVO">ResultListPublicPricingPlanVO</h2>

<a id="schemaresultlistpublicpricingplanvo"></a>
<a id="schema_ResultListPublicPricingPlanVO"></a>
<a id="tocSresultlistpublicpricingplanvo"></a>
<a id="tocsresultlistpublicpricingplanvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "planCode": "string",
      "planName": "string",
      "tagText": "string",
      "price": 0,
      "originalPrice": 0,
      "durationDays": 0,
      "description": "string",
      "features": "string",
      "sortOrder": 0
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[PublicPricingPlanVO](#schemapublicpricingplanvo)]|false|none||[公开套餐信息]|
|traceId|string|false|none||none|

<h2 id="tocS_ResultSupportLeadVO">ResultSupportLeadVO</h2>

<a id="schemaresultsupportleadvo"></a>
<a id="schema_ResultSupportLeadVO"></a>
<a id="tocSresultsupportleadvo"></a>
<a id="tocsresultsupportleadvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "name": "string",
    "phone": "string",
    "demand": "string",
    "leadState": 0,
    "handleBy": 0,
    "gmtHandled": "2019-08-24T14:15:22Z",
    "gmtCreate": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[SupportLeadVO](#schemasupportleadvo)|false|none||官网联系我们线索信息|
|traceId|string|false|none||none|

<h2 id="tocS_SupportLeadVO">SupportLeadVO</h2>

<a id="schemasupportleadvo"></a>
<a id="schema_SupportLeadVO"></a>
<a id="tocSsupportleadvo"></a>
<a id="tocssupportleadvo"></a>

```json
{
  "id": 0,
  "name": "string",
  "phone": "string",
  "demand": "string",
  "leadState": 0,
  "handleBy": 0,
  "gmtHandled": "2019-08-24T14:15:22Z",
  "gmtCreate": "2019-08-24T14:15:22Z"
}

```

官网联系我们线索信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||线索ID|
|name|string|false|none||姓名/称呼|
|phone|string|false|none||手机号|
|demand|string|false|none||需求描述|
|leadState|integer(int32)|false|none||线索状态|
|handleBy|integer(int64)|false|none||跟进客服ID|
|gmtHandled|string(date-time)|false|none||跟进时间|
|gmtCreate|string(date-time)|false|none||创建时间|

#### 枚举值

|属性|值|
|---|---|
|leadState|0|
|leadState|1|
|leadState|2|

<h2 id="tocS_SupportLeadSubmitRequest">SupportLeadSubmitRequest</h2>

<a id="schemasupportleadsubmitrequest"></a>
<a id="schema_SupportLeadSubmitRequest"></a>
<a id="tocSsupportleadsubmitrequest"></a>
<a id="tocssupportleadsubmitrequest"></a>

```json
{
  "name": "张三",
  "phone": "13800138000",
  "demand": "想了解套餐价格与交付周期"
}

```

提交官网联系我们线索请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|name|string|true|none||姓名/称呼|
|phone|string|true|none||手机号|
|demand|string|true|none||需求描述|

<h2 id="tocS_ContentDocumentPublishedListItemVO">ContentDocumentPublishedListItemVO</h2>

<a id="schemacontentdocumentpublishedlistitemvo"></a>
<a id="schema_ContentDocumentPublishedListItemVO"></a>
<a id="tocScontentdocumentpublishedlistitemvo"></a>
<a id="tocscontentdocumentpublishedlistitemvo"></a>

```json
{
  "docKey": "string",
  "docType": 1,
  "category": "string",
  "title": "string",
  "isPinned": 0,
  "publishAt": "2019-08-24T14:15:22Z",
  "version": 0
}

```

已发布文档列表项（不含正文）

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|docKey|string|false|none||文档编码|
|docType|integer(int32)|false|none||文档类型|
|category|string|false|none||分类|
|title|string|false|none||标题|
|isPinned|integer(int32)|false|none||是否置顶|
|publishAt|string(date-time)|false|none||发布时间|
|version|integer(int32)|false|none||版本号|

#### 枚举值

|属性|值|
|---|---|
|docType|1|
|docType|2|
|docType|3|
|docType|4|
|docType|5|

<h2 id="tocS_ResultListContentDocumentPublishedListItemVO">ResultListContentDocumentPublishedListItemVO</h2>

<a id="schemaresultlistcontentdocumentpublishedlistitemvo"></a>
<a id="schema_ResultListContentDocumentPublishedListItemVO"></a>
<a id="tocSresultlistcontentdocumentpublishedlistitemvo"></a>
<a id="tocsresultlistcontentdocumentpublishedlistitemvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "docKey": "string",
      "docType": 1,
      "category": "string",
      "title": "string",
      "isPinned": 0,
      "publishAt": "2019-08-24T14:15:22Z",
      "version": 0
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[ContentDocumentPublishedListItemVO](#schemacontentdocumentpublishedlistitemvo)]|false|none||[已发布文档列表项（不含正文）]|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListSupportLeadVO">ResultListSupportLeadVO</h2>

<a id="schemaresultlistsupportleadvo"></a>
<a id="schema_ResultListSupportLeadVO"></a>
<a id="tocSresultlistsupportleadvo"></a>
<a id="tocsresultlistsupportleadvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "phone": "string",
      "demand": "string",
      "leadState": 0,
      "handleBy": 0,
      "gmtHandled": "2019-08-24T14:15:22Z",
      "gmtCreate": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[SupportLeadVO](#schemasupportleadvo)]|false|none||[官网联系我们线索信息]|
|traceId|string|false|none||none|

<h2 id="tocS_ContentDocumentListItemVO">ContentDocumentListItemVO</h2>

<a id="schemacontentdocumentlistitemvo"></a>
<a id="schema_ContentDocumentListItemVO"></a>
<a id="tocScontentdocumentlistitemvo"></a>
<a id="tocscontentdocumentlistitemvo"></a>

```json
{
  "id": 0,
  "docKey": "string",
  "docType": 1,
  "category": "string",
  "title": "string",
  "publishedTitle": "string",
  "status": 0,
  "version": 0,
  "sortOrder": 0,
  "isPinned": 0,
  "publishAt": "2019-08-24T14:15:22Z",
  "remark": "string"
}

```

文档列表项（不含正文）

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|docKey|string|false|none||文档编码|
|docType|integer(int32)|false|none||文档类型|
|category|string|false|none||分类|
|title|string|false|none||当前标题|
|publishedTitle|string|false|none||最近一次发布的标题快照|
|status|integer(int32)|false|none||状态|
|version|integer(int32)|false|none||版本号|
|sortOrder|integer(int32)|false|none||排序号|
|isPinned|integer(int32)|false|none||是否置顶|
|publishAt|string(date-time)|false|none||最近发布时间|
|remark|string|false|none||备注|

#### 枚举值

|属性|值|
|---|---|
|docType|1|
|docType|2|
|docType|3|
|docType|4|
|docType|5|
|status|0|
|status|1|
|status|2|

<h2 id="tocS_ResultListContentDocumentListItemVO">ResultListContentDocumentListItemVO</h2>

<a id="schemaresultlistcontentdocumentlistitemvo"></a>
<a id="schema_ResultListContentDocumentListItemVO"></a>
<a id="tocSresultlistcontentdocumentlistitemvo"></a>
<a id="tocsresultlistcontentdocumentlistitemvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "docKey": "string",
      "docType": 1,
      "category": "string",
      "title": "string",
      "publishedTitle": "string",
      "status": 0,
      "version": 0,
      "sortOrder": 0,
      "isPinned": 0,
      "publishAt": "2019-08-24T14:15:22Z",
      "remark": "string"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[ContentDocumentListItemVO](#schemacontentdocumentlistitemvo)]|false|none||[文档列表项（不含正文）]|
|traceId|string|false|none||none|

<h2 id="tocS_SiteUpdateRequest">SiteUpdateRequest</h2>

<a id="schemasiteupdaterequest"></a>
<a id="schema_SiteUpdateRequest"></a>
<a id="tocSsiteupdaterequest"></a>
<a id="tocssiteupdaterequest"></a>

```json
{
  "siteName": "杭州某某科技",
  "siteIntro": "string",
  "logo": "https://example.com/logo.png",
  "favicon": "string"
}

```

更新站点请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|siteName|string|true|none||站点名称|
|siteIntro|string|false|none||站点简介|
|logo|string|false|none||站点 Logo URL|
|favicon|string|false|none||站点 Favicon URL|

<h2 id="tocS_ResultSiteVO">ResultSiteVO</h2>

<a id="schemaresultsitevo"></a>
<a id="schema_ResultSiteVO"></a>
<a id="tocSresultsitevo"></a>
<a id="tocsresultsitevo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "tenantId": 0,
    "siteName": "string",
    "siteIntro": "string",
    "logo": "string",
    "favicon": "string",
    "siteState": 0,
    "publishAt": "2019-08-24T14:15:22Z",
    "gmtCreate": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[SiteVO](#schemasitevo)|false|none||站点信息|
|traceId|string|false|none||none|

<h2 id="tocS_SiteVO">SiteVO</h2>

<a id="schemasitevo"></a>
<a id="schema_SiteVO"></a>
<a id="tocSsitevo"></a>
<a id="tocssitevo"></a>

```json
{
  "id": 0,
  "tenantId": 0,
  "siteName": "string",
  "siteIntro": "string",
  "logo": "string",
  "favicon": "string",
  "siteState": 0,
  "publishAt": "2019-08-24T14:15:22Z",
  "gmtCreate": "2019-08-24T14:15:22Z"
}

```

站点信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||站点ID|
|tenantId|integer(int64)|false|none||租户ID|
|siteName|string|false|none||站点名称|
|siteIntro|string|false|none||站点简介|
|logo|string|false|none||站点 Logo URL|
|favicon|string|false|none||站点 Favicon URL|
|siteState|integer(int32)|false|none||站点状态|
|publishAt|string(date-time)|false|none||发布时间|
|gmtCreate|string(date-time)|false|none||创建时间|

#### 枚举值

|属性|值|
|---|---|
|siteState|0|
|siteState|1|
|siteState|2|
|siteState|3|
|siteState|4|
|siteState|5|

<h2 id="tocS_MediaFolderRenameRequest">MediaFolderRenameRequest</h2>

<a id="schemamediafolderrenamerequest"></a>
<a id="schema_MediaFolderRenameRequest"></a>
<a id="tocSmediafolderrenamerequest"></a>
<a id="tocsmediafolderrenamerequest"></a>

```json
{
  "folderName": "产品图-新"
}

```

重命名媒体文件夹请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|folderName|string|true|none||文件夹名称|

<h2 id="tocS_MediaFolderVO">MediaFolderVO</h2>

<a id="schemamediafoldervo"></a>
<a id="schema_MediaFolderVO"></a>
<a id="tocSmediafoldervo"></a>
<a id="tocsmediafoldervo"></a>

```json
{
  "id": 0,
  "parentId": 0,
  "folderName": "string",
  "sortOrder": 0
}

```

媒体文件夹信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||文件夹ID|
|parentId|integer(int64)|false|none||父文件夹ID，0-根目录|
|folderName|string|false|none||文件夹名称|
|sortOrder|integer(int32)|false|none||排序号|

<h2 id="tocS_ResultMediaFolderVO">ResultMediaFolderVO</h2>

<a id="schemaresultmediafoldervo"></a>
<a id="schema_ResultMediaFolderVO"></a>
<a id="tocSresultmediafoldervo"></a>
<a id="tocsresultmediafoldervo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "parentId": 0,
    "folderName": "string",
    "sortOrder": 0
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[MediaFolderVO](#schemamediafoldervo)|false|none||媒体文件夹信息|
|traceId|string|false|none||none|

<h2 id="tocS_MediaAssetVO">MediaAssetVO</h2>

<a id="schemamediaassetvo"></a>
<a id="schema_MediaAssetVO"></a>
<a id="tocSmediaassetvo"></a>
<a id="tocsmediaassetvo"></a>

```json
{
  "id": 0,
  "folderId": 0,
  "fileName": "string",
  "fileType": 1,
  "contentType": "string",
  "url": "string",
  "fileSize": 0,
  "width": 0,
  "height": 0,
  "gmtCreate": "2019-08-24T14:15:22Z"
}

```

媒体资产信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||媒体ID|
|folderId|integer(int64)|false|none||所属文件夹ID，0-根目录|
|fileName|string|false|none||原始文件名|
|fileType|integer(int32)|false|none||文件类型|
|contentType|string|false|none||MIME 类型|
|url|string|false|none||文件访问 URL|
|fileSize|integer(int64)|false|none||文件大小（字节）|
|width|integer(int32)|false|none||图片宽度|
|height|integer(int32)|false|none||图片高度|
|gmtCreate|string(date-time)|false|none||创建时间|

#### 枚举值

|属性|值|
|---|---|
|fileType|1|
|fileType|2|
|fileType|3|

<h2 id="tocS_ResultMediaAssetVO">ResultMediaAssetVO</h2>

<a id="schemaresultmediaassetvo"></a>
<a id="schema_ResultMediaAssetVO"></a>
<a id="tocSresultmediaassetvo"></a>
<a id="tocsresultmediaassetvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "folderId": 0,
    "fileName": "string",
    "fileType": 1,
    "contentType": "string",
    "url": "string",
    "fileSize": 0,
    "width": 0,
    "height": 0,
    "gmtCreate": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[MediaAssetVO](#schemamediaassetvo)|false|none||媒体资产信息|
|traceId|string|false|none||none|

<h2 id="tocS_MediaFolderCreateRequest">MediaFolderCreateRequest</h2>

<a id="schemamediafoldercreaterequest"></a>
<a id="schema_MediaFolderCreateRequest"></a>
<a id="tocSmediafoldercreaterequest"></a>
<a id="tocsmediafoldercreaterequest"></a>

```json
{
  "folderName": "产品图",
  "parentId": 0,
  "sortOrder": 0
}

```

创建媒体文件夹请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|folderName|string|true|none||文件夹名称|
|parentId|integer(int64)|false|none||父文件夹ID，不传或0为根目录|
|sortOrder|integer(int32)|false|none||排序号|

<h2 id="tocS_ResultListMediaAssetVO">ResultListMediaAssetVO</h2>

<a id="schemaresultlistmediaassetvo"></a>
<a id="schema_ResultListMediaAssetVO"></a>
<a id="tocSresultlistmediaassetvo"></a>
<a id="tocsresultlistmediaassetvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "folderId": 0,
      "fileName": "string",
      "fileType": 1,
      "contentType": "string",
      "url": "string",
      "fileSize": 0,
      "width": 0,
      "height": 0,
      "gmtCreate": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[MediaAssetVO](#schemamediaassetvo)]|false|none||[媒体资产信息]|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListMediaFolderVO">ResultListMediaFolderVO</h2>

<a id="schemaresultlistmediafoldervo"></a>
<a id="schema_ResultListMediaFolderVO"></a>
<a id="tocSresultlistmediafoldervo"></a>
<a id="tocsresultlistmediafoldervo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "parentId": 0,
      "folderName": "string",
      "sortOrder": 0
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[MediaFolderVO](#schemamediafoldervo)]|false|none||[媒体文件夹信息]|
|traceId|string|false|none||none|

<h2 id="tocS_SitePageUpdateRequest">SitePageUpdateRequest</h2>

<a id="schemasitepageupdaterequest"></a>
<a id="schema_SitePageUpdateRequest"></a>
<a id="tocSsitepageupdaterequest"></a>
<a id="tocssitepageupdaterequest"></a>

```json
{
  "pageTitle": "首页",
  "pagePath": "home",
  "pageState": 0,
  "sortOrder": 0
}

```

更新站点页面请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|pageTitle|string|true|none||页面标题|
|pagePath|string|true|none||页面路径/slug，同租户内唯一|
|pageState|integer(int32)|false|none||页面状态（发布/下线/草稿），传 null 表示不修改|
|sortOrder|integer(int32)|false|none||排序号，传 null 表示不修改|

#### 枚举值

|属性|值|
|---|---|
|pageState|0|
|pageState|1|
|pageState|2|

<h2 id="tocS_ResultSitePageVO">ResultSitePageVO</h2>

<a id="schemaresultsitepagevo"></a>
<a id="schema_ResultSitePageVO"></a>
<a id="tocSresultsitepagevo"></a>
<a id="tocsresultsitepagevo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "pageTitle": "string",
    "pagePath": "string",
    "pageState": 0,
    "sortOrder": 0,
    "gmtCreate": "2019-08-24T14:15:22Z",
    "gmtModified": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[SitePageVO](#schemasitepagevo)|false|none||站点页面信息|
|traceId|string|false|none||none|

<h2 id="tocS_SitePageVO">SitePageVO</h2>

<a id="schemasitepagevo"></a>
<a id="schema_SitePageVO"></a>
<a id="tocSsitepagevo"></a>
<a id="tocssitepagevo"></a>

```json
{
  "id": 0,
  "pageTitle": "string",
  "pagePath": "string",
  "pageState": 0,
  "sortOrder": 0,
  "gmtCreate": "2019-08-24T14:15:22Z",
  "gmtModified": "2019-08-24T14:15:22Z"
}

```

站点页面信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||页面ID|
|pageTitle|string|false|none||页面标题|
|pagePath|string|false|none||页面路径/slug|
|pageState|integer(int32)|false|none||页面状态|
|sortOrder|integer(int32)|false|none||排序号|
|gmtCreate|string(date-time)|false|none||创建时间|
|gmtModified|string(date-time)|false|none||修改时间|

#### 枚举值

|属性|值|
|---|---|
|pageState|0|
|pageState|1|
|pageState|2|

<h2 id="tocS_ResultSitePageDetailVO">ResultSitePageDetailVO</h2>

<a id="schemaresultsitepagedetailvo"></a>
<a id="schema_ResultSitePageDetailVO"></a>
<a id="tocSresultsitepagedetailvo"></a>
<a id="tocsresultsitepagedetailvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "pageTitle": "string",
    "pagePath": "string",
    "content": "string",
    "pageState": 0,
    "sortOrder": 0,
    "version": 0,
    "gmtCreate": "2019-08-24T14:15:22Z",
    "gmtModified": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[SitePageDetailVO](#schemasitepagedetailvo)|false|none||站点页面详情|
|traceId|string|false|none||none|

<h2 id="tocS_SitePageDetailVO">SitePageDetailVO</h2>

<a id="schemasitepagedetailvo"></a>
<a id="schema_SitePageDetailVO"></a>
<a id="tocSsitepagedetailvo"></a>
<a id="tocssitepagedetailvo"></a>

```json
{
  "id": 0,
  "pageTitle": "string",
  "pagePath": "string",
  "content": "string",
  "pageState": 0,
  "sortOrder": 0,
  "version": 0,
  "gmtCreate": "2019-08-24T14:15:22Z",
  "gmtModified": "2019-08-24T14:15:22Z"
}

```

站点页面详情

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||页面ID|
|pageTitle|string|false|none||页面标题|
|pagePath|string|false|none||页面路径/slug|
|content|string|false|none||页面内容（Puck JSON）|
|pageState|integer(int32)|false|none||页面状态|
|sortOrder|integer(int32)|false|none||排序号|
|version|integer(int32)|false|none||当前版本号|
|gmtCreate|string(date-time)|false|none||创建时间|
|gmtModified|string(date-time)|false|none||修改时间|

#### 枚举值

|属性|值|
|---|---|
|pageState|0|
|pageState|1|
|pageState|2|

<h2 id="tocS_SitePageContentRequest">SitePageContentRequest</h2>

<a id="schemasitepagecontentrequest"></a>
<a id="schema_SitePageContentRequest"></a>
<a id="tocSsitepagecontentrequest"></a>
<a id="tocssitepagecontentrequest"></a>

```json
{
  "content": "string"
}

```

保存站点页面内容请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|content|string|true|none||页面内容（Puck JSON）|

<h2 id="tocS_Item">Item</h2>

<a id="schemaitem"></a>
<a id="schema_Item"></a>
<a id="tocSitem"></a>
<a id="tocsitem"></a>

```json
{
  "id": 0,
  "sortOrder": 0
}

```

排序项

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|true|none||页面ID|
|sortOrder|integer(int32)|true|none||排序号|

<h2 id="tocS_SitePageSortRequest">SitePageSortRequest</h2>

<a id="schemasitepagesortrequest"></a>
<a id="schema_SitePageSortRequest"></a>
<a id="tocSsitepagesortrequest"></a>
<a id="tocssitepagesortrequest"></a>

```json
{
  "items": [
    {
      "id": 0,
      "sortOrder": 0
    }
  ]
}

```

站点页面批量排序请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|items|[[Item](#schemaitem)]|true|none||排序项列表（按期望顺序）|

<h2 id="tocS_SiteMenuUpdateRequest">SiteMenuUpdateRequest</h2>

<a id="schemasitemenuupdaterequest"></a>
<a id="schema_SiteMenuUpdateRequest"></a>
<a id="tocSsitemenuupdaterequest"></a>
<a id="tocssitemenuupdaterequest"></a>

```json
{
  "menuName": "string",
  "linkType": 1,
  "linkTarget": "string",
  "sortOrder": 0
}

```

更新站点导航项请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|menuName|string|true|none||菜单名称|
|linkType|integer(int32)|true|none||链接类型：1-站点页面 2-自定义URL|
|linkTarget|string|true|none||链接目标（页面ID或URL）|
|sortOrder|integer(int32)|false|none||排序号，传 null 表示不修改|

#### 枚举值

|属性|值|
|---|---|
|linkType|1|
|linkType|2|

<h2 id="tocS_ResultSiteMenuVO">ResultSiteMenuVO</h2>

<a id="schemaresultsitemenuvo"></a>
<a id="schema_ResultSiteMenuVO"></a>
<a id="tocSresultsitemenuvo"></a>
<a id="tocsresultsitemenuvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "parentId": 0,
    "menuName": "string",
    "linkType": 1,
    "linkTarget": "string",
    "sortOrder": 0
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[SiteMenuVO](#schemasitemenuvo)|false|none||站点导航菜单信息|
|traceId|string|false|none||none|

<h2 id="tocS_SiteMenuVO">SiteMenuVO</h2>

<a id="schemasitemenuvo"></a>
<a id="schema_SiteMenuVO"></a>
<a id="tocSsitemenuvo"></a>
<a id="tocssitemenuvo"></a>

```json
{
  "id": 0,
  "parentId": 0,
  "menuName": "string",
  "linkType": 1,
  "linkTarget": "string",
  "sortOrder": 0
}

```

站点导航菜单信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||导航项ID|
|parentId|integer(int64)|false|none||父菜单ID，0-顶级|
|menuName|string|false|none||菜单名称|
|linkType|integer(int32)|false|none||链接类型|
|linkTarget|string|false|none||链接目标（页面ID或URL）|
|sortOrder|integer(int32)|false|none||排序号|

#### 枚举值

|属性|值|
|---|---|
|linkType|1|
|linkType|2|

<h2 id="tocS_SiteMenuSortRequest">SiteMenuSortRequest</h2>

<a id="schemasitemenusortrequest"></a>
<a id="schema_SiteMenuSortRequest"></a>
<a id="tocSsitemenusortrequest"></a>
<a id="tocssitemenusortrequest"></a>

```json
{
  "items": [
    {
      "id": 0,
      "sortOrder": 0
    }
  ]
}

```

站点导航批量排序请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|items|[[Item](#schemaitem)]|true|none||排序项列表（按期望顺序）|

<h2 id="tocS_SitePageCreateRequest">SitePageCreateRequest</h2>

<a id="schemasitepagecreaterequest"></a>
<a id="schema_SitePageCreateRequest"></a>
<a id="tocSsitepagecreaterequest"></a>
<a id="tocssitepagecreaterequest"></a>

```json
{
  "pageTitle": "首页",
  "pagePath": "home",
  "content": "string",
  "sortOrder": 0
}

```

新增站点页面请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|pageTitle|string|true|none||页面标题|
|pagePath|string|true|none||页面路径/slug，同租户内唯一|
|content|string|false|none||页面内容（Puck JSON），可不传为空页面|
|sortOrder|integer(int32)|false|none||排序号，默认0|

<h2 id="tocS_SiteMenuCreateRequest">SiteMenuCreateRequest</h2>

<a id="schemasitemenucreaterequest"></a>
<a id="schema_SiteMenuCreateRequest"></a>
<a id="tocSsitemenucreaterequest"></a>
<a id="tocssitemenucreaterequest"></a>

```json
{
  "menuName": "产品",
  "linkType": 1,
  "linkTarget": "12",
  "parentId": 0,
  "sortOrder": 0
}

```

新增站点导航项请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|menuName|string|true|none||菜单名称|
|linkType|integer(int32)|true|none||链接类型：1-站点页面 2-自定义URL|
|linkTarget|string|true|none||链接目标（页面ID或URL）|
|parentId|integer(int64)|false|none||父菜单ID，默认0（顶级）|
|sortOrder|integer(int32)|false|none||排序号，默认0|

#### 枚举值

|属性|值|
|---|---|
|linkType|1|
|linkType|2|

<h2 id="tocS_ResultListSitePageVO">ResultListSitePageVO</h2>

<a id="schemaresultlistsitepagevo"></a>
<a id="schema_ResultListSitePageVO"></a>
<a id="tocSresultlistsitepagevo"></a>
<a id="tocsresultlistsitepagevo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "pageTitle": "string",
      "pagePath": "string",
      "pageState": 0,
      "sortOrder": 0,
      "gmtCreate": "2019-08-24T14:15:22Z",
      "gmtModified": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[SitePageVO](#schemasitepagevo)]|false|none||[站点页面信息]|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListSitePageVersionVO">ResultListSitePageVersionVO</h2>

<a id="schemaresultlistsitepageversionvo"></a>
<a id="schema_ResultListSitePageVersionVO"></a>
<a id="tocSresultlistsitepageversionvo"></a>
<a id="tocsresultlistsitepageversionvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "version": 0,
      "pageTitle": "string",
      "gmtCreate": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[SitePageVersionVO](#schemasitepageversionvo)]|false|none||[站点页面版本信息]|
|traceId|string|false|none||none|

<h2 id="tocS_SitePageVersionVO">SitePageVersionVO</h2>

<a id="schemasitepageversionvo"></a>
<a id="schema_SitePageVersionVO"></a>
<a id="tocSsitepageversionvo"></a>
<a id="tocssitepageversionvo"></a>

```json
{
  "id": 0,
  "version": 0,
  "pageTitle": "string",
  "gmtCreate": "2019-08-24T14:15:22Z"
}

```

站点页面版本信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||版本ID|
|version|integer(int32)|false|none||版本号|
|pageTitle|string|false|none||该版本页面标题|
|gmtCreate|string(date-time)|false|none||保存时间|

<h2 id="tocS_ResultListSiteMenuVO">ResultListSiteMenuVO</h2>

<a id="schemaresultlistsitemenuvo"></a>
<a id="schema_ResultListSiteMenuVO"></a>
<a id="tocSresultlistsitemenuvo"></a>
<a id="tocsresultlistsitemenuvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "parentId": 0,
      "menuName": "string",
      "linkType": 1,
      "linkTarget": "string",
      "sortOrder": 0
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[SiteMenuVO](#schemasitemenuvo)]|false|none||[站点导航菜单信息]|
|traceId|string|false|none||none|

<h2 id="tocS_OrderCreateRequest">OrderCreateRequest</h2>

<a id="schemaordercreaterequest"></a>
<a id="schema_OrderCreateRequest"></a>
<a id="tocSordercreaterequest"></a>
<a id="tocsordercreaterequest"></a>

```json
{
  "planCode": "basic",
  "orderType": "PURCHASE"
}

```

创建订单请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|planCode|string|true|none||套餐编码|
|orderType|integer(int32)|false|none||订单类型，默认购买|

#### 枚举值

|属性|值|
|---|---|
|orderType|1|
|orderType|2|
|orderType|3|
|orderType|4|

<h2 id="tocS_OrderVO">OrderVO</h2>

<a id="schemaordervo"></a>
<a id="schema_OrderVO"></a>
<a id="tocSordervo"></a>
<a id="tocsordervo"></a>

```json
{
  "id": 0,
  "orderNo": "string",
  "orderType": 1,
  "planCode": "string",
  "planName": "string",
  "planPrice": 0,
  "durationDays": 0,
  "payChannel": "alipay",
  "originalAmount": 0,
  "amount": 0,
  "orderState": 0,
  "payTime": "2019-08-24T14:15:22Z",
  "payForm": "string",
  "refundAmount": 0,
  "refundTime": "2019-08-24T14:15:22Z",
  "refundReason": "string",
  "gmtCreate": "2019-08-24T14:15:22Z"
}

```

订单信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||订单ID|
|orderNo|string|false|none||订单号|
|orderType|integer(int32)|false|none||订单类型|
|planCode|string|false|none||套餐编码|
|planName|string|false|none||套餐名称|
|planPrice|number|false|none||套餐年费（元）|
|durationDays|integer(int32)|false|none||有效期（天）|
|payChannel|string|false|none||支付渠道|
|originalAmount|number|false|none||应付金额（元）|
|amount|number|false|none||实付金额（元）|
|orderState|integer(int32)|false|none||订单状态|
|payTime|string(date-time)|false|none||支付时间|
|payForm|string|false|none||支付表单（电脑网站支付，下单后返回）|
|refundAmount|number|false|none||已退款金额（元）|
|refundTime|string(date-time)|false|none||退款时间|
|refundReason|string|false|none||退款原因|
|gmtCreate|string(date-time)|false|none||创建时间|

#### 枚举值

|属性|值|
|---|---|
|orderType|1|
|orderType|2|
|orderType|3|
|orderType|4|
|payChannel|alipay|
|orderState|0|
|orderState|1|
|orderState|2|
|orderState|3|
|orderState|4|
|orderState|5|
|orderState|6|
|orderState|7|

<h2 id="tocS_ResultOrderVO">ResultOrderVO</h2>

<a id="schemaresultordervo"></a>
<a id="schema_ResultOrderVO"></a>
<a id="tocSresultordervo"></a>
<a id="tocsresultordervo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "orderNo": "string",
    "orderType": 1,
    "planCode": "string",
    "planName": "string",
    "planPrice": 0,
    "durationDays": 0,
    "payChannel": "alipay",
    "originalAmount": 0,
    "amount": 0,
    "orderState": 0,
    "payTime": "2019-08-24T14:15:22Z",
    "payForm": "string",
    "refundAmount": 0,
    "refundTime": "2019-08-24T14:15:22Z",
    "refundReason": "string",
    "gmtCreate": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[OrderVO](#schemaordervo)|false|none||订单信息|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListOrderVO">ResultListOrderVO</h2>

<a id="schemaresultlistordervo"></a>
<a id="schema_ResultListOrderVO"></a>
<a id="tocSresultlistordervo"></a>
<a id="tocsresultlistordervo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "orderNo": "string",
      "orderType": 1,
      "planCode": "string",
      "planName": "string",
      "planPrice": 0,
      "durationDays": 0,
      "payChannel": "alipay",
      "originalAmount": 0,
      "amount": 0,
      "orderState": 0,
      "payTime": "2019-08-24T14:15:22Z",
      "payForm": "string",
      "refundAmount": 0,
      "refundTime": "2019-08-24T14:15:22Z",
      "refundReason": "string",
      "gmtCreate": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[OrderVO](#schemaordervo)]|false|none||[订单信息]|
|traceId|string|false|none||none|

<h2 id="tocS_OrderDetailVO">OrderDetailVO</h2>

<a id="schemaorderdetailvo"></a>
<a id="schema_OrderDetailVO"></a>
<a id="tocSorderdetailvo"></a>
<a id="tocsorderdetailvo"></a>

```json
{
  "order": {
    "id": 0,
    "orderNo": "string",
    "orderType": 1,
    "planCode": "string",
    "planName": "string",
    "planPrice": 0,
    "durationDays": 0,
    "payChannel": "alipay",
    "originalAmount": 0,
    "amount": 0,
    "orderState": 0,
    "payTime": "2019-08-24T14:15:22Z",
    "payForm": "string",
    "refundAmount": 0,
    "refundTime": "2019-08-24T14:15:22Z",
    "refundReason": "string",
    "gmtCreate": "2019-08-24T14:15:22Z"
  },
  "payRecords": [
    {
      "id": 0,
      "orderNo": "string",
      "payChannel": "alipay",
      "tradeNo": "string",
      "amount": 0,
      "payState": 0,
      "notifyTime": "2019-08-24T14:15:22Z",
      "gmtCreate": "2019-08-24T14:15:22Z"
    }
  ],
  "logs": [
    {
      "id": 0,
      "bizType": 0,
      "bizNo": "string",
      "tenantId": 0,
      "action": "string",
      "operatorType": 0,
      "operatorId": 0,
      "detail": "string",
      "isDelete": 0,
      "gmtCreate": "2019-08-24T14:15:22Z",
      "gmtModified": "2019-08-24T14:15:22Z"
    }
  ]
}

```

订单详情

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|order|[OrderVO](#schemaordervo)|false|none||订单信息|
|payRecords|[[PayRecordVO](#schemapayrecordvo)]|false|none||支付流水列表|
|logs|[[BillingOperationLog](#schemabillingoperationlog)]|false|none||操作日志列表|

<h2 id="tocS_PayRecordVO">PayRecordVO</h2>

<a id="schemapayrecordvo"></a>
<a id="schema_PayRecordVO"></a>
<a id="tocSpayrecordvo"></a>
<a id="tocspayrecordvo"></a>

```json
{
  "id": 0,
  "orderNo": "string",
  "payChannel": "alipay",
  "tradeNo": "string",
  "amount": 0,
  "payState": 0,
  "notifyTime": "2019-08-24T14:15:22Z",
  "gmtCreate": "2019-08-24T14:15:22Z"
}

```

支付流水信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||流水ID|
|orderNo|string|false|none||订单号|
|payChannel|string|false|none||支付渠道|
|tradeNo|string|false|none||第三方交易号|
|amount|number|false|none||交易金额（元）|
|payState|integer(int32)|false|none||流水状态|
|notifyTime|string(date-time)|false|none||回调时间|
|gmtCreate|string(date-time)|false|none||创建时间|

#### 枚举值

|属性|值|
|---|---|
|payChannel|alipay|
|payState|0|
|payState|1|
|payState|2|
|payState|3|

<h2 id="tocS_ResultOrderDetailVO">ResultOrderDetailVO</h2>

<a id="schemaresultorderdetailvo"></a>
<a id="schema_ResultOrderDetailVO"></a>
<a id="tocSresultorderdetailvo"></a>
<a id="tocsresultorderdetailvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "order": {
      "id": 0,
      "orderNo": "string",
      "orderType": 1,
      "planCode": "string",
      "planName": "string",
      "planPrice": 0,
      "durationDays": 0,
      "payChannel": "alipay",
      "originalAmount": 0,
      "amount": 0,
      "orderState": 0,
      "payTime": "2019-08-24T14:15:22Z",
      "payForm": "string",
      "refundAmount": 0,
      "refundTime": "2019-08-24T14:15:22Z",
      "refundReason": "string",
      "gmtCreate": "2019-08-24T14:15:22Z"
    },
    "payRecords": [
      {
        "id": 0,
        "orderNo": "string",
        "payChannel": "alipay",
        "tradeNo": "string",
        "amount": 0,
        "payState": 0,
        "notifyTime": "2019-08-24T14:15:22Z",
        "gmtCreate": "2019-08-24T14:15:22Z"
      }
    ],
    "logs": [
      {
        "id": 0,
        "bizType": 0,
        "bizNo": "string",
        "tenantId": 0,
        "action": "string",
        "operatorType": 0,
        "operatorId": 0,
        "detail": "string",
        "isDelete": 0,
        "gmtCreate": "2019-08-24T14:15:22Z",
        "gmtModified": "2019-08-24T14:15:22Z"
      }
    ]
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[OrderDetailVO](#schemaorderdetailvo)|false|none||订单详情|
|traceId|string|false|none||none|

<h2 id="tocS_BuildProgressVO">BuildProgressVO</h2>

<a id="schemabuildprogressvo"></a>
<a id="schema_BuildProgressVO"></a>
<a id="tocSbuildprogressvo"></a>
<a id="tocsbuildprogressvo"></a>

```json
{
  "stage": 1,
  "stageState": 0,
  "remark": "string"
}

```

建站环节进度信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|stage|integer(int32)|false|none||建站环节|
|stageState|integer(int32)|false|none||环节状态|
|remark|string|false|none||备注|

#### 枚举值

|属性|值|
|---|---|
|stage|1|
|stage|2|
|stage|3|
|stage|4|
|stageState|0|
|stageState|1|
|stageState|2|

<h2 id="tocS_ResultSiteStatusVO">ResultSiteStatusVO</h2>

<a id="schemaresultsitestatusvo"></a>
<a id="schema_ResultSiteStatusVO"></a>
<a id="tocSresultsitestatusvo"></a>
<a id="tocsresultsitestatusvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "siteId": 0,
    "siteName": "string",
    "siteState": 0,
    "publishAt": "2019-08-24T14:15:22Z",
    "buildProgress": [
      {
        "stage": 1,
        "stageState": 0,
        "remark": "string"
      }
    ]
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[SiteStatusVO](#schemasitestatusvo)|false|none||站点状态信息|
|traceId|string|false|none||none|

<h2 id="tocS_SiteStatusVO">SiteStatusVO</h2>

<a id="schemasitestatusvo"></a>
<a id="schema_SiteStatusVO"></a>
<a id="tocSsitestatusvo"></a>
<a id="tocssitestatusvo"></a>

```json
{
  "siteId": 0,
  "siteName": "string",
  "siteState": 0,
  "publishAt": "2019-08-24T14:15:22Z",
  "buildProgress": [
    {
      "stage": 1,
      "stageState": 0,
      "remark": "string"
    }
  ]
}

```

站点状态信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|siteId|integer(int64)|false|none||站点ID|
|siteName|string|false|none||站点名称|
|siteState|integer(int32)|false|none||站点生命周期状态|
|publishAt|string(date-time)|false|none||发布时间|
|buildProgress|[[BuildProgressVO](#schemabuildprogressvo)]|false|none||建站环节进度|

#### 枚举值

|属性|值|
|---|---|
|siteState|0|
|siteState|1|
|siteState|2|
|siteState|3|
|siteState|4|
|siteState|5|

<h2 id="tocS_ResultSubscriptionVO">ResultSubscriptionVO</h2>

<a id="schemaresultsubscriptionvo"></a>
<a id="schema_ResultSubscriptionVO"></a>
<a id="tocSresultsubscriptionvo"></a>
<a id="tocsresultsubscriptionvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "planId": 0,
    "changeType": 1,
    "subscriptionState": 0,
    "startAt": "2019-08-24T14:15:22Z",
    "expiredAt": "2019-08-24T14:15:22Z",
    "daysLeft": 0,
    "maxRefundable": 0,
    "planSnapshot": "string",
    "gmtCreate": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[SubscriptionVO](#schemasubscriptionvo)|false|none||订阅信息|
|traceId|string|false|none||none|

<h2 id="tocS_SubscriptionVO">SubscriptionVO</h2>

<a id="schemasubscriptionvo"></a>
<a id="schema_SubscriptionVO"></a>
<a id="tocSsubscriptionvo"></a>
<a id="tocssubscriptionvo"></a>

```json
{
  "id": 0,
  "planId": 0,
  "changeType": 1,
  "subscriptionState": 0,
  "startAt": "2019-08-24T14:15:22Z",
  "expiredAt": "2019-08-24T14:15:22Z",
  "daysLeft": 0,
  "maxRefundable": 0,
  "planSnapshot": "string",
  "gmtCreate": "2019-08-24T14:15:22Z"
}

```

订阅信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||订阅ID|
|planId|integer(int64)|false|none||套餐ID|
|changeType|integer(int32)|false|none||获得方式|
|subscriptionState|integer(int32)|false|none||订阅状态|
|startAt|string(date-time)|false|none||开始时间|
|expiredAt|string(date-time)|false|none||到期时间|
|daysLeft|integer(int64)|false|none||剩余天数（null 表示永久有效）|
|maxRefundable|number|false|none||当前订阅剩余可退金额上限（元，全额退款时即为应退总额）|
|planSnapshot|string|false|none||套餐快照 JSON（含 features）|
|gmtCreate|string(date-time)|false|none||创建时间|

#### 枚举值

|属性|值|
|---|---|
|changeType|1|
|changeType|2|
|changeType|3|
|changeType|4|
|changeType|5|
|subscriptionState|0|
|subscriptionState|1|
|subscriptionState|2|
|subscriptionState|3|
|subscriptionState|4|

<h2 id="tocS_ResultListSubscriptionVO">ResultListSubscriptionVO</h2>

<a id="schemaresultlistsubscriptionvo"></a>
<a id="schema_ResultListSubscriptionVO"></a>
<a id="tocSresultlistsubscriptionvo"></a>
<a id="tocsresultlistsubscriptionvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "planId": 0,
      "changeType": 1,
      "subscriptionState": 0,
      "startAt": "2019-08-24T14:15:22Z",
      "expiredAt": "2019-08-24T14:15:22Z",
      "daysLeft": 0,
      "maxRefundable": 0,
      "planSnapshot": "string",
      "gmtCreate": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[SubscriptionVO](#schemasubscriptionvo)]|false|none||[订阅信息]|
|traceId|string|false|none||none|

<h2 id="tocS_VerificationSubmitRequest">VerificationSubmitRequest</h2>

<a id="schemaverificationsubmitrequest"></a>
<a id="schema_VerificationSubmitRequest"></a>
<a id="tocSverificationsubmitrequest"></a>
<a id="tocsverificationsubmitrequest"></a>

```json
{
  "verifyType": 1,
  "legalName": "杭州某某科技有限公司",
  "creditCode": "91330100MA27XXXXX",
  "legalPerson": "张三",
  "businessLicense": "string",
  "idCardNo": "330102199001011234",
  "idCardFront": "string",
  "idCardBack": "string"
}

```

提交实名认证请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|verifyType|integer(int32)|true|none||认证类型：1-企业 2-个人|
|legalName|string|true|none||企业名称/个人姓名|
|creditCode|string|false|none||统一社会信用代码（企业必填）|
|legalPerson|string|false|none||法定代表人（企业必填）|
|businessLicense|string|false|none||营业执照图片 URL（企业必填）|
|idCardNo|string|false|none||身份证号（个人必填）|
|idCardFront|string|false|none||身份证正面 URL（个人必填）|
|idCardBack|string|false|none||身份证背面 URL（个人必填）|

#### 枚举值

|属性|值|
|---|---|
|verifyType|1|
|verifyType|2|

<h2 id="tocS_ResultVerificationVO">ResultVerificationVO</h2>

<a id="schemaresultverificationvo"></a>
<a id="schema_ResultVerificationVO"></a>
<a id="tocSresultverificationvo"></a>
<a id="tocsresultverificationvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "tenantId": 0,
    "verifyType": 1,
    "legalName": "string",
    "creditCode": "string",
    "legalPerson": "string",
    "businessLicense": "string",
    "idCardNo": "string",
    "idCardFront": "string",
    "idCardBack": "string",
    "verifyState": 0,
    "rejectReason": "string",
    "verifiedAt": "2019-08-24T14:15:22Z",
    "verifiedExpireAt": "2019-08-24T14:15:22Z",
    "gmtCreate": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[VerificationVO](#schemaverificationvo)|false|none||实名认证信息|
|traceId|string|false|none||none|

<h2 id="tocS_VerificationVO">VerificationVO</h2>

<a id="schemaverificationvo"></a>
<a id="schema_VerificationVO"></a>
<a id="tocSverificationvo"></a>
<a id="tocsverificationvo"></a>

```json
{
  "id": 0,
  "tenantId": 0,
  "verifyType": 1,
  "legalName": "string",
  "creditCode": "string",
  "legalPerson": "string",
  "businessLicense": "string",
  "idCardNo": "string",
  "idCardFront": "string",
  "idCardBack": "string",
  "verifyState": 0,
  "rejectReason": "string",
  "verifiedAt": "2019-08-24T14:15:22Z",
  "verifiedExpireAt": "2019-08-24T14:15:22Z",
  "gmtCreate": "2019-08-24T14:15:22Z"
}

```

实名认证信息

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||认证记录ID|
|tenantId|integer(int64)|false|none||租户ID|
|verifyType|integer(int32)|false|none||认证类型|
|legalName|string|false|none||企业名称/个人姓名|
|creditCode|string|false|none||统一社会信用代码（企业）|
|legalPerson|string|false|none||法定代表人（企业）|
|businessLicense|string|false|none||营业执照图片 URL（企业）|
|idCardNo|string|false|none||身份证号（个人，已脱敏）|
|idCardFront|string|false|none||身份证正面 URL（个人）|
|idCardBack|string|false|none||身份证背面 URL（个人）|
|verifyState|integer(int32)|false|none||审核状态|
|rejectReason|string|false|none||驳回原因|
|verifiedAt|string(date-time)|false|none||审核通过时间|
|verifiedExpireAt|string(date-time)|false|none||认证有效期至|
|gmtCreate|string(date-time)|false|none||创建时间|

#### 枚举值

|属性|值|
|---|---|
|verifyType|1|
|verifyType|2|
|verifyState|0|
|verifyState|1|
|verifyState|2|

<h2 id="tocS_DowngradeRequest">DowngradeRequest</h2>

<a id="schemadowngraderequest"></a>
<a id="schema_DowngradeRequest"></a>
<a id="tocSdowngraderequest"></a>
<a id="tocsdowngraderequest"></a>

```json
{
  "planCode": "basic"
}

```

降配请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|planCode|string|true|none||目标套餐编码|

<h2 id="tocS_VerificationRejectRequest">VerificationRejectRequest</h2>

<a id="schemaverificationrejectrequest"></a>
<a id="schema_VerificationRejectRequest"></a>
<a id="tocSverificationrejectrequest"></a>
<a id="tocsverificationrejectrequest"></a>

```json
{
  "rejectReason": "营业执照信息不清晰，请重新上传"
}

```

实名认证驳回请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|rejectReason|string|true|none||驳回原因|

<h2 id="tocS_SiteNotifyRequest">SiteNotifyRequest</h2>

<a id="schemasitenotifyrequest"></a>
<a id="schema_SiteNotifyRequest"></a>
<a id="tocSsitenotifyrequest"></a>
<a id="tocssitenotifyrequest"></a>

```json
{
  "title": "站点到期提醒",
  "content": "string"
}

```

平台端向租户推送站内信请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|title|string|true|none||通知标题|
|content|string|true|none||通知内容|

<h2 id="tocS_SubscriptionUpdateRequest">SubscriptionUpdateRequest</h2>

<a id="schemasubscriptionupdaterequest"></a>
<a id="schema_SubscriptionUpdateRequest"></a>
<a id="tocSsubscriptionupdaterequest"></a>
<a id="tocssubscriptionupdaterequest"></a>

```json
{
  "planId": 0,
  "expiredAt": "2019-08-24T14:15:22Z",
  "subscriptionState": 0
}

```

管理端手动调整订阅请求

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|planId|integer(int64)|false|none||目标套餐ID（更换套餐时传）|
|expiredAt|string(date-time)|false|none||调整后的到期时间|
|subscriptionState|integer(int32)|false|none||调整后的订阅状态|

#### 枚举值

|属性|值|
|---|---|
|subscriptionState|0|
|subscriptionState|1|
|subscriptionState|2|
|subscriptionState|3|
|subscriptionState|4|

<h2 id="tocS_ResultTenantSubscription">ResultTenantSubscription</h2>

<a id="schemaresulttenantsubscription"></a>
<a id="schema_ResultTenantSubscription"></a>
<a id="tocSresulttenantsubscription"></a>
<a id="tocsresulttenantsubscription"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "tenantId": 0,
    "planId": 0,
    "planSnapshot": "string",
    "orderId": 0,
    "changeType": 1,
    "startAt": "2019-08-24T14:15:22Z",
    "trialEndAt": "2019-08-24T14:15:22Z",
    "expiredAt": "2019-08-24T14:15:22Z",
    "subscriptionState": 0,
    "lastRemindAt": "2019-08-24T14:15:22Z",
    "nextPlanId": 0,
    "nextPlanCode": "string",
    "remark": "string",
    "isDelete": 0,
    "gmtCreate": "2019-08-24T14:15:22Z",
    "gmtModified": "2019-08-24T14:15:22Z"
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[TenantSubscription](#schematenantsubscription)|false|none||租户订阅|
|traceId|string|false|none||none|

<h2 id="tocS_TenantSubscription">TenantSubscription</h2>

<a id="schematenantsubscription"></a>
<a id="schema_TenantSubscription"></a>
<a id="tocStenantsubscription"></a>
<a id="tocstenantsubscription"></a>

```json
{
  "id": 0,
  "tenantId": 0,
  "planId": 0,
  "planSnapshot": "string",
  "orderId": 0,
  "changeType": 1,
  "startAt": "2019-08-24T14:15:22Z",
  "trialEndAt": "2019-08-24T14:15:22Z",
  "expiredAt": "2019-08-24T14:15:22Z",
  "subscriptionState": 0,
  "lastRemindAt": "2019-08-24T14:15:22Z",
  "nextPlanId": 0,
  "nextPlanCode": "string",
  "remark": "string",
  "isDelete": 0,
  "gmtCreate": "2019-08-24T14:15:22Z",
  "gmtModified": "2019-08-24T14:15:22Z"
}

```

租户订阅

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|tenantId|integer(int64)|false|none||租户ID|
|planId|integer(int64)|false|none||套餐ID|
|planSnapshot|string|false|none||套餐快照（下单时的 planName/price/durationDays/features 等）|
|orderId|integer(int64)|false|none||来源订单ID，0-无|
|changeType|integer(int32)|false|none||获得方式|
|startAt|string(date-time)|false|none||订阅开始时间|
|trialEndAt|string(date-time)|false|none||试用截止时间|
|expiredAt|string(date-time)|false|none||订阅到期时间，NULL表示永久有效|
|subscriptionState|integer(int32)|false|none||订阅状态|
|lastRemindAt|string(date-time)|false|none||最近续费提醒时间（每3天一次）|
|nextPlanId|integer(int64)|false|none||降配下期套餐ID，0-无|
|nextPlanCode|string|false|none||降配下期套餐编码|
|remark|string|false|none||备注|
|isDelete|integer(int32)|false|none||是否删除，0-未删除，1-已删除|
|gmtCreate|string(date-time)|false|none||创建时间|
|gmtModified|string(date-time)|false|none||修改时间|

#### 枚举值

|属性|值|
|---|---|
|changeType|1|
|changeType|2|
|changeType|3|
|changeType|4|
|changeType|5|
|subscriptionState|0|
|subscriptionState|1|
|subscriptionState|2|
|subscriptionState|3|
|subscriptionState|4|

<h2 id="tocS_InAppMessage">InAppMessage</h2>

<a id="schemainappmessage"></a>
<a id="schema_InAppMessage"></a>
<a id="tocSinappmessage"></a>
<a id="tocsinappmessage"></a>

```json
{
  "id": 0,
  "receiverId": 0,
  "title": "string",
  "content": "string",
  "isRead": 0,
  "readAt": "2019-08-24T14:15:22Z",
  "isDelete": 0,
  "gmtCreate": "2019-08-24T14:15:22Z",
  "gmtModified": "2019-08-24T14:15:22Z"
}

```

站内信

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|receiverId|integer(int64)|false|none||接收人用户ID|
|title|string|false|none||标题|
|content|string|false|none||内容|
|isRead|integer(int32)|false|none||是否已读：0-未读 1-已读|
|readAt|string(date-time)|false|none||阅读时间|
|isDelete|integer(int32)|false|none||是否删除，0-未删除，1-已删除|
|gmtCreate|string(date-time)|false|none||创建时间|
|gmtModified|string(date-time)|false|none||修改时间|

<h2 id="tocS_OrderItem">OrderItem</h2>

<a id="schemaorderitem"></a>
<a id="schema_OrderItem"></a>
<a id="tocSorderitem"></a>
<a id="tocsorderitem"></a>

```json
{
  "column": "string",
  "asc": true
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|column|string|false|none||none|
|asc|boolean|false|none||none|

<h2 id="tocS_PageInAppMessage">PageInAppMessage</h2>

<a id="schemapageinappmessage"></a>
<a id="schema_PageInAppMessage"></a>
<a id="tocSpageinappmessage"></a>
<a id="tocspageinappmessage"></a>

```json
{
  "records": [
    {
      "id": 0,
      "receiverId": 0,
      "title": "string",
      "content": "string",
      "isRead": 0,
      "readAt": "2019-08-24T14:15:22Z",
      "isDelete": 0,
      "gmtCreate": "2019-08-24T14:15:22Z",
      "gmtModified": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "orders": [
    {
      "column": "string",
      "asc": true
    }
  ],
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "receiverId": 0,
        "title": "string",
        "content": "string",
        "isRead": 0,
        "readAt": "2019-08-24T14:15:22Z",
        "isDelete": 0,
        "gmtCreate": "2019-08-24T14:15:22Z",
        "gmtModified": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "orders": [
      {
        "column": "string",
        "asc": true
      }
    ],
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "receiverId": 0,
          "title": "string",
          "content": "string",
          "isRead": 0,
          "readAt": "2019-08-24T14:15:22Z",
          "isDelete": 0,
          "gmtCreate": "2019-08-24T14:15:22Z",
          "gmtModified": "2019-08-24T14:15:22Z"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "searchCount": {
      "records": [
        {
          "id": 0,
          "receiverId": 0,
          "title": "string",
          "content": "string",
          "isRead": 0,
          "readAt": "2019-08-24T14:15:22Z",
          "isDelete": 0,
          "gmtCreate": "2019-08-24T14:15:22Z",
          "gmtModified": "2019-08-24T14:15:22Z"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "optimizeJoinOfCountSql": true,
    "maxLimit": 0,
    "countId": "string",
    "pages": 0
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "receiverId": 0,
        "title": "string",
        "content": "string",
        "isRead": 0,
        "readAt": "2019-08-24T14:15:22Z",
        "isDelete": 0,
        "gmtCreate": "2019-08-24T14:15:22Z",
        "gmtModified": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "orders": [
      {
        "column": "string",
        "asc": true
      }
    ],
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "receiverId": 0,
          "title": "string",
          "content": "string",
          "isRead": 0,
          "readAt": "2019-08-24T14:15:22Z",
          "isDelete": 0,
          "gmtCreate": "2019-08-24T14:15:22Z",
          "gmtModified": "2019-08-24T14:15:22Z"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "searchCount": {
      "records": [
        {
          "id": 0,
          "receiverId": 0,
          "title": "string",
          "content": "string",
          "isRead": 0,
          "readAt": "2019-08-24T14:15:22Z",
          "isDelete": 0,
          "gmtCreate": "2019-08-24T14:15:22Z",
          "gmtModified": "2019-08-24T14:15:22Z"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "optimizeJoinOfCountSql": true,
    "maxLimit": 0,
    "countId": "string",
    "pages": 0
  },
  "optimizeJoinOfCountSql": true,
  "maxLimit": 0,
  "countId": "string",
  "pages": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|records|[[InAppMessage](#schemainappmessage)]|false|none||[站内信]|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageInAppMessage](#schemapageinappmessage)|false|none||none|
|searchCount|[PageInAppMessage](#schemapageinappmessage)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_ResultPageInAppMessage">ResultPageInAppMessage</h2>

<a id="schemaresultpageinappmessage"></a>
<a id="schema_ResultPageInAppMessage"></a>
<a id="tocSresultpageinappmessage"></a>
<a id="tocsresultpageinappmessage"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": {
    "records": [
      {
        "id": 0,
        "receiverId": 0,
        "title": "string",
        "content": "string",
        "isRead": 0,
        "readAt": "2019-08-24T14:15:22Z",
        "isDelete": 0,
        "gmtCreate": "2019-08-24T14:15:22Z",
        "gmtModified": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "orders": [
      {
        "column": "string",
        "asc": true
      }
    ],
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "receiverId": 0,
          "title": "string",
          "content": "string",
          "isRead": 0,
          "readAt": "2019-08-24T14:15:22Z",
          "isDelete": 0,
          "gmtCreate": "2019-08-24T14:15:22Z",
          "gmtModified": "2019-08-24T14:15:22Z"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "searchCount": {
      "records": [
        {
          "id": 0,
          "receiverId": 0,
          "title": "string",
          "content": "string",
          "isRead": 0,
          "readAt": "2019-08-24T14:15:22Z",
          "isDelete": 0,
          "gmtCreate": "2019-08-24T14:15:22Z",
          "gmtModified": "2019-08-24T14:15:22Z"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "optimizeJoinOfCountSql": true,
    "maxLimit": 0,
    "countId": "string",
    "pages": 0
  },
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[PageInAppMessage](#schemapageinappmessage)|false|none||none|
|traceId|string|false|none||none|

<h2 id="tocS_ResultLong">ResultLong</h2>

<a id="schemaresultlong"></a>
<a id="schema_ResultLong"></a>
<a id="tocSresultlong"></a>
<a id="tocsresultlong"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": 0,
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|integer(int64)|false|none||none|
|traceId|string|false|none||none|

<h2 id="tocS_BillingOperationLog">BillingOperationLog</h2>

<a id="schemabillingoperationlog"></a>
<a id="schema_BillingOperationLog"></a>
<a id="tocSbillingoperationlog"></a>
<a id="tocsbillingoperationlog"></a>

```json
{
  "id": 0,
  "bizType": 0,
  "bizNo": "string",
  "tenantId": 0,
  "action": "string",
  "operatorType": 0,
  "operatorId": 0,
  "detail": "string",
  "isDelete": 0,
  "gmtCreate": "2019-08-24T14:15:22Z",
  "gmtModified": "2019-08-24T14:15:22Z"
}

```

计费操作日志

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|bizType|integer(int32)|false|none||业务类型：1-订单 2-订阅|
|bizNo|string|false|none||业务标识（订单号或订阅ID）|
|tenantId|integer(int64)|false|none||租户ID，0-平台操作|
|action|string|false|none||操作动作|
|operatorType|integer(int32)|false|none||操作方：1-管理员 2-租户|
|operatorId|integer(int64)|false|none||操作人ID|
|detail|string|false|none||操作详情|
|isDelete|integer(int32)|false|none||是否删除，0-未删除，1-已删除|
|gmtCreate|string(date-time)|false|none||创建时间|
|gmtModified|string(date-time)|false|none||修改时间|

<h2 id="tocS_ResultListVerificationVO">ResultListVerificationVO</h2>

<a id="schemaresultlistverificationvo"></a>
<a id="schema_ResultListVerificationVO"></a>
<a id="tocSresultlistverificationvo"></a>
<a id="tocsresultlistverificationvo"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "tenantId": 0,
      "verifyType": 1,
      "legalName": "string",
      "creditCode": "string",
      "legalPerson": "string",
      "businessLicense": "string",
      "idCardNo": "string",
      "idCardFront": "string",
      "idCardBack": "string",
      "verifyState": 0,
      "rejectReason": "string",
      "verifiedAt": "2019-08-24T14:15:22Z",
      "verifiedExpireAt": "2019-08-24T14:15:22Z",
      "gmtCreate": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[VerificationVO](#schemaverificationvo)]|false|none||[实名认证信息]|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListSite">ResultListSite</h2>

<a id="schemaresultlistsite"></a>
<a id="schema_ResultListSite"></a>
<a id="tocSresultlistsite"></a>
<a id="tocsresultlistsite"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "tenantId": 0,
      "siteName": "string",
      "siteIntro": "string",
      "logo": "string",
      "favicon": "string",
      "siteState": 0,
      "publishAt": "2019-08-24T14:15:22Z",
      "remark": "string",
      "isDelete": 0,
      "gmtCreate": "2019-08-24T14:15:22Z",
      "gmtModified": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[Site](#schemasite)]|false|none||[站点]|
|traceId|string|false|none||none|

<h2 id="tocS_Site">Site</h2>

<a id="schemasite"></a>
<a id="schema_Site"></a>
<a id="tocSsite"></a>
<a id="tocssite"></a>

```json
{
  "id": 0,
  "tenantId": 0,
  "siteName": "string",
  "siteIntro": "string",
  "logo": "string",
  "favicon": "string",
  "siteState": 0,
  "publishAt": "2019-08-24T14:15:22Z",
  "remark": "string",
  "isDelete": 0,
  "gmtCreate": "2019-08-24T14:15:22Z",
  "gmtModified": "2019-08-24T14:15:22Z"
}

```

站点

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|tenantId|integer(int64)|false|none||租户ID，一租户一站点|
|siteName|string|false|none||站点名称|
|siteIntro|string|false|none||站点简介|
|logo|string|false|none||站点 Logo URL|
|favicon|string|false|none||站点 Favicon URL|
|siteState|integer(int32)|false|none||站点状态|
|publishAt|string(date-time)|false|none||发布时间（上线时间）|
|remark|string|false|none||备注|
|isDelete|integer(int32)|false|none||是否删除，0-未删除，1-已删除|
|gmtCreate|string(date-time)|false|none||创建时间|
|gmtModified|string(date-time)|false|none||修改时间|

#### 枚举值

|属性|值|
|---|---|
|siteState|0|
|siteState|1|
|siteState|2|
|siteState|3|
|siteState|4|
|siteState|5|

<h2 id="tocS_ResultListSiteBuildProgress">ResultListSiteBuildProgress</h2>

<a id="schemaresultlistsitebuildprogress"></a>
<a id="schema_ResultListSiteBuildProgress"></a>
<a id="tocSresultlistsitebuildprogress"></a>
<a id="tocsresultlistsitebuildprogress"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "siteId": 0,
      "stage": 1,
      "stageState": 0,
      "remark": "string",
      "isDelete": 0,
      "gmtCreate": "2019-08-24T14:15:22Z",
      "gmtModified": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[SiteBuildProgress](#schemasitebuildprogress)]|false|none||[站点建站进度]|
|traceId|string|false|none||none|

<h2 id="tocS_SiteBuildProgress">SiteBuildProgress</h2>

<a id="schemasitebuildprogress"></a>
<a id="schema_SiteBuildProgress"></a>
<a id="tocSsitebuildprogress"></a>
<a id="tocssitebuildprogress"></a>

```json
{
  "id": 0,
  "siteId": 0,
  "stage": 1,
  "stageState": 0,
  "remark": "string",
  "isDelete": 0,
  "gmtCreate": "2019-08-24T14:15:22Z",
  "gmtModified": "2019-08-24T14:15:22Z"
}

```

站点建站进度

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|siteId|integer(int64)|false|none||站点ID|
|stage|integer(int32)|false|none||建站环节|
|stageState|integer(int32)|false|none||环节状态|
|remark|string|false|none||备注|
|isDelete|integer(int32)|false|none||是否删除，0-未删除，1-已删除|
|gmtCreate|string(date-time)|false|none||创建时间|
|gmtModified|string(date-time)|false|none||修改时间|

#### 枚举值

|属性|值|
|---|---|
|stage|1|
|stage|2|
|stage|3|
|stage|4|
|stageState|0|
|stageState|1|
|stageState|2|

<h2 id="tocS_ResultListTenantSubscription">ResultListTenantSubscription</h2>

<a id="schemaresultlisttenantsubscription"></a>
<a id="schema_ResultListTenantSubscription"></a>
<a id="tocSresultlisttenantsubscription"></a>
<a id="tocsresultlisttenantsubscription"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "tenantId": 0,
      "planId": 0,
      "planSnapshot": "string",
      "orderId": 0,
      "changeType": 1,
      "startAt": "2019-08-24T14:15:22Z",
      "trialEndAt": "2019-08-24T14:15:22Z",
      "expiredAt": "2019-08-24T14:15:22Z",
      "subscriptionState": 0,
      "lastRemindAt": "2019-08-24T14:15:22Z",
      "nextPlanId": 0,
      "nextPlanCode": "string",
      "remark": "string",
      "isDelete": 0,
      "gmtCreate": "2019-08-24T14:15:22Z",
      "gmtModified": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[TenantSubscription](#schematenantsubscription)]|false|none||[租户订阅]|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListBillingOperationLog">ResultListBillingOperationLog</h2>

<a id="schemaresultlistbillingoperationlog"></a>
<a id="schema_ResultListBillingOperationLog"></a>
<a id="tocSresultlistbillingoperationlog"></a>
<a id="tocsresultlistbillingoperationlog"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "bizType": 0,
      "bizNo": "string",
      "tenantId": 0,
      "action": "string",
      "operatorType": 0,
      "operatorId": 0,
      "detail": "string",
      "isDelete": 0,
      "gmtCreate": "2019-08-24T14:15:22Z",
      "gmtModified": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[BillingOperationLog](#schemabillingoperationlog)]|false|none||[计费操作日志]|
|traceId|string|false|none||none|

<h2 id="tocS_ResultListSubscriptionChangeLog">ResultListSubscriptionChangeLog</h2>

<a id="schemaresultlistsubscriptionchangelog"></a>
<a id="schema_ResultListSubscriptionChangeLog"></a>
<a id="tocSresultlistsubscriptionchangelog"></a>
<a id="tocsresultlistsubscriptionchangelog"></a>

```json
{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "subscriptionId": 0,
      "orderId": 0,
      "tenantId": 0,
      "changeType": 0,
      "fromPlanCode": "string",
      "toPlanCode": "string",
      "operatorType": 0,
      "operatorId": 0,
      "remark": "string",
      "isDelete": 0,
      "gmtCreate": "2019-08-24T14:15:22Z",
      "gmtModified": "2019-08-24T14:15:22Z"
    }
  ],
  "traceId": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|false|none||none|
|msg|string|false|none||none|
|data|[[SubscriptionChangeLog](#schemasubscriptionchangelog)]|false|none||[订阅变更日志]|
|traceId|string|false|none||none|

<h2 id="tocS_SubscriptionChangeLog">SubscriptionChangeLog</h2>

<a id="schemasubscriptionchangelog"></a>
<a id="schema_SubscriptionChangeLog"></a>
<a id="tocSsubscriptionchangelog"></a>
<a id="tocssubscriptionchangelog"></a>

```json
{
  "id": 0,
  "subscriptionId": 0,
  "orderId": 0,
  "tenantId": 0,
  "changeType": 0,
  "fromPlanCode": "string",
  "toPlanCode": "string",
  "operatorType": 0,
  "operatorId": 0,
  "remark": "string",
  "isDelete": 0,
  "gmtCreate": "2019-08-24T14:15:22Z",
  "gmtModified": "2019-08-24T14:15:22Z"
}

```

订阅变更日志

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|subscriptionId|integer(int64)|false|none||订阅档案ID|
|orderId|integer(int64)|false|none||来源订单ID，0-无|
|tenantId|integer(int64)|false|none||租户ID|
|changeType|integer(int32)|false|none||变更类型：1-购买 2-续费 3-升配 4-降配 5-退款 6-人工调整|
|fromPlanCode|string|false|none||变更前套餐编码|
|toPlanCode|string|false|none||变更后套餐编码|
|operatorType|integer(int32)|false|none||操作方：1-租户 2-管理员|
|operatorId|integer(int64)|false|none||操作人ID|
|remark|string|false|none||变更说明/原因|
|isDelete|integer(int32)|false|none||是否删除，0-未删除，1-已删除|
|gmtCreate|string(date-time)|false|none||创建时间|
|gmtModified|string(date-time)|false|none||修改时间|

