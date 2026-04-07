import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'leads.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const lead = {
      id: Date.now().toString(),
      name: body.name,
      phone: body.mobile,
      city: body.city,
      kw: body.kw || '',
      type: 'quick-lead',
      createdAt: body.createdAt || new Date().toISOString(),
      read: false,
    };

    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let existingData: unknown[] = [];
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    }

    existingData.push(lead);
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to save lead' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      return NextResponse.json(JSON.parse(fileContent));
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error reading leads:', error);
    return NextResponse.json({ error: 'Failed to read leads' }, { status: 500 });
  }
}