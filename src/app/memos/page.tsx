'use client';

import { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Paperclip, FileVideo, FileImage } from 'lucide-react';

// =================================================================
// 1. 配置
// =================================================================
const MEMOS_API_URL = 'https://memos.cattk.com';
const PAGE_SIZE = 10; // 每页显示10条备忘录


// =================================================================
// 2. 数据结构定义 (无变化)
// =================================================================
interface Resource {
  name: string;
  filename: string;
  type: string;
  size: number;
}

interface Memo {
  name: string;
  createTime: string;
  content: string;
  visibility: string;
  resources: Resource[];
}


// =================================================================
// 3. 子组件 (无变化)
// =================================================================
const MemoResources = ({ resources }: { resources: Resource[] }) => {
  if (!resources || resources.length === 0) return null;
  return (
    <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
      {resources.map(resource => {
        const resourceUrl = `${MEMOS_API_URL}/o/r/${resource.name}`;
        if (resource.type.startsWith('image/')) return <a key={resource.name} href={resourceUrl} target="_blank" rel="noopener noreferrer"><img src={resourceUrl} alt={resource.filename} className="rounded-lg object-cover w-full h-auto transition-transform hover:scale-105" /></a>;
        if (resource.type.startsWith('video/')) return <video key={resource.name} controls src={resourceUrl} className="rounded-lg w-full"/>;
        return <a key={resource.name} href={resourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-muted rounded-lg hover:bg-secondary transition-colors"><Paperclip className="h-5 w-5 mr-3 flex-shrink-0" /><span className="truncate text-sm">{resource.filename}</span></a>;
      })}
    </div>
  );
};

const MemoCard = ({ memo }: { memo: Memo }) => {
  const imageCount = memo.resources?.filter(r => r.type.startsWith('image/')).length || 0;
  const videoCount = memo.resources?.filter(r => r.type.startsWith('video/')).length || 0;
  return (
    <Card className="transition-shadow hover:shadow-xl">
      <CardHeader><CardDescription>发布于 {new Date(memo.createTime).toLocaleString('zh-CN', { hour12: false })}</CardDescription></CardHeader>
      <CardContent><article className="prose dark:prose-invert max-w-none"><ReactMarkdown>{memo.content}</ReactMarkdown></article><MemoResources resources={memo.resources} /></CardContent>
      {memo.resources?.length > 0 && <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">{imageCount > 0 && <div className="flex items-center gap-1.5"><FileImage className="h-4 w-4" /><span>{imageCount} 张图片</span></div>}{videoCount > 0 && <div className="flex items-center gap-1.5"><FileVideo className="h-4 w-4" /><span>{videoCount} 个视频</span></div>}</CardFooter>}
    </Card>
  );
};

const MemoSkeleton = () => (
  <div className="grid gap-4">{[...Array(3)].map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-4 w-48" /></CardHeader><CardContent><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-32 w-full mt-4 rounded-lg" /></CardContent></Card>)}</div>
);


// =================================================================
// 4. 主页面组件 (集成自分页功能)
// =================================================================
const MemosPage = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 新增分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchMemos = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0); // 翻页时滚动到顶部

    const offset = (page - 1) * PAGE_SIZE;

    try {
      const response = await fetch(`${MEMOS_API_URL}/api/v1/memo?creatorUsername=host&limit=${PAGE_SIZE}&offset=${offset}`);
      if (!response.ok) throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      const publicMemos = Array.isArray(data) ? data.filter((memo: Memo) => memo.visibility === 'PUBLIC') : [];
      
      setMemos(publicMemos);
      // 如果返回的数据量等于每页数量，我们假设有下一页
      setHasNextPage(publicMemos.length === PAGE_SIZE);

    } catch (e) {
      setError(e instanceof Error ? e.message : '发生未知错误');
    } finally {
      setLoading(false);
    }
  }, []);

  // 当 currentPage 改变时，重新获取数据
  useEffect(() => {
    fetchMemos(currentPage);
  }, [currentPage, fetchMemos]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  const renderContent = () => {
    if (loading) return <MemoSkeleton />;
    if (error) return <Card className="bg-destructive/10 border-destructive"><CardHeader><CardTitle>加载错误</CardTitle></CardHeader><CardContent><p>无法加载备忘录内容。</p><p className="text-sm text-muted-foreground mt-2">详情: {error}</p></CardContent></Card>;
    if (memos.length === 0 && currentPage === 1) return <div className="text-center py-10"><p className="text-muted-foreground">没有找到公开的备忘录。</p></div>;
    
    return (
      <div className="grid gap-6">
        {memos.map((memo) => <MemoCard key={memo.name} memo={memo} />)}
      </div>
    );
  };

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          备忘录 (Memos)
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          这里是一些公开的随笔、想法和记录。
        </p>
      </div>
      
      {renderContent()}

      {/* 分页控件 */}
      {!loading && !error && (memos.length > 0 || currentPage > 1) && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="p-2 font-medium">第 {currentPage} 页</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

export default MemosPage;
