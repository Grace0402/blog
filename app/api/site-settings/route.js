import { NextResponse } from 'next/server';

export var dynamic = 'force-dynamic';
var db = require('../../../lib/db');

export async function GET() {
  try {
    var settings = db.findBy('settings', 'id', 'site') || {
      avatar: '', name: 'My Blog', bio: '',
      github: '', email: '', intro: ''
    };
    return NextResponse.json({ settings: settings });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    var body = await request.json();
    var existing = db.findBy('settings', 'id', 'site');
    if (existing) {
      db.update('settings', 'site', body);
    } else {
      body.id = 'site';
      db.insert('settings', body);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
