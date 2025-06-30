import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Memo {
  id: number;
  content: string;
  creatorName: string;
  createdAt: string; 
}

// [最终正确版本]
async function getMemos(page: number): Promise<Memo[]> {
  // 1. 读取正确的 Memos API 根地址
  const apiUrl = process.env.MEMOS_API_URL;
  
  if (!apiUrl) {
    throw new Error('MEMOS_API_URL is not defined in .env.local. 请设置您Memos服务的完整URL (例如 https://memos.example.com) 并重启服务器。');
  }

  const limit = 10;
  const offset = (page - 1) * limit;

  // 2. 将 Memos API 根地址和 API 路径拼接
  const fullUrl = `${apiUrl}/api/v1/memo?limit=${limit}&offset=${offset}`;

  try {
    const res = await fetch(fullUrl, {
      next: { revalidate: 3600 }, 
    });

    if (!res.ok) {
      return []; 
    }
    return res.json();
  } catch (error) {
    return [];
  }
}

// 页面主组件（这部分无需修改）
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
