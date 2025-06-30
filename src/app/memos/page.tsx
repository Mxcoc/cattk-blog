// [最终重构设计版本]
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// 定义清晰的数据结构
interface Memo {
  id: number;
  content: string;
  creatorName: string;
  createdAt: string; 
}

/**
 * 健壮的 Memos 数据获取函数
 * @param page - 需要获取的页码
 * @returns 返回一个备忘录数组 Promise，失败时返回空数组
 */
async function getMemos(page: number): Promise<Memo[]> {
  // 1. 在函数开头集中读取和校验环境变量
  const apiUrl = process.env.MEMOS_API_URL;
  const accessToken = process.env.MEMOS_ACCESS_TOKEN;
  
  // 如果关键环境变量缺失，立即抛出错误，这会在Vercel构建或运行时清晰地报错
  if (!apiUrl || !accessToken) {
    console.error('[Configuration Error] MEMOS_API_URL or MEMOS_ACCESS_TOKEN is not set in the production environment.');
    throw new Error('Server configuration is incomplete.');
  }

  // 2. 准备请求参数和构建URL
  const limit = 10;
  const offset = (page - 1) * limit;
  // 使用正确的复数形式 `memos`
  const fullUrl = `${apiUrl}/api/v1/memos?limit=${limit}&offset=${offset}`;

  // 3. 执行 fetch 并进行周全的错误处理
  try {
    const res = await fetch(fullUrl, {
      // 推荐为生产环境的fetch请求设置缓存策略
      next: { revalidate: 3600 }, // 1小时
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // Case 1: API 响应不成功 (如 401, 404, 500 等)
    if (!res.ok) {
      console.error(`[API Response Error] Request failed with status: ${res.status}. URL: ${fullUrl}`);
      // 返回空数组，让页面优雅降级
      return [];
    }

    // Case 2: API 响应成功，但返回内容可能不是有效的JSON
    try {
      const data: Memo[] = await res.json();
      return data;
    } catch (jsonError) {
      console.error(`[API JSON Parse Error] Failed to parse JSON response. URL: ${fullUrl}`, jsonError);
      return [];
    }

  } catch (networkError) {
    // Case 3: 发生网络层面的致命错误 (如 DNS, acls)
    console.error(`[Fatal Fetch Error] Network request failed. URL: ${fullUrl}`, networkError);
    // 返回空数组，页面降级
    return [];
  }
}

// 页面主组件 (这部分逻辑已经很健壮，无需修改)
export default async function MemosPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  // 调用我们健壮的 getMemos 函数
  const memos = await getMemos(currentPage);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        备忘录
      </h1>
      
      {memos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-8 text-center text-card-foreground shadow">
          <p className="text-lg text-muted-foreground">没有获取到内容</p>
          <p className="mt-2 text-sm text-muted-foreground">
            可能是没有新动态，或服务器配置出现问题，请检查后台日志。
          </p>
          {currentPage > 1 && (
             <Button asChild variant="ghost" className="mt-4">
                <Link href={`/memos?page=${currentPage - 1}`}>返回上一页</Link>
             </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {memos.map((memo) => (
            <div key={memo.id} className="rounded-xl border bg-card p-4 text-card-foreground shadow">
              <p className="whitespace-pre-wrap text-base text-muted-foreground">
                {memo.content}
              </p>
              <div className="mt-4 text-right text-xs text-muted-foreground">
                <span>{new Date(memo.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <div>
          {currentPage > 1 && (
            <Button asChild variant="outline">
              <Link href={`/memos?page=${currentPage - 1}`}>← 上一页</Link>
            </Button>
          )}
        </div>
        <div>
          {memos.length === limit && (
            <Button asChild variant="outline">
              <Link href={`/memos?page=${currentPage + 1}`}>下一页 →</Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
