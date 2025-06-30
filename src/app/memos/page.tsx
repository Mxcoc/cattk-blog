import Link from 'next/link';
import { Button } from '@/components/ui/button';

// 定义清晰的数据结构
interface Memo {
  id: number;
  content: string;
  creatorName: string;
  createdAt: string; 
}

// *** 核心修正：将 limit 定义在顶层，使其在 getMemos 和 MemosPage 组件中都可访问 ***
const limit = 10;

/**
 * 健壮的 Memos 数据获取函数
 * @param page - 需要获取的页码
 * @returns 返回一个备忘录数组 Promise，失败时返回空数组
 */
async function getMemos(page: number): Promise<Memo[]> {
  const apiUrl = process.env.MEMOS_API_URL;
  const accessToken = process.env.MEMOS_ACCESS_TOKEN;
  
  if (!apiUrl || !accessToken) {
    console.error('[Configuration Error] MEMOS_API_URL or MEMOS_ACCESS_TOKEN is not set in the production environment.');
    throw new Error('Server configuration is incomplete.');
  }

  const offset = (page - 1) * limit;
  const fullUrl = `${apiUrl}/api/v1/memos?limit=${limit}&offset=${offset}`;

  try {
    const res = await fetch(fullUrl, {
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error(`[API Response Error] Request failed with status: ${res.status}. URL: ${fullUrl}`);
      return [];
    }

    try {
      const data: Memo[] = await res.json();
      return data;
    } catch (jsonError) {
      console.error(`[API JSON Parse Error] Failed to parse JSON response. URL: ${fullUrl}`, jsonError);
      return [];
    }

  } catch (networkError) {
    console.error(`[Fatal Fetch Error] Network request failed. URL: ${fullUrl}`, networkError);
    return [];
  }
}

// 页面主组件
export default async function MemosPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
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
          {/* 现在这里的 `limit` 可以被正确访问到了 */}
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
