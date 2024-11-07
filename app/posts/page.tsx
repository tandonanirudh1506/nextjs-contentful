import { client } from '@/lib/contentful/client'
import PostCard from '@/lib/components/posts/PostCard'

export const Posts = async  ({params}: {params: any}) => {
    const response = await client.getEntries({ content_type: 'post' })
    const posts = response.items
  return (
    <section className='section'>
      <div className='container'>
        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10'>
          {posts.map((post, i) => (
            <PostCard key={params.slug} post={post} />
          ))}
        </ul>
      </div>
    </section>
  )
}

// export const getStaticProps = async () => {
//   const response = await client.getEntries({ content_type: 'post' })

//   return {
//     props: {
//       posts: response.items,
//       revalidate: 60
//     }
//   }
// }

export default Posts
