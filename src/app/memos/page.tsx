// /app/memos/page.tsx

// 为从API获取的数据定义TypeScript类型，以增强代码健壮性
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
}

interface MemosApiResponse {
  memos: Memo[];
}

// 异步函数，用于从您的Memos API获取数据
async function getMemos(): Promise<MemosApiResponse> {
  const apiUrl = "https://memos.cattk.com/api/v1/memos?limit=10";
  
  try {
    const res = await fetch(apiUrl, {
      // Next.js 的数据缓存策略，这里设置为每小时重新验证一次数据
      // 这可以有效减少API请求次数，同时保持数据相对最新
      next: { revalidate: 3600 },
    });

    // 如果请求失败，则抛出错误
    if (!res.ok) {
      throw new Error('Failed to fetch memos from API');
    }

    return res.json();
  } catch (error) {
    console.error(error);
    // 在发生错误时返回一个空数组，以避免页面崩溃
    return { memos: [] };
  }
}

// “备忘录”页面的主组件
export default async function MemosPage() {
  const { memos } = await getMemos();

  // 检查您提供的示例JSON中的乱码问题
  // 如果API服务器正确配置了UTF-8编码，实际页面上应该能正确显示中文字符
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">备忘录</h1>
      
      {memos && memos.length > 0 ? (
        <div className="space-y-6">
          {memos.map((memo) => (
            <div key={memo.name} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
              <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                {/* 格式化并显示时间 */}
                <time>{new Date(memo.displayTime).toLocaleString()}</time>
                {/* 如果memo被置顶，则显示标记 */}
                {memo.pinned && <span className="text-blue-500 font-semibold">置顶</span>}
              </div>
              
              {/* Memos 的 content 字段是 Markdown 格式。
                为了完整地渲染格式（如标题、列表、代码块等），您可能需要安装一个Markdown渲染库，例如 'react-markdown'。
                这里我们使用 `whitespace-pre-wrap` 来简单地保留换行和空格。
              */}
              <div className="prose dark:prose-invert max-w-none">
                 <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {memo.content}
                 </p>
              </div>

              {/* 如果有附件（如图片），则在此处显示 */}
              {memo.resources && memo.resources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                  <h3 className="font-semibold mb-2">附件:</h3>
                  <div className="flex flex-wrap gap-4">
                    {memo.resources.map(resource => (
                      <div key={resource.name}>
                        {/* 判断附件是否为图片类型 */}
                        {resource.type.startsWith('image/') ? (
                          <a href={`https://memos.cattk.com/o/r/${resource.name}/${resource.filename}`} target="_blank" rel="noopener noreferrer">
                             <img 
                               // 注意: 此处URL是根据Memos的通用结构猜测的，您需要确切认您的Memos实例的资源链接结构
                               src={`https://memos.cattk.com/o/r/${resource.name}/${resource.filename}`} 
                               alt={resource.filename}
                               className="max-h-48 rounded-lg object-cover hover:opacity-80 transition-opacity"
                             />
                          </a>
                        ) : (
                          // 其他类型的文件，提供一个下载链接
                          <a href={`https://memos.cattk.com/o/r/${resource.name}/${resource.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {resource.filename}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">无法加载备忘录，或暂无内容。</p>
      )}
    </main>
  );
}
