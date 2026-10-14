import { NextResponse } from 'next/server';

export var dynamic = 'force-dynamic';
var db = require('../../../lib/db');

export async function GET() {
  var postCount = db.count('posts', function(p) { return p.status === 'published'; });
  var tagCount = db.count('tags');
  var commentCount = db.count('comments');
  var admin = db.all('users')[0];
  var startDate = admin ? admin.created_at : null;
  var daysRunning = startDate ? Math.ceil((Date.now() - new Date(startDate).getTime()) / (1000*60*60*24)) : 0;
  return NextResponse.json({ postCount: postCount, tagCount: tagCount, commentCount: commentCount, daysRunning: daysRunning });
}
