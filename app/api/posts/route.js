import { NextResponse } from 'next/server';
var db = require('../../../lib/db');

export async function GET(request) {
  try {
    var url = new URL(request.url);
    var page = parseInt(url.searchParams.get('page') || '1');
    var limit = parseInt(url.searchParams.get('limit') || '10');
    var tagFilter = url.searchParams.get('tag') || '';
    var search = url.searchParams.get('search') || '';
    var all = url.searchParams.get('all') || '';

    var posts = db.all('posts');

    // Only filter by status if 'all' is not set
    if (!all) {
      posts = posts.filter(function(p) { return p.status === 'published'; });
    }

    if (tagFilter) {
      var tagSlugs = db.filter('tags', function(t) { return t.slug === tagFilter; });
      var tagIds = tagSlugs.map(function(t) { return t.id; });
      var postIds = db.filter('post_tags', function(pt) { return tagIds.indexOf(pt.tag_id) !== -1; }).map(function(pt) { return pt.post_id; });
      posts = posts.filter(function(p) { return postIds.indexOf(p.id) !== -1; });
    }

    if (search) {
      var s = search.toLowerCase();
      posts = posts.filter(function(p) {
        return (p.title && p.title.toLowerCase().indexOf(s) !== -1) || (p.description && p.description.toLowerCase().indexOf(s) !== -1);
      });
    }

    posts.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });

    var total = posts.length;
    var start = (page - 1) * limit;
    posts = posts.slice(start, start + limit);

    posts = posts.map(function(p) {
      var pt = db.filter('post_tags', function(x) { return x.post_id === p.id; });
      var tagIds = pt.map(function(x) { return x.tag_id; });
      var tags = db.filter('tags', function(t) { return tagIds.indexOf(t.id) !== -1; });
      p.tags = tags.map(function(t) { return t.name; });
      p.formattedDate = p.created_at ? p.created_at.split('T')[0].replace(/-/g, '.') : '';
      return p;
    });

    return NextResponse.json({ posts: posts, total: total, page: page, totalPages: Math.ceil(total / limit) });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch posts', detail: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    var body = await request.json();
    var slug = body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-\u4e00-\u9fff]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!slug) slug = 'post-' + Date.now();

    var existing = db.findBy('posts', 'slug', slug);
    if (existing) return NextResponse.json({ error: '别名为 ' + slug + ' 的文章已存在' }, { status: 400 });

    var post = db.insert('posts', {
      title: body.title,
      slug: slug,
      description: body.description || '',
      content: body.content || '',
      cover: body.cover || '',
      status: body.status || 'draft',
      view_count: 0
    });

    var tags = body.tags || [];
    tags.forEach(function(tagName) {
      var tagSlug = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-\u4e00-\u9fff]/g, '');
      var tag = db.findBy('tags', 'slug', tagSlug);
      if (!tag) tag = db.insert('tags', { name: tagName, slug: tagSlug });
      db.insert('post_tags', { post_id: post.id, tag_id: tag.id });
    });

    return NextResponse.json({ id: post.id, slug: post.slug }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: '创建失败', detail: e.message }, { status: 500 });
  }
}
