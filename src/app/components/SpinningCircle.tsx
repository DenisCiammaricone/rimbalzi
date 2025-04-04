export default function SpinningCircle() {
    return (
        <div className='flex min-h-screen justify-center items-center text-3xl font-bold'>
            <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    )
}