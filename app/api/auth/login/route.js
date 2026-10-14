import { NextResponse } from 'next/server';
var _auth = require('../../../../lib/auth');
var generateToken = _auth.generateToken;
var comparePassword = _auth.comparePassword;
var getAdmin = _auth.getAdmin;

export async function POST(request) {
  try {
    var body = await request.json();
    var admin = getAdmin();
    if (!admin || admin.username !== body.username) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    if (!comparePassword(body.password, admin.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    var token = generateToken(admin);
    var response = NextResponse.json({ token: token, username: admin.username });
    response.cookies.set('admin-token', token, { httpOnly: true, path: '/', maxAge: 604800, sameSite: 'lax' });
    return response;
  } catch (e) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
