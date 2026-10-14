import { NextResponse } from 'next/server';
var db = require('../../../lib/db');

export async function GET() {
  var projects = db.all('projects');
  projects.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });
  return NextResponse.json({ projects: projects });
}

export async function POST(request) {
  var body = await request.json();
  if (body._action === 'delete') { db.delete('projects', body.id); return NextResponse.json({ success: true }); }
  var tags = Array.isArray(body.tags) ? body.tags.join(',') : (body.tags || '');
  var project = db.insert('projects', {
    name: body.name, description: body.description || '', url: body.url || '',
    github: body.github || '', tags: tags, image: body.image || ''
  });
  return NextResponse.json({ id: project.id }, { status: 201 });
}


export async function PUT(request) {
  var body = await request.json();
  var tags = Array.isArray(body.tags) ? body.tags.join(',') : (body.tags || '');
  var updated = db.update('projects', body.id, {
    name: body.name, description: body.description || '', url: body.url || '',
    github: body.github || '', tags: tags, image: body.image || ''
  });
  if (!updated) return NextResponse.json({ error: '项目不存在' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  var body = await request.json();
  db.delete('projects', body.id);
  return NextResponse.json({ success: true });
}
