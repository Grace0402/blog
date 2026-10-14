import { NextResponse } from 'next/server';
var db = require('../../../lib/db');

export async function GET(request) {
  try {
    var url = new URL(request.url);
    var id = url.searchParams.get('id');
    var all = url.searchParams.get('all');

    if (all === '1') {
      // Bulk export - return JSON list for download page
      var posts = db.filter('posts', function(p) { return p.status === 'published'; });
      posts.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });
      posts = posts.map(function(p) {
        var tags = db.filter('post_tags', function(pt) { return pt.post_id === p.id; });
        var tagIds = tags.map(function(t) { return t.tag_id; });
        var tagNames = db.filter('tags', function(t) { return tagIds.indexOf(t.id) !== -1; }).map(function(t) { return t.name; });
        return { id: p.id, title: p.title, slug: p.slug, date: p.created_at, tags: tagNames };
      });
      return NextResponse.json({ posts: posts });
    }

    if (id) {
      var post = db.findBy('posts', 'slug', id) || db.get('posts', id);
      if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      var pt = db.filter('post_tags', function(x) { return x.post_id === post.id; });
      var tagIds = pt.map(function(x) { return x.tag_id; });
      var tagNames = db.filter('tags', function(t) { return tagIds.indexOf(t.id) !== -1; }).map(function(t) { return t.name; });

      var date = post.created_at ? post.created_at.split('T')[0] : '';

      // Build Markdown with YAML front matter for CSDN import
      var yaml = '---\ntitle: "' + (post.title || '').replace(/"/g, '\\"') + '"\ndate: ' + date + '\ntags: [' + tagNames.join(', ') + ']\ncategories: ' + (tagNames[0] || '') + '\n---\n\n';
      var md = yaml + (post.content || '');

      return new NextResponse(md, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': 'attachment; filename="' + encodeURIComponent(post.slug || 'post') + '.md"'
        }
      });
    }

    return NextResponse.json({ error: 'Missing id or all parameter' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
