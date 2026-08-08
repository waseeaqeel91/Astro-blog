import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";


export const GET: APIRoute = async ({ url }): Promise<Response> => {
    const query: string | null = url.searchParams.get('query');

    // console.log(query)
    // Handle if there is query not present
    if (query === null) {
        return new Response(JSON.stringify({
            error: 'query is not present'

        }),
            {
                status: 400, // bad search
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    }

    const allBlogArticles: CollectionEntry<'blog'>[] = await getCollection('blog');

    const searchResult = allBlogArticles.filter((article) => {
        if (!query) return false;

        const queryLower = query.toLowerCase();

        // 1. Search in Title
        const titleMatch = article.data.title?.toLowerCase().includes(queryLower);

        // 2. Search in Tags Array
        const tagMatch = article.data.tags?.some((tag: string) =>
            tag.toLowerCase().includes(queryLower),
        );

        // 3. Search in Body Content
        const bodyMatch = article.body
            ? article.body.toLowerCase().includes(queryLower)
            : false;

        return titleMatch || tagMatch || bodyMatch;
    });

    return new Response(JSON.stringify(searchResult),
        {
            status: 200, // good search
            headers: {
                'Content-Type': 'application/json'
            }
        })
}