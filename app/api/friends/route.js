import { NextResponse } from 'next/server';
var db = require('../../../lib/db');

export async function GET() {
  var friends = db.all('friends');
  return NextResponse.json({ friends: friends });
}

export async function POST(request) {
  var body = await request.json();
  var friend = db.insert('friends', {
    name: body.name, url: body.url, avatar: body.avatar || '', description: body.description || ''
  });
  return NextResponse.json({ id: friend.id }, { status: 201 });
}

export async function DELETE(request) {
  var body = await request.json();
  db.delete('friends', body.id);
  return NextResponse.json({ success: true });
}
