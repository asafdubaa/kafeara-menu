import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Force this route to be dynamic

// Define the path to your JSON file
const menuFilePath = path.join(process.cwd(), 'data', 'menu-data.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(menuFilePath, 'utf8');
    const menuData = JSON.parse(fileContents);
    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Error reading menu data:', error);
    return NextResponse.json({ error: 'Failed to read menu data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const menuData = await request.json();
    await fs.writeFile(menuFilePath, JSON.stringify(menuData, null, 2), 'utf8');
    return NextResponse.json({ message: 'Menu data updated successfully' });
  } catch (error) {
    console.error('Error writing menu data:', error);
    return NextResponse.json({ error: 'Failed to update menu data' }, { status: 500 });
  }
} 