import { NextResponse } from 'next/server';
import { BlogAIAgent } from '@/lib/aiAgent';
import { blogStore } from '@/lib/blogStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { industry, targetAudience, keywords, tone } = body;

    if (!industry || !targetAudience) {
      return NextResponse.json(
        { error: 'Industry and target audience are required' },
        { status: 400 }
      );
    }

    const keywordList = keywords
      ? keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      : [industry, targetAudience];

    const agent = new BlogAIAgent({
      industry,
      targetAudience,
      keywords: keywordList,
      tone: tone || 'professional'
    });

    const topics = await agent.generateTopicIdeas(1);
    const blogContent = await agent.generateBlogPost(topics[0]);

    const post = blogStore.addPost({
      title: blogContent.title,
      content: blogContent.content,
      topic: topics[0].title,
      status: 'draft',
      keywords: blogContent.keywords,
      summary: blogContent.summary
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error generating blog:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}
