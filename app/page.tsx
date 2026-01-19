'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/blogStore';

export default function Home() {
  const [businessContext, setBusinessContext] = useState({
    industry: '',
    targetAudience: '',
    keywords: '',
    tone: 'professional'
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [agentStatus, setAgentStatus] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleGenerateBlog = async () => {
    if (!businessContext.industry || !businessContext.targetAudience) {
      alert('Please fill in industry and target audience');
      return;
    }

    setGenerating(true);
    setAgentStatus('AI Agent initializing...');

    try {
      setAgentStatus('Researching relevant topics...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAgentStatus('Generating blog content...');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessContext)
      });

      if (!response.ok) throw new Error('Generation failed');

      const newPost = await response.json();
      setAgentStatus('Blog post created successfully!');

      await fetchPosts();
      setTimeout(() => setAgentStatus(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setAgentStatus('Error generating blog post');
    } finally {
      setGenerating(false);
    }
  };

  const handleAutoGenerate = async () => {
    if (!businessContext.industry || !businessContext.targetAudience) {
      alert('Please fill in industry and target audience');
      return;
    }

    setGenerating(true);
    setAgentStatus('Starting autonomous blog generation...');

    for (let i = 0; i < 3; i++) {
      try {
        setAgentStatus(`Generating blog ${i + 1} of 3...`);
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(businessContext)
        });

        if (response.ok) {
          await fetchPosts();
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    setAgentStatus('Autonomous generation complete!');
    setGenerating(false);
    setTimeout(() => setAgentStatus(''), 3000);
  };

  const handlePublish = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}/publish`, { method: 'POST' });
      await fetchPosts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      await fetchPosts();
      if (selectedPost?.id === id) setSelectedPost(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            AI Blog Agent
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Autonomous AI-powered blog content generation for your business
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Business Context</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={businessContext.industry}
                    onChange={(e) => setBusinessContext({...businessContext, industry: e.target.value})}
                    placeholder="e.g., Technology, Healthcare, Finance"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={businessContext.targetAudience}
                    onChange={(e) => setBusinessContext({...businessContext, targetAudience: e.target.value})}
                    placeholder="e.g., Small business owners, Developers"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={businessContext.keywords}
                    onChange={(e) => setBusinessContext({...businessContext, keywords: e.target.value})}
                    placeholder="e.g., AI, automation, productivity"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Tone
                  </label>
                  <select
                    value={businessContext.tone}
                    onChange={(e) => setBusinessContext({...businessContext, tone: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="technical">Technical</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleGenerateBlog}
                    disabled={generating}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {generating ? 'Generating...' : 'Generate Single Blog'}
                  </button>

                  <button
                    onClick={handleAutoGenerate}
                    disabled={generating}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {generating ? 'Generating...' : 'Auto-Generate 3 Blogs'}
                  </button>
                </div>

                {agentStatus && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                      {agentStatus}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Generated Blog Posts</h2>

              {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg">No blog posts yet. Configure your business context and generate your first post!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex-1">
                          {post.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {post.status}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {post.summary}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.keywords.map((keyword, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <div className="space-x-2">
                          {post.status === 'draft' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePublish(post.id);
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(post.id);
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedPost && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedPost(null)}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedPost.title}</h2>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    {selectedPost.content.split('\n\n').map((para, i) => (
                      <p key={i} className="mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
