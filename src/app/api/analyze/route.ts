import { NextRequest, NextResponse } from 'next/server';
import { analyzeStories } from '@/lib/groq';

export async function POST(req: NextRequest) {
    try {
        const { past, present, future } = await req.json();

        if (!past || !present || !future) {
            return NextResponse.json({ error: 'Missing required stories' }, { status: 400 });
        }

        const analysis = await analyzeStories(past, present, future);
        return NextResponse.json(analysis);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('API Error:', error);
        return NextResponse.json({ error: message || 'Internal Server Error' }, { status: 500 });
    }
}
