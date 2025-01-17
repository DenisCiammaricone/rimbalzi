import { loginUser } from '@/app/lib/auth/login'
import jwt from 'jsonwebtoken';

export async function POST(request: Request): Promise<Response> {
    const { email, password } = await request.json();

    const user = await loginUser(email, password);
    if (user === null) {
        return new Response('Invalid Username or Password', { status: 401 })
    }

    // Generate JWT
    const token = jwt.sign(
        { id: user.id, username: user.name },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );

    return new Response(token, { status: 200 });
}

