import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import { Mdx } from '@/components/Mdx';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

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
    </div>
  );
}
