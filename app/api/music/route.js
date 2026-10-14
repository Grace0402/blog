import { NextResponse } from 'next/server';
var db = require('../../../lib/db');

export async function GET() {
  var tracks = db.all('music');
  tracks.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });
  return NextResponse.json({ tracks: tracks });
}

export async function POST(request) {
  var body = await request.json();
  var track = db.insert('music', {
    title: body.title, artist: body.artist || '', file_path: body.file_path,
    lyrics: body.lyrics || '', playlist: body.playlist || 'default', cover: body.cover || ''
  });
  return NextResponse.json({ id: track.id }, { status: 201 });
}

export async function DELETE(request) {
  var body = await request.json();
  db.delete('music', body.id);
  return NextResponse.json({ success: true });
}
