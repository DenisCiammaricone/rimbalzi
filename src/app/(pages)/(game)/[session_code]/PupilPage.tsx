import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';
import { PupilLogIn } from './PupilLogIn';
import { Game } from './Game';



export function PupilPage({ session_code }: { session_code: string }) {
    const [content, setContent] = useState(<></>);
    let pupilCode = Cookies.get('pupil_code');
    let isMeasure = false;

    useEffect(() => {
        pupilCode = Cookies.get('pupil_code');

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
                    const isMeasureCheck = await fetch('/api/game/isMeasure?session_code=' + session_code, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })

                    if(isMeasureCheck.status === 200) {
                        const isMeasureData = await isMeasureCheck.json();
                        isMeasure = isMeasureData.data;
                    }

                    const session = await fetch('/api/game/sequence?session_code=' + session_code, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })

                    if (session.status === 200) {
                        const sequence = await session.json();
                        
                        setContent(<Game sequence={sequence.data} isMeasure={isMeasure} sessionCode={session_code} />)
                    } else if (session.status === 400) {
                        // Sessione non iniziata
                        const session_data = await session.json();
                        
                        if(session_data.session_state) {
                            if(session_data.session_state === 'waiting') {
                                setContent(<p>Sessione non iniziata... Riavvia la pagina quando te lo dice il docente</p>)
                            } else if(session_data.session_state === 'finished') {
                                setContent(<p>Sessione già terminata</p>)
                            }
                        }
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