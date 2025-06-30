import Link from 'next/link';
import Image from 'next/image'; // 導入 Next.js 的 Image 元件以優化圖片
import { Button } from '@/components/ui/button';

// 定義資源和備忘錄的資料結構
interface Resource {
  name: string;
  type: string;
  filename: string;
}

interface Memo {
  id: string;
  content: string;
  creatorName: string;
  createTime: string;
  resources: Resource[];
}

const limit = 10;

// [功能完整最終版 - 含圖片顯示]
async function getMemos(page: number): Promise<Memo[]> {
  const apiUrl = process.env.MEMOS_API_URL;
  const accessToken = process.env.MEMOS_ACCESS_TOKEN;
  
  if (!apiUrl || !accessToken) {
    console.error('[Configuration Error] MEMOS_API_URL or MEMOS_ACCESS_TOKEN is not set.');
    throw new Error('Server configuration is incomplete.');
  }

  const offset = (page - 1) * limit;
  const filter = 'visibility = "PUBLIC"';
  const encodedFilter = encodeURIComponent(filter);
  const fullUrl = `${apiUrl}/api/v1/memos?limit=${limit}&offset=${offset}&filter=${encodedFilter}`;

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

    if (responseData && Array.isArray(responseData.memos)) {
      return responseData.memos.map((memo: any) => ({
        id: memo.name,
        content: memo.content,
        creatorName: memo.creator.split('/')[1],
        createTime: memo.createTime,
        // *** 核心修正：讀取並傳遞 resources 陣列 ***
        resources: memo.resources || [],
      }));
    }
    
    console.error('[API Structure Error] The API response did not contain a "memos" array.');
    return [];

  } catch (error) {
    console.error(`[Fatal Fetch Error] Network or JSON parsing failed. URL: ${fullUrl}`, error);
    return [];
  }
}

// 頁面主元件
export default async function MemosPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const memos = await getMemos(currentPage);
  const apiUrl = process.env.MEMOS_API_URL || '';

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        备忘录
      </h1>
      
      {memos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-8 text-center text-card-foreground shadow">
          <p className="text-lg text-muted-foreground">没有公开的备忘录</p>
          <p className="mt-2 text-sm text-muted-foreground">
            这里只显示您设置为“公开”的备忘录。
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
              {/* 渲染备忘录文字内容 */}
              <p className="whitespace-pre-wrap text-base text-muted-foreground">
                {memo.content}
              </p>

              {/* *** 核心修正：渲染图片 *** */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {memo.resources.map((resource) => {
                  // 只渲染图片类型的附件
                  if (resource.type.startsWith('image/')) {
                    const resourceId = resource.name.split('/')[1];
                    const imageUrl = `${apiUrl}/o/r/${resourceId}/${resource.filename}`;
                    return (
                      <div key={resource.name} className="relative aspect-square overflow-hidden rounded-md">
                        <Image
                          src={imageUrl}
                          alt={resource.filename}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* 渲染时间和作者 */}
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
