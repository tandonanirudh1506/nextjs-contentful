import { previewClient } from '@/lib/contentful/client'
import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 });
  }

  const response = await previewClient.getEntries({
    content_type: 'post',
    'fields.slug': slug
  })

  const post = response?.items?.[0]
  console.log('post in route handler', post)
  if (!post) {
    return new Response('Invalid slug', { status: 401 });
  }

  draftMode().enable();

  const cookieStore = cookies();
  const cookie = cookieStore.get('__prerender_bypass')!;
  cookies().set({
    name: '__prerender_bypass',
    value: cookie?.value,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  });

  redirect(`/posts/${post.fields}`);

}
