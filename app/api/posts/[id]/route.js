﻿import { NextResponse } from 'next/server';
var db = require('../../../../lib/db');

export async function GET(request, context) {
  var params = context.params;
  try {
    var id = params.id;
    var post = db.findBy('posts', 'slug', id) || db.get('posts', id);
    if (!post) return NextResponse.json({ error: '文章不存在' }, { status: 404 });

    var pt = db.filter('post_tags', function(x) { return x.post_id === post.id; });
    var tagIds = pt.map(function(x) { return x.tag_id; });
    var tags = db.filter('tags', function(t) { return tagIds.indexOf(t.id) !== -1; });
    post.tags = tags.map(function(t) { return t.name; });
    post.formattedDate = post.created_at ? post.created_at.split('T')[0].replace(/-/g, '.') : '';

    if (post.status === 'published') {
      db.update('posts', post.id, { view_count: (post.view_count || 0) + 1 });
      post.view_count = (post.view_count || 0) + 1;
    }

    var comments = db.filter('comments', function(c) { return c.post_id === post.id; });
    comments.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });
    var likeCount = db.count('likes', function(l) { return l.post_id === post.id; });

    var allPosts = db.filter('posts', function(p) { return p.status === 'published'; });
    allPosts.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });
    var idx = allPosts.findIndex(function(p) { return p.id === post.id; });
    var prev = idx > 0 ? { slug: allPosts[idx - 1].slug, title: allPosts[idx - 1].title } : null;
    var next = idx < allPosts.length - 1 ? { slug: allPosts[idx + 1].slug, title: allPosts[idx + 1].title } : null;

    return NextResponse.json({ post: post, comments: comments, likes: likeCount, prev: prev, next: next });
  } catch (e) {
    return NextResponse.json({ error: '获取失败', detail: e.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  var params = context.params;
  try {
    var body = await request.json();
    var id = params.id;
    var post = db.get('posts', id) || db.findBy('posts', 'slug', id);
    if (!post) return NextResponse.json({ error: '文章不存在' }, { status: 404 });

    var up = {
      title: body.title || post.title,
      description: body.description !== undefined ? body.description : post.description,
      content: body.content !== undefined ? body.content : post.content,
      cover: body.cover !== undefined ? body.cover : post.cover,
      status: body.status || post.status
    };
    if (body.status === 'published' && post.status !== 'published') up.created_at = new Date().toISOString();
    db.update('posts', post.id, up);

    if (body.tags) {
      var existingPT = db.filter('post_tags', function(x) { return x.post_id === post.id; });
      existingPT.forEach(function(pt) { db.delete('post_tags', pt.id); });
      body.tags.forEach(function(tagName) {
        var tagSlug = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-\u4e00-\u9fff]/g, '');
        var tag = db.findBy('tags', 'slug', tagSlug);
        if (!tag) tag = db.insert('tags', { name: tagName, slug: tagSlug });
        db.insert('post_tags', { post_id: post.id, tag_id: tag.id });
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: '更新失败', detail: e.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  var params = context.params;
  try {
    var id = params.id;
    var post = db.get('posts', id) || db.findBy('posts', 'slug', id);
    if (!post) return NextResponse.json({ error: '文章不存在' }, { status: 404 });

    var pts = db.filter('post_tags', function(x) { return x.post_id === post.id; });
    var affectedTagIds = pts.map(function(pt) { return pt.tag_id; });
    pts.forEach(function(pt) { db.delete('post_tags', pt.id); });
    affectedTagIds.forEach(function(tagId) {
      var count = db.count('post_tags', function(pt) { return pt.tag_id === tagId; });
      if (count === 0) db.delete('tags', tagId);
    });
    var comments = db.filter('comments', function(c) { return c.post_id === post.id; });
    comments.forEach(function(c) { db.delete('comments', c.id); });
    var likes = db.filter('likes', function(l) { return l.post_id === post.id; });
    likes.forEach(function(l) { db.delete('likes', l.id); });
    db.delete('posts', post.id);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: '删除失败', detail: e.message }, { status: 500 });
  }
}