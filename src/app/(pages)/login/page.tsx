import { signIn } from '@/auth';

export default function LoginPage() {
    return (
        <div>
            <h1>Login page</h1>
            <form action={async (formData) => {
                "use server"
                await signIn("credentials", formData);
            }}>
                <div>
                    
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" placeholder="Name" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="Email" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div >
    );
};
