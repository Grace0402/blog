import { NextResponse } from 'next/server';
var db = require('../../../lib/db');

export async function GET() {
  var messages = db.all('chatter');
  messages.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });
  return NextResponse.json({ messages: messages.slice(0, 100) });
}

export async function POST(request) {
  var body = await request.json();
  if (!body.content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  var msg = db.insert('chatter', {
    author: body.author || '??',
    content: body.content,
    color: body.color != null ? body.color : 0,
    ip: request.headers.get('x-forwarded-for') || '',
    image: body.image || '',
    approved: true
  });
  return NextResponse.json({ id: msg.id }, { status: 201 });
}

export async function DELETE(request) {
  try {
    var body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    var ok = db.delete('chatter', body.id);
    return NextResponse.json({ success: ok });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
