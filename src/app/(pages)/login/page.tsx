'use client'

import { useState } from 'react';
import { loginUser } from '@/app/lib/auth/login';
import axios from 'axios';



export default function LoginPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [error, setError] = useState(null);


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            // Handle successful login
        } catch (err) {
            //setError('Invalid credentials');
        }
    };

    return (
        <div>
            <h1>Login page</h1>
            <form onSubmit={handleSubmit} method="POST">
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div >
    );
};
