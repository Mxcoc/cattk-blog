// /app/memos/page.tsx

// --- 1. 定义TypeScript类型 ---
// 为从API获取的数据定义类型，可以增强代码健壮性和可读性

// Memos中的位置信息
interface MemoLocation {
  placeholder: string;
  latitude: number;
  longitude: number;
}

// Memos中的附件资源信息
interface MemoResource {
  name: string;
  filename: string;
  type: string;
}

// 单条Memo的核心数据结构
interface Memo {
  name: string;
  displayTime: string;
  content: string;
  pinned: boolean;
  resources: MemoResource[];
  // 位置信息不是每条memo都必须有，所以设为可选
  location?: MemoLocation; 
}

// API响应的完整结构
interface MemosApiResponse {
  memos: Memo[];
}


// --- 2. 数据获取函数 ---
// 异步函数，用于从您的Memos API获取数据
async function getMemos(): Promise<MemosApiResponse> {
  const apiUrl = "https://memos.cattk.com/api/v1/memos?limit=10";
  
  try {
    const res = await fetch(apiUrl, {
      // Next.js 的数据缓存策略，这里设置为每小时重新验证一次数据 (3600秒)
      // 这可以有效减少API请求次数，同时保持数据相对最新
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch memos from API. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching memos:", error);
    // 在发生错误时返回一个空数组，以避免页面崩溃
    return { memos: [] };
  }
}


// --- 3. 页面主组件 ---
// 这是“备忘录”页面的核心React组件
export default async function MemosPage() {
  // 在服务器端获取数据
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
                           <a href={`https://memos.cattk.com/o/r/${resource.name}/${resource.filename}`} target="_blank" rel="noopener noreferrer" title="点击查看原图">
                             <img 
                               // !!! 重要提示 !!!
                               // 下方的图片URL是根据Memos通用结构推测的。
                               // 如果图片无法显示，您需要确认您的Memos实例的实际资源链接格式。
                               // 常见的格式有:
                               // 1. https://your-memos.com/o/r/{resource.name}/{filename}
                               // 2. https://your-memos.com/o/r/{resource.name}
                               // 3. https://your-memos.com/u/{user_id}/r/{resource.name}
                               // 请根据您的实际情况修改此处的 `src` 属性。
                               src={`https://memos.cattk.com/o/r/${resource.name}/${resource.filename}`} 
                               alt={resource.filename}
                               className="max-h-60 max-w-full rounded-lg object-cover hover:opacity-80 transition-opacity cursor-pointer"
                             />
                          </a>
                        ) : (
                          <a href={`https://memos.cattk.com/o/r/${resource.name}/${resource.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            下载附件: {resource.filename}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 位置信息 */}
              {memo.location && (memo.location.placeholder || (memo.location.latitude && memo.location.longitude)) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm">
                  {memo.location.placeholder && (
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">位置:</span> {memo.location.placeholder}
                    </div>
                  )}

                  {memo.location.latitude && memo.location.longitude && (
                    <div className="mt-1 text-gray-500 dark:text-gray-400">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${memo.location.latitude},${memo.location.longitude}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline text-blue-500"
                      >
                        在地图上查看 &rarr;
                      </a>
                    </div>
                  )}
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
