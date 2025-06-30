import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Memo {
  id: number;
  content: string;
  creatorName: string;
  createdAt: string; 
}

// [最终授权版本]
async function getMemos(page: number): Promise<Memo[]> {
  const apiUrl = process.env.MEMOS_API_URL;
  // 1. 读取新的访问令牌
  const accessToken = process.env.MEMOS_ACCESS_TOKEN;
  
  if (!apiUrl || !accessToken) {
    throw new Error('MEMOS_API_URL or MEMOS_ACCESS_TOKEN is not defined in .env.local.');
  }

  const limit = 10;
  const offset = (page - 1) * limit;
  const fullUrl = `${apiUrl}/api/v1/memo?limit=${limit}&offset=${offset}`;

  try {
    // 2. 在 fetch 请求中添加 headers 和 Authorization
    const res = await fetch(fullUrl, {
      next: { revalidate: 3600 },
      headers: {
        // 'Bearer '后面有一个空格，请注意
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      // 如果令牌错误或过期，API 可能会返回 401 Unauthorized 错误
      console.error(`API request failed with status: ${res.status}`);
      return []; 
    }
    return res.json();
  } catch (error) {
    console.error('Fetch request failed:', error);
    return [];
  }
}

// 页面主组件（无需修改）
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
      
      {memos.length === 0 && currentPage > 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-8 text-center text-card-foreground shadow">
          <p className="text-lg text-muted-foreground">没有更多内容了</p>
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

      {/* 分页导航按钮 */}
      <div className="mt-10 flex items-center justify-between">
        <div>
          {currentPage > 1 && (
            <Button asChild variant="outline">
              <Link href={`/memos?page=${currentPage - 1}`}>
                ← 上一页
              </Link>
            </Button>
          )}
        </div>
        <div>
          {memos.length === 10 && (
            <Button asChild variant="outline">
              <Link href={`/memos?page=${currentPage + 1}`}>
                下一页 →
              </Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
