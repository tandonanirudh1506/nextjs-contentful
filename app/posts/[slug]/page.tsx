import PostBody from "@/lib/components/posts/PostBody";
import PostHeader from "@/lib/components/posts/PostHeader";
import PreviewAlert from "@/lib/components/ui/PreviewAlert";
import Skeleton from "@/lib/components/ui/Skeleton";
import { client, previewClient } from "@/lib/contentful/client";
import { redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { Suspense } from "react";

interface Params {
  params: any;
}

export async function generateStaticParams({ params }: Params) {
  const response = await client.getEntries({ content_type: "post" });
  return response.items.map((item) => ({
    slug: params.slug,
  }));
}

export async function generateMetadata({ params }: Params) {
  const cfClient = client;
  const { slug } = params;
  const response = await cfClient.getEntries({
    content_type: "post",
    "fields.slug": slug,
  });

  if (!response?.items?.length) {
    return redirect('/posts');
  }

  const post = response.items[0];
  console.log("post1", post);
  return {
    title: post.fields?.title,
  };
}

const Post = async ({ params }: Params) => {
  const { isEnabled } = draftMode();
  const cfClient = isEnabled ? previewClient : client;

  const { slug } = params;
  const response = await cfClient.getEntries({
    content_type: "post",
    "fields.slug": slug,
  });

  const post = response.items[0];

  return (
    <section className="section">
      {isEnabled && <PreviewAlert />}
      <div className="container">
        <article className="prose mx-auto">
          <Suspense fallback={<Skeleton />}>
            <PostHeader post={post} />
            <PostBody post={post} />
          </Suspense>
        </article>
      </div>
    </section>
  );
};

// export const getStaticProps = async ({ params, preview = false }) => {
//   const cfClient = preview ? previewClient : client;

//   const { slug } = params;
//   const response = await cfClient.getEntries({
//     content_type: "post",
//     "fields.slug": slug,
//   });

//   if (!response?.items?.length) {
//     return {
//       redirect: {
//         destination: "/posts",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       post: response?.items?.[0],
//       preview,
//       revalidate: 60,
//     },
//   };
// };

// export const getStaticPaths = async () => {
//   const response = await client.getEntries({ content_type: "post" });
//   const paths = response.items.map((item) => ({
//     params: { slug: item.fields.slug },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// };

export default Post;
