import { signIn } from '@/auth';

export default function LoginPage() {
    return (
            <div id="login-register-formBox" className='flex flex-col gap-5 2xl:w-1/6 xl:w-1/4 lg:w-1/4 md:w-1/3 sm:w-full mx-auto p-5 mt-20 '>
                <h1 className="mx-auto">Login</h1>
                <form className="flex flex-col gap-2 mx-auto" action={async (formData) => {
                    "use server"
                    await signIn("credentials", formData);
                }}>
                    <div>
                        <input id="email" name="email" type="email" placeholder="Email" />
                    </div>
                    <div>
                        <input id="password" name="password" type="password" placeholder="Password" />
                    </div>
                    <button type="submit">Login</button>
                </form>

                <hr></hr>
                <div className='mx-auto'>Non hai un account? <a className="link" href='/register'><i>Registrati ora!</i></a></div>
            </div >
    );
};
