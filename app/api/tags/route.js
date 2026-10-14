import { NextResponse } from 'next/server';

export var dynamic = 'force-dynamic';
var db = require('../../../lib/db');

export async function GET() {
  var tags = db.all('tags');
  var result = tags.map(function(t) {
    t.post_count = db.count('post_tags', function(pt) { return pt.tag_id === t.id; });
    return t;
  });
  result.sort(function(a, b) { return b.post_count - a.post_count; });
  return NextResponse.json({ tags: result });
}
