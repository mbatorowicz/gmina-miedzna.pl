import { getCollection } from 'astro:content';

export async function GET() {
  const allNews = await getCollection('news');
  
  const searchIndex = allNews.map(post => {
    return {
      title: post.data.title,
      slug: `/${post.data.category}/${post.id}`,
      date: new Date(post.data.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: post.data.categoryName
    };
  });

  return new Response(
    JSON.stringify(searchIndex),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
