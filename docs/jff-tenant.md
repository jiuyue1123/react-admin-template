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

- HTTP Authentication, scheme: bearer

# 租户端 - 认证

<a id="opIdsendCode"></a>

## POST 发送验证码

POST /tenant/auth/send-code

> Body 请求参数

```json
{
    "phone": "13104210443",
    "scene": "TENANT_REGISTER"
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
    "phone": "13104210443",
    "password": "abc123456",
    "code": "172243"
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
    "refreshToken": "{{refreshToken}}"
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

<a id="opIdlogout"></a>

## POST 租户登出

POST /tenant/auth/logout

> Body 请求参数

```json
{
    "refreshToken": "{{refreshToken}}"
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
    "phone": "13104210443",
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

<a id="opIdresetPassword"></a>

## POST 手机号+验证码重置密码

POST /tenant/auth/password/reset

> Body 请求参数

```json
{
    "phone": "13104210443",
    "code": "243896",
    "newPassword": "admin123",
    "refreshToken": "{{refreshToken}}"
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

<a id="opIdchangePhone"></a>

## POST 换绑手机号

POST /tenant/auth/phone/change

> Body 请求参数

```json
{
    "newPhone": "15642571887",
    "oldPhoneCode": "027935",
    "newPhoneCode": "019931"
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
    "remark": "laborum Ut dolor",
    "nickname": "张三",
    "email": "zhangsan@example.com",
    "avatar": "https://example.com/avatar.png",
    "gender": 2
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

# 租户端 - 在线客服

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
{"code":"string","msg":"string","data":[{"docKey":"string","docType":1,"category":"string","title":"string","content":"string","isPinned":0,"publishAt":"2019-08-24T14:15:22Z","version":0}],"traceId":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ResultListContentDocumentPublishedVO](#schemaresultlistcontentdocumentpublishedvo)|

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

# 数据模型

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

