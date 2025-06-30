import Link from 'next/link';
import { Button } from '@/components/ui/button';

// [调试版本]
interface Memo {
  id: number;
  content: string;
  creatorName: string;
  createdAt: string; 
}

async function getMemos(page: number): Promise<Memo[]> {
  console.log('\n\n--- [诊断开始] ---');
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl) {
    console.error('❌ [诊断错误] 环境变量 NEXT_PUBLIC_SITE_URL 未定义!');
    throw new Error('NEXT_PUBLIC_SITE_URL is not defined in .env.local. 请检查 .env.local 文件并重启服务器。');
  }
  console.log(`[1] 读取到网站基础 URL: ${siteUrl}`);

  const limit = 10;
  const offset = (page - 1) * limit;
  const fullUrl = `${siteUrl}/api/v1/memo?limit=${limit}&offset=${offset}`;
  
  console.log(`[2] 拼接出的完整请求 URL: ${fullUrl}`);
  console.log('[3] 准备发起服务器端 fetch 请求...');

  try {
    const res = await fetch(fullUrl, {
      // 增加 cache: 'no-store' 确保每次都是新的请求，排除缓存影响
      cache: 'no-store', 
    });

    console.log(`[4] 收到 API 响应，HTTP 状态码: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      console.error(`❌ [诊断错误] API 响应不成功。`);
      // 尝试打印出响应的文本内容以获取线索
      const errorText = await res.text();
      console.error(`[响应内容]: ${errorText}`);
      return []; 
    }

    const data = await res.json();
    console.log(`[5] 成功解析 JSON 数据。获取到 ${data.length} 条备忘录。`);
    console.log('--- [诊断结束] ---');
    return data;
  } catch (error) {
    console.error('❌ [诊断致命错误] 在 fetch 请求过程中发生异常:', error);
    console.log('--- [诊断结束] ---');
    return [];
  }
}

// 页面主组件，无需修改
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
