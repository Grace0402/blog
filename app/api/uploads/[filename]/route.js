import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export var dynamic = 'force-dynamic';

var MIME = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
  mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg',
};

export async function GET(request, _ref) {
  var params = _ref.params;
  var filename = params.filename;
  var filepath = join(process.cwd(), 'public', 'uploads', filename);
  if (!existsSync(filepath)) {
    return new NextResponse('Not found', { status: 404 });
  }
  try {
    var buf = await readFile(filepath);
    var ext = filename.split('.').pop().toLowerCase();
    var mime = MIME[ext] || 'application/octet-stream';
    return new NextResponse(buf, { headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=86400' } });
  } catch (e) {
    return new NextResponse('Error', { status: 500 });
  }
}
