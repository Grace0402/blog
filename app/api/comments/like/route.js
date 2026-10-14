import { NextResponse } from 'next/server';
var db = require('../../../../lib/db');

export async function POST(request) {
  try {
    var body = await request.json();
    var ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    var existing = db.filter('likes', function(l) { return l.post_id == body.post_id && l.ip === ip; });
    if (existing.length > 0) {
      existing.forEach(function(l) { db.delete('likes', l.id); });
      var count = db.count('likes', function(l) { return l.post_id == body.post_id; });
      return NextResponse.json({ liked: false, likes: count });
    } else {
      db.insert('likes', { post_id: body.post_id, ip: ip });
      var count2 = db.count('likes', function(l) { return l.post_id == body.post_id; });
      return NextResponse.json({ liked: true, likes: count2 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
