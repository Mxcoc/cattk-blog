import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import { Mdx } from '@/components/Mdx';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

// 使用 dynamic import 动态加载评论组件，并禁用 SSR (ssr: false)
// 这确保了评论组件只会在用户的浏览器中渲染，不会影响页面的初始加载速度
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false });

interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams({ params }: PostPageProps) {
  const slug = params.slug.join('/');
  const post = allPosts.find((p) => p.slugAsParams === slug);

  if (!post) {
    return null;
  }

  return post;
}

export async function generateStaticParams(): Promise<PostPageProps['params'][]> {
  return allPosts.map((p) => ({
    slug: p.slugAsParams.split('/'),
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams({ params });

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl py-10">
      <Link
        href="/blog"
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>返回博客列表</span>
      </Link>
      <article>
        <h1 className="mb-2 text-3xl font-bold leading-tight lg:text-4xl">
          {post.title}
        </h1>
        <time dateTime={post.date} className="text-sm text-muted-foreground">
          {formatDate(post.date)}
        </time>
        <div className="prose prose-zinc mt-6 max-w-none dark:prose-invert">
          <Mdx code={post.body.code} />
        </div>
      </article>

      {/* ↓↓↓ 在这里添加评论组件 ↓↓↓
        将其放置在文章内容 <article> 标签之后
        这样评论区就会显示在文章的正文下方
      */}
      <div className="w-full">
        <Comment />
      </div>
    </div>
  );
}
