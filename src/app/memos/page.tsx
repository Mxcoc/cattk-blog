import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Memo {
  id: number; // 虽然API返回的是name，但为了简化，我们继续用之前的结构
  content: string;
  creatorName: string;
  createTime: string; // API返回的是createTime，和我们之前的定义匹配
}

const limit = 10;

// [最终版 - 适配真实API结构]
async function getMemos(page: number): Promise<Memo[]> {
  const apiUrl = process.env.MEMOS_API_URL;
  const accessToken = process.env.MEMOS_ACCESS_TOKEN;
  
  if (!apiUrl || !accessToken) {
    console.error('[Configuration Error] MEMOS_API_URL or MEMOS_ACCESS_TOKEN is not set.');
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
    
    const responseData = await res.json();

    // *** 核心修正：直接从 responseData.memos 中获取数组 ***
    if (responseData && Array.isArray(responseData.memos)) {
      // 这里的 .map 是为了适配我们前端的 Memo 接口，如果不需要可以简化
      return responseData.memos.map((memo: any) => ({
        id: memo.name, // 使用API返回的唯一 name 作为id
        content: memo.content,
        creatorName: memo.creator.split('/')[1], // 从 "users/1" 中提取出 "1"
        createTime: memo.createTime,
      }));
    }
    
    console.error('[API Structure Error] The API response did not contain a "memos" array.');
    return [];

  } catch (error) {
    console.error(`[Fatal Fetch Error] Network or JSON parsing failed. URL: ${fullUrl}`, error);
    return [];
  }
}

// 页面主组件 (无需修改)
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
                <span>{new Date(memo.createTime).toLocaleString()}</span>
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
