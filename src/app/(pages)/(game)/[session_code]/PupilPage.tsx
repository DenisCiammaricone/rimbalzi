import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';
import { PupilLogIn } from './PupilLogIn';
import { Game } from './Game';



export function PupilPage({ session_code }: { session_code: string }) {
    const [content, setContent] = useState(<></>);
    let pupilCode = Cookies.get('pupil_code');
    useEffect(() => {
        pupilCode = Cookies.get('pupil_code');
        console.log(pupilCode)
        if (!pupilCode) {
            setContent(<PupilLogIn session_code={session_code}></PupilLogIn>)
        } else {
            const fetchData = async () => {
                const response = await fetch('/api/game/verifyPupil', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        session_code: session_code,
                        pupil_code: pupilCode
                    })
                })
                if (response.status === 200) {
                    const session = await fetch('/api/game/sequence?session_code=' + session_code, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    if (session.status == 200) {
                        const sequence = await session.json();
                        setContent(<Game sequence={sequence.data} isMeasure={false} sessionCode={session_code} />)
                    }

                } else {
                    window.location.reload(); // TODO: Fallo in un modo nextjs con router
                }
            }
            fetchData()
        }
    }, []);

    return (
        <>{content}</>
    )
}