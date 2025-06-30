import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Memo {
  id: number;
  content: string;
  creatorName: string;
  createdAt: string; 
}

// [404 错误修正版]
async function getMemos(page: number): Promise<Memo[]> {
  const apiUrl = process.env.MEMOS_API_URL;
  const accessToken = process.env.MEMOS_ACCESS_TOKEN;
  
  if (!apiUrl || !accessToken) {
    throw new Error('MEMOS_API_URL or MEMOS_ACCESS_TOKEN is not defined in .env.local.');
  }

  const limit = 10;
  const offset = (page - 1) * limit;
  
  // *** 核心修正：将 /memo 修改为 /memos ***
  const fullUrl = `${apiUrl}/api/v1/memos?limit=${limit}&offset=${offset}`;

  try {
    const res = await fetch(fullUrl, {
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
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
