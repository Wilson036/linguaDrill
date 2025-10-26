// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json(
        { ok: false, error: 'NO_FILE' },
        { status: 400 }
      );
    }

    // ⬜ 基本驗證：型別 / 大小
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_FILE_TYPE' },
        { status: 400 }
      );
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: 'FILE_TOO_LARGE' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 產生檔名
    const ext = extname(file.name || '').toLowerCase() || '.bin';
    const id = crypto.randomUUID();
    const filename = `${id}${ext}`;

    // 寫入 public/uploads
    // ⬜ 確保你本機有建立 public/uploads 資料夾
    await writeFile(`public/uploads/${filename}`, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: 'UPLOAD_FAILED' },
      { status: 500 }
    );
  }
}
