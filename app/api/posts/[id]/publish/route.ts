import { NextResponse } from 'next/server';
import { blogStore } from '@/lib/blogStore';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    blogStore.updatePostStatus(params.id, 'published');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to publish post' },
      { status: 500 }
    );
  }
}
