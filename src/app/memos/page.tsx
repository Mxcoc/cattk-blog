// /app/memos/page.tsx

// --- 1. 定义TypeScript类型 ---
interface MemoLocation {
  placeholder: string;
  latitude: number;
  longitude: number;
}

interface MemoResource {
  name: string;
  filename: string;
  type: string;
}

interface Memo {
  name: string;
  displayTime: string;
  content: string;
  pinned: boolean;
  resources: MemoResource[];
  location?: MemoLocation; 
}

interface MemosApiResponse {
  memos: Memo[];
}


// --- 2. 数据获取函数 ---
async function getMemos(): Promise<MemosApiResponse> {
  const apiUrl = "https://memos.cattk.com/api/v1/memos?limit=10";
  
  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // 每小时重新验证一次数据
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch memos from API. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching memos:", error);
    return { memos: [] };
  }
}


// --- 3. 页面主组件 ---
export default async function MemosPage() {
  const { memos } = await getMemos();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">备忘录</h1>
      
      {memos && memos.length > 0 ? (
        <div className="space-y-6 max-w-2xl mx-auto">
          {memos.map((memo) => (
            <div key={memo.name} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 transition-shadow hover:shadow-lg">
              {/* 头部：时间和置顶标记 */}
              <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                <time>{new Date(memo.displayTime).toLocaleString('zh-CN')}</time>
                {memo.pinned && <span className="text-blue-500 font-semibold">置顶</span>}
              </div>
              
              {/* 内容区域 */}
              <div className="prose dark:prose-invert max-w-none mb-4">
                 <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {memo.content}
                 </p>
              </div>

              {/* 附件（图片等） */}
              {memo.resources && memo.resources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                  <div className="flex flex-wrap gap-4">
                    {memo.resources.map(resource => (
                      <div key={resource.name}>
                        {resource.type.startsWith('image/') ? (
                           // 链接到不带缩略图参数的原图
                           <a href={`http://memos.cattk.com/file/${resource.name}/${resource.filename}`} target="_blank" rel="noopener noreferrer" title="点击查看原图">
                             <img 
                               // **【已修复】** 修正了URL拼接逻辑，直接使用 resource.name
                               // 使用带 ?thumbnail=true 的链接加载缩略图以提高性能
                               src={`http://memos.cattk.com/file/${resource.name}/${resource.filename}?thumbnail=true`} 
                               alt={resource.filename}
                               className="max-h-60 max-w-full rounded-lg object-cover hover:opacity-80 transition-opacity cursor-pointer"
                             />
                          </a>
                        ) : (
                          // 其他文件类型的下载链接
                          <a href={`http://memos.cattk.com/file/${resource.name}/${resource.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            下载附件: {resource.filename}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 位置信息 */}
              {/* **【已修改】** 只显示位置文字，移除了地图链接 */}
              {memo.location?.placeholder && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm">
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">位置:</span> {memo.location.placeholder}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">正在加载备忘录，或暂无内容...</p>
      )}
    </main>
  );
}
