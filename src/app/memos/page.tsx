import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Memo {
  id: number;
  content: string;
  creatorName: string;
  createdAt: string; 
}

// [最终版本]
async function getMemos(page: number): Promise<Memo[]> {
  // 1. 读取网站的基础URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not defined in .env.local. 请设置您网站的完整URL (例如 http://localhost:3000) 并重启服务器。');
  }

  const limit = 10;
  const offset = (page - 1) * limit;

  // 2. 将基础URL和相对API路径拼接成一个完整的、绝对的URL
  //    注意：我们直接使用 /api/v1/memo，因为这是您的反向代理路径
  const fullUrl = `${siteUrl}/api/v1/memo?limit=${limit}&offset=${offset}`;

  try {
    const res = await fetch(fullUrl, {
      next: { revalidate: 3600 }, 
    });

    if (!res.ok) {
      // 如果请求失败，返回空数组，避免页面崩溃
      return []; 
    }
    return res.json();
  } catch (error) {
    // 如果发生网络等异常，也返回空数组
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
