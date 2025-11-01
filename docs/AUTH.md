# 統一認證系統使用指南

本專案提供了統一的認證系統，包含 hooks、組件和工具函數。

## 核心文件

**伺服器端保護：**
- `src/middleware.ts` - Next.js Middleware（路由保護）
- `src/config/routes.ts` - 路由配置（受保護/公開路由）

**客戶端認證：**
- `src/hooks/use-auth.ts` - 認證相關的 hooks
- `src/components/protected-route.tsx` - 受保護路由組件
- `src/components/auth-form.tsx` - 共用登入/註冊表單
- `src/components/auth-modal.tsx` - 登入彈窗
- `src/store/auth.ts` - 認證狀態管理（Zustand）

---

## 0. Middleware 路由保護（推薦）

**Next.js Middleware** 在伺服器端自動保護路由，是最佳實踐。

### 配置受保護路由

在 `src/config/routes.ts` 中設定：

```typescript
export const protectedRoutes = [
  '/upload',
  '/dashboard',
  '/settings',  // 添加新的受保護路由
];
```

### 工作原理

```
使用者訪問 /upload
    ↓
Middleware 檢查 cookie 中的 auth_token
    ↓
沒有 token → 重定向到 /auth?returnUrl=/upload
有 token   → 繼續訪問頁面
```

### 優點

✅ **自動保護** - 無需在每個頁面加代碼
✅ **伺服器端** - 在頁面渲染前就保護
✅ **快速** - 直接重定向，不載入頁面
✅ **集中管理** - 統一配置所有路由規則

### Token 存儲

Token 同時存在兩個地方：

| 存儲位置 | 用途 | 訪問方式 |
|---------|------|----------|
| **Cookie** | Middleware 路由保護 | 伺服器端自動讀取 |
| **localStorage** | 客戶端 API 請求 | `getAuthToken()` |

```typescript
// setAuthToken() 會同時設置兩者
setAuthToken(token);  // → localStorage + Cookie

// clearAuthToken() 會同時清除兩者
clearAuthToken();     // → 清除 localStorage + Cookie
```

### 添加新路由

只需在 `src/config/routes.ts` 添加路徑：

```typescript
export const protectedRoutes = [
  '/upload',
  '/dashboard',
  '/profile',      // ← 新增
  '/settings',     // ← 新增
];
```

不需要修改任何其他代碼！

---

## 1. 使用 `useAuth` Hook

完整的認證 hook，會驗證 token 的有效性。

### 基本用法

```tsx
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { isAuthenticated, isLoading, user, logout } = useAuth({
    required: true,
    redirectToPage: true,
  });

  if (isLoading) return <div>載入中...</div>;
  if (!isAuthenticated) return null;

  return (
    <div>
      <p>歡迎 {user?.email}</p>
      <button onClick={logout}>登出</button>
    </div>
  );
}
```

### 選項

- `required`: boolean - 是否需要登入（預設: false）
- `redirectToPage`: boolean - 未登入時是否導向登入頁面（預設: false）
- `onUnauthorized`: () => void - 未授權時的自訂回調

---

## 2. 使用 `useAuthToken` Hook

簡化版本，只檢查 token 是否存在（不驗證有效性），適合快速檢查登入狀態。

### 基本用法

```tsx
import { useAuthToken } from '@/hooks/use-auth';

function AppNav() {
  const { hasToken, logout, refreshToken } = useAuthToken();

  return (
    <nav>
      {hasToken ? (
        <button onClick={logout}>登出</button>
      ) : (
        <button onClick={openLoginModal}>登入</button>
      )}
    </nav>
  );
}
```

---

## 3. 使用 `ProtectedRoute` 組件

保護整個頁面，未登入時自動處理。

### 基本用法

```tsx
import ProtectedRoute from '@/components/protected-route';

export default function UploadPage() {
  return (
    <ProtectedRoute redirectToPage={true}>
      <UploadPageContent />
    </ProtectedRoute>
  );
}
```

### Props

- `redirectToPage`: boolean - true 導向登入頁面，false 顯示提示
- `fallback`: ReactNode - 載入中顯示的內容

---

## 4. 工具函數

### 獲取 Token

```tsx
import { getAuthToken } from '@/hooks/use-auth';

const token = getAuthToken();
if (token) {
  // 發送 API 請求
  axios.get('/api/data', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

### 設置 Token

```tsx
import { setAuthToken } from '@/hooks/use-auth';

// 登入成功後
setAuthToken(response.data.access_token);
```

### 清除 Token

```tsx
import { clearAuthToken } from '@/hooks/use-auth';

// 登出時
clearAuthToken();
```

---

## 5. 使用場景

### 場景 1：保護整個頁面（Upload）

需要完整授權的頁面，未登入時導向登入頁面。

```tsx
// src/app/(app)/upload/page.tsx
import ProtectedRoute from '@/components/protected-route';

function UploadPageContent() {
  // 頁面內容
}

export default function UploadPage() {
  return (
    <ProtectedRoute redirectToPage={true}>
      <UploadPageContent />
    </ProtectedRoute>
  );
}
```

### 場景 2：導航列登入狀態（AppNav）

顯示登入/登出按鈕。

```tsx
// src/components/app-nav.tsx
import { useAuthToken } from '@/hooks/use-auth';

export default function AppNav() {
  const { hasToken, logout } = useAuthToken();

  return (
    <nav>
      {hasToken ? (
        <button onClick={logout}>登出</button>
      ) : (
        <button onClick={openLoginModal}>登入</button>
      )}
    </nav>
  );
}
```

### 場景 3：API 請求攜帶 Token

```tsx
import { getAuthToken } from '@/hooks/use-auth';
import axios from 'axios';

async function uploadFile(file: File) {
  const token = getAuthToken();

  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
```

### 場景 4：處理 401 錯誤

```tsx
import { clearAuthToken } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

async function fetchData() {
  try {
    const response = await axios.get('/api/data');
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      // Token 無效或過期
      clearAuthToken();
      router.push('/auth?returnUrl=' + pathname);
    }
  }
}
```

---

## 6. 認證流程

### 登入流程

1. 使用者填寫登入表單（`AuthForm`）
2. 呼叫後端 API `/auth/login`
3. 獲取 `access_token`
4. 使用 `setAuthToken()` 儲存 token
5. 導向 `returnUrl` 或預設頁面

### 驗證流程

1. `useAuth` hook 從 localStorage 獲取 token
2. 呼叫後端 API `/auth/me` 驗證 token
3. 如果有效，設置 `isAuthenticated = true`
4. 如果無效，清除 token 並處理未授權狀態

### 登出流程

1. 使用者點擊登出按鈕
2. 呼叫 `logout()` 或 `clearAuthToken()`
3. 清除 localStorage 中的 token
4. 更新 UI 狀態
5. 導向首頁

---

## 7. 最佳實踐

✅ **使用 `ProtectedRoute` 保護整頁**

```tsx
<ProtectedRoute redirectToPage={true}>
  <YourPageContent />
</ProtectedRoute>
```

✅ **使用 `getAuthToken()` 獲取 token**

```tsx
const token = getAuthToken();
```

✅ **統一處理 401 錯誤**

```tsx
if (err.response?.status === 401) {
  clearAuthToken();
  router.push('/auth?returnUrl=' + pathname);
}
```

✅ **登入成功後刷新狀態**

```tsx
const { refreshToken } = useAuthToken();
// 登入成功後
refreshToken();
```

❌ **避免直接使用 localStorage**

```tsx
// ❌ 不好
localStorage.getItem('jwt');
localStorage.setItem('jwt', token);

// ✅ 好
import { getAuthToken, setAuthToken } from '@/hooks/use-auth';
getAuthToken();
setAuthToken(token);
```

---

## 8. 雙重保護機制

本專案採用**雙重保護**：

### 第一層：Middleware（伺服器端）

```typescript
// src/middleware.ts
// 自動執行，無需額外代碼
```

- ✅ 在頁面渲染前檢查
- ✅ 快速重定向
- ✅ 防止未授權訪問

### 第二層：ProtectedRoute（客戶端）

```tsx
// src/app/(app)/upload/page.tsx
<ProtectedRoute redirectToPage={true}>
  <UploadPageContent />
</ProtectedRoute>
```

- ✅ 驗證 token 有效性
- ✅ 顯示載入狀態
- ✅ 額外的安全保障

### 推薦使用

**只使用 Middleware（推薦）：**
- 簡單快速
- 適合大部分場景
- 只需配置 `routes.ts`

**Middleware + ProtectedRoute：**
- 需要驗證 token 有效性
- 需要顯示載入畫面
- 額外的安全保障

---

## 9. 注意事項

### Token 管理

- ✅ 使用 `setAuthToken()` 同時設置 localStorage 和 Cookie
- ✅ 使用 `clearAuthToken()` 同時清除兩者
- ❌ 不要直接操作 `localStorage.setItem('jwt', ...)`
- ❌ 不要直接操作 `document.cookie = ...`

### Middleware

- Middleware 只檢查 token 是否存在，不驗證有效性
- Token 驗證由客戶端 `useAuth` hook 處理
- 需要後端提供 `/auth/me` API（可選）

### 安全性

- **生產環境必須使用 HTTPS**
- Cookie 設置了 `SameSite=Strict` 防止 CSRF
- 建議在生產環境添加 `Secure` 標記

### 路由配置

- 在 `src/config/routes.ts` 集中管理
- `protectedRoutes` - 需要登入的路由
- `authRoutes` - 登入相關路由（已登入時跳過）
- `DEFAULT_REDIRECT` - 預設登入後導向

---

## 10. 常見問題

### Q: Middleware 和 ProtectedRoute 有什麼區別？

**Middleware（伺服器端）：**
- 在請求到達頁面前執行
- 可以讀取 Cookie
- 無法訪問 localStorage
- 快速重定向

**ProtectedRoute（客戶端）：**
- 在頁面載入後執行
- 可以訪問 localStorage
- 可以呼叫 API 驗證 token
- 顯示載入狀態

### Q: 為什麼 Token 要存兩個地方？

- **Cookie** - 給 Middleware 用（伺服器端）
- **localStorage** - 給 API 請求用（客戶端）

### Q: 如何添加新的受保護路由？

只需在 `src/config/routes.ts` 添加：

```typescript
export const protectedRoutes = [
  '/upload',
  '/new-route',  // ← 添加這裡
];
```

### Q: Token 過期了會怎樣？

1. Middleware 看到 Cookie 有 token（可能已過期）
2. 允許訪問頁面
3. 客戶端 `useAuth` 驗證 token 失效
4. 自動清除 token 並重定向

### Q: 如何測試 Middleware？

```bash
# 1. 登入後查看 DevTools > Application > Cookies
# 2. 應該看到 auth_token
# 3. 訪問 /upload（應該可以訪問）
# 4. 刪除 auth_token cookie
# 5. 重新訪問 /upload（應該被重定向到 /auth）
```
