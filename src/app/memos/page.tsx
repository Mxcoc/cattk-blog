// /app/memos/page.tsx

import Image from 'next/image';

// --- 1. 定义TypeScript类型 ---
interface User {
  name: string;
  displayName: string;
  avatarUrl: string;
}

interface MemoLocation {
  placeholder: string;
}

interface MemoResource {
  name: string;
  filename: string;
  type: string;
}

interface Memo {
  name: string;
  creator: string; // e.g., "users/1"
  displayTime: string;
  content: string;
  resources: MemoResource[];
  location?: MemoLocation; 
}

interface MemosApiResponse {
  memos: Memo[];
}

// --- 2. 数据获取函数 ---

// 获取Memos列表
async function getMemos(): Promise<MemosApiResponse> {
  const apiUrl = "https://memos.cattk.com/api/v1/memos?limit=15"; // 获取最近15条
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch memos');
    return res.json();
  } catch (error) {
    console.error("Error fetching memos:", error);
    return { memos: [] };
  }
}

// 获取用户信息 (假设是用户1)
async function getUser(userId: string = '1'): Promise<User | null> {
  const apiUrl = `https://memos.cattk.com/api/v1/users/${userId}`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 86400 } }); // 用户信息一天更新一次
    if (!res.ok) throw new Error('Failed to fetch user');
    const userData = await res.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// --- 3. 辅助组件和图标 ---

// 位置图标
const LocationIcon = () => (
  <svg className="inline-block w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// 备用头像SVG图标
const FallbackAvatar = () => (
    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    </div>
);


// --- 4. 页面主组件 ---
export default async function MemosPage() {
  // 并发获取Memos列表和用户信息，提高加载效率
  const [memosResponse, user] = await Promise.all([
    getMemos(),
    getUser('1') // 假设您的用户ID是1
  ]);
  const { memos } = memosResponse;

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Memos</h1>
      
      {/* 推文风格的时间线容器 */}
      <div className="border-x border-gray-200 dark:border-zinc-700">
        {memos && memos.length > 0 ? (
          memos.map((memo) => (
            // 单条推文卡片
            <article key={memo.name} className="flex gap-4 p-4 border-b border-gray-200 dark:border-zinc-700">
              {/* 左侧：头像 */}
              <div className="flex-shrink-0">
                {user && user.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl} 
                    alt={user.displayName} 
                    width={48} 
                    height={48} 
                    className="w-12 h-12 rounded-full"
                  />
                ) : <FallbackAvatar />}
              </div>

              {/* 右侧：内容 */}
              <div className="flex-1">
                {/* 头部：用户名和时间 */}
                <header className="flex items-center gap-2 mb-1">
                  <span className="font-bold hover:underline">{user?.displayName || 'Memo User'}</span>
                  <span className="text-gray-500 text-sm">
                    · {new Date(memo.displayTime).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </span>
                </header>

                {/* 内容 */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                  <p className="whitespace-pre-wrap">{memo.content}</p>
                </div>

                {/* 附件/图片 */}
                {memo.resources && memo.resources.length > 0 && (
                  <div className="mt-3">
                    {memo.resources.filter(r => r.type.startsWith('image/')).map(resource => (
                      <a key={resource.name} href={`http://memos.cattk.com/file/${resource.name}/${resource.filename}`} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={`http://memos.cattk.com/file/${resource.name}/${resource.filename}?thumbnail=true`}
                          alt={resource.filename}
                          width={600}
                          height={400}
                          className="w-full h-auto mt-2 border border-gray-200 dark:border-zinc-700 rounded-2xl object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
                
                {/* 位置 */}
                {memo.location?.placeholder && (
                  <div className="mt-3 text-sm text-gray-500 flex items-center">
                    <LocationIcon />
                    <span>{memo.location.placeholder}</span>
                  </div>
                )}
              </div>
            </article>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">正在加载备忘录，或暂无内容...</p>
        )}
      </div>
    </main>
  );
}
