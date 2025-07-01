'use client'; // 这是一个客户端组件，因为我们使用了 useEffect 和 useState

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // 从模板中导入卡片组件

// 定义从Memos API返回的单个备忘录的数据结构
interface Memo {
  name: string;
  createTime: string;
  content: string;
  visibility: string;
  // 如果需要显示其他字段，可以继续添加
}

const MemosPage = () => {
  // 使用 useState 存储备忘录数据、加载状态和错误信息
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 定义一个异步函数来获取数据
    const fetchMemos = async () => {
      try {
        // 从您的Memos API地址获取数据
        const response = await fetch('https://memos.cattk.com/api/v1/memos?limit=10');
        if (!response.ok) {
          throw new Error(`请求失败: ${response.statusText}`);
        }
        const data = await response.json();
        // 确保只显示设置为"PUBLIC"的备忘录
        const publicMemos = data.memos ? data.memos.filter((memo: Memo) => memo.visibility === 'PUBLIC') : [];
        setMemos(publicMemos);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('发生未知错误');
        }
      } finally {
        setLoading(false); // 数据加载完成或失败后，停止加载状态
      }
    };

    fetchMemos();
  }, []); // 空依赖数组确保此 effect 只在组件挂载时运行一次

  // 根据加载状态显示不同内容
  if (loading) {
    return <div className="text-center p-10">正在加载备忘录...</div>;
  }

  // 如果发生错误，显示错误信息
  if (error) {
    return <div className="text-center p-10 text-red-500">加载备忘录失败: {error}</div>;
  }

  // 成功获取数据后，渲染页面内容
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          备忘录 (Memos)
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          这里是一些公开的随笔和记录。
        </p>
      </div>
      <div className="grid gap-4">
        {memos.length > 0 ? (
          memos.map((memo) => (
            <Card key={memo.name}>
              <CardHeader>
                <p className="text-sm font-normal text-muted-foreground">
                  发布于 {new Date(memo.createTime).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                <article className="prose dark:prose-invert max-w-none">
                  {/* 使用 ReactMarkdown 来渲染备忘录内容 */}
                  <ReactMarkdown>{memo.content}</ReactMarkdown>
                </article>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>没有找到公开的备忘录。</p>
        )}
      </div>
    </section>
  );
};

export default MemosPage;

