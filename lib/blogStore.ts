export interface BlogPost {
  id: string;
  title: string;
  content: string;
  topic: string;
  createdAt: Date;
  status: 'draft' | 'published';
  keywords: string[];
  summary: string;
}

class BlogStore {
  private posts: BlogPost[] = [];

  addPost(post: Omit<BlogPost, 'id' | 'createdAt'>): BlogPost {
    const newPost: BlogPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  getPosts(): BlogPost[] {
    return [...this.posts];
  }

  getPostById(id: string): BlogPost | undefined {
    return this.posts.find(post => post.id === id);
  }

  updatePostStatus(id: string, status: 'draft' | 'published'): void {
    const post = this.posts.find(p => p.id === id);
    if (post) {
      post.status = status;
    }
  }

  deletePost(id: string): void {
    this.posts = this.posts.filter(p => p.id !== id);
  }
}

export const blogStore = new BlogStore();
