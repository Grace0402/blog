import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

export async function POST(request) {
  try {
    var fd = await request.formData();
    var file = fd.get('file');
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    var bytes = await file.arrayBuffer();
    var buf = Buffer.from(bytes);
    var ext = file.name.split('.').pop().toLowerCase();
    var name = crypto.randomBytes(12).toString('hex') + '.' + ext;
    var dir = join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, name), buf);
    return NextResponse.json({ url: '/api/uploads/' + name, name: file.name });
  } catch (e) { return NextResponse.json({ error: 'Upload failed' }, { status: 500 }); }
}
