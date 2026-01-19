import { NextResponse } from 'next/server';
import { blogStore } from '@/lib/blogStore';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    blogStore.deletePost(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
