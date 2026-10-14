import { NextResponse } from 'next/server';
var db = require('../../../lib/db');

function parseFrontMatter(text) {
  var result = { title: '', date: '', tags: [], categories: '', content: text };
  var match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    // No front matter, use first heading as title
    var h1 = text.match(/^#\s+(.+)/m);
    if (h1) result.title = h1[1].trim();
    return result;
  }
  var fm = match[1];
  result.content = match[2];

  var lines = fm.split('\n');
  var currentKey = '';
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    var kv = line.match(/^(\w+):\s*(.*)/);
    if (kv) {
      currentKey = kv[1].toLowerCase();
      var val = kv[2].trim();
      // Remove surrounding quotes
      val = val.replace(/^["']|["']$/g, '');
      if (currentKey === 'title' && !result.title) result.title = val;
      else if (currentKey === 'date' && !result.date) result.date = val;
      else if (currentKey === 'categories') result.categories = val;
      else if (currentKey === 'tags') {
        // Handle inline array: [a, b, c]
        var arrMatch = val.match(/^\[(.*)\]$/);
        if (arrMatch) {
          result.tags = arrMatch[1].split(',').map(function(s) { return s.trim().replace(/^["']|["']$/g, ''); }).filter(Boolean);
        } else {
          result.tags = [val];
        }
      }
    } else if (currentKey === 'tags') {
      // YAML list item: - tag
      var item = line.match(/^-\s+(.+)/);
      if (item) result.tags.push(item[1].trim().replace(/^["']|["']$/g, ''));
    }
  }

  // Fallback title from first heading
  if (!result.title) {
    var h1 = result.content.match(/^#\s+(.+)/m);
    if (h1) result.title = h1[1].trim();
  }

  return result;
}

export async function POST(request) {
  try {
    var fd = await request.formData();
    var file = fd.get('file');
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    var text = await file.text();
    if (!text.trim()) return NextResponse.json({ error: 'Empty file' }, { status: 400 });

    var parsed = parseFrontMatter(text);
    var title = parsed.title || file.name.replace(/\.md$/, '');
    var slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u4e00-\u9fff-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!slug) slug = 'import-' + Date.now();

    // Check for duplicate slug
    var existing = db.findBy('posts', 'slug', slug);
    if (existing) slug = slug + '-' + Date.now().toString(36);

    var post = db.insert('posts', {
      title: title,
      slug: slug,
      description: parsed.content.substring(0, 200).replace(/[#*`\n\r]/g, ' ').trim(),
      content: parsed.content,
      cover: '',
      status: fd.get('publish') ? 'published' : 'draft',
      view_count: 0
    });

    // Add tags
    var tags = parsed.tags || [];
    tags.forEach(function(tagName) {
      var tagSlug = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u4e00-\u9fff]/g, '');
      if (!tagSlug) return;
      var tag = db.findBy('tags', 'slug', tagSlug);
      if (!tag) tag = db.insert('tags', { name: tagName, slug: tagSlug });
      db.insert('post_tags', { post_id: post.id, tag_id: tag.id });
    });

    return NextResponse.json({ id: post.id, slug: post.slug, title: post.title, tags: tags }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Import failed: ' + e.message }, { status: 500 });
  }
}
