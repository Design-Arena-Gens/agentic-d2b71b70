import { NextResponse } from 'next/server';
import { blogStore } from '@/lib/blogStore';

export async function GET() {
  try {
    const posts = blogStore.getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
