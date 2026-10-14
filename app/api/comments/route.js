import { NextResponse } from 'next/server';
var db = require('../../../lib/db');

export async function GET(request) {
  try {
    var url = new URL(request.url);
    var postId = url.searchParams.get('post_id');
    if (!postId) return NextResponse.json({ error: 'post_id required' }, { status: 400 });
    var comments = db.filter('comments', function(c) { return c.post_id == postId; });
    comments.sort(function(a, b) { return new Date(a.created_at || 0) - new Date(b.created_at || 0); });
    return NextResponse.json({ comments: comments });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    var body = await request.json();
    if (!body.post_id || !body.author || !body.content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    var ip = request.headers.get('x-forwarded-for') || '';
    var comment = db.insert('comments', {
      post_id: body.post_id,
      parent_id: body.parent_id || null,
      author: body.author,
      email: body.email || '',
      content: body.content,
      ip: ip
    });
    return NextResponse.json({ id: comment.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
