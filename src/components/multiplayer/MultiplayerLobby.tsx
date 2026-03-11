import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../../lib/supabase';

export interface Player {
    id: string;
    nickname: string;
    score: number;
}

interface MultiplayerLobbyProps {
    onStartGame: (roomName: string, players: Player[]) => void;
    onBack: () => void;
}

export function MultiplayerLobby({ onStartGame, onBack }: MultiplayerLobbyProps) {
    const [roomName, setRoomName] = useState('');
    const [nickname, setNickname] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const playersRef = useRef<Player[]>([]);
    const playerId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

    useEffect(() => {
        playersRef.current = players;
    }, [players]);

    useEffect(() => {
        if (!isJoined) return;

        const channel = supabase.channel(`room:${roomName}`, {
            config: {
                presence: {
                    key: nickname,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const playersList = Object.values(state).flat() as unknown as Player[];
                setPlayers(playersList);
            })
            .on('presence', { event: 'join' }, ({ newPresences }: { newPresences: Player[] }) => {
                console.log('Nuevos jugadores:', newPresences);
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }: { leftPresences: Player[] }) => {
                console.log('Jugadores salieron:', leftPresences);
            })
            .on('broadcast', { event: 'game_start' }, () => {
                onStartGame(roomName, playersRef.current);
            })
            .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ id: playerId, nickname, score: 0 });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [isJoined, roomName, nickname, onStartGame, playerId]);

    const handleJoin = () => {
        if (roomName && nickname) {
            setIsJoined(true);
            localStorage.setItem('quiz_nickname', nickname);
        } else {
            alert('Por favor, ingresa el código de sala y tu apodo');
        }
    };

    const handleStartGame = async () => {
        const channel = supabase.channel(`room:${roomName}`);
        await channel.send({
            type: 'broadcast',
            event: 'game_start',
            payload: {},
        });
        onStartGame(roomName, playersRef.current);
    };

    if (!isJoined) {
        return (
            <div className="min-h-screen bg-math-mint flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100">
                    <div className="mb-8 text-center">
                        <div className="w-20 h-20 bg-math-teal/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-math-teal">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-2.123-7.708 9.337 9.337 0 0 0-4.604 1.102 4.124 4.124 0 0 0-4.041-.018 9.337 9.337 0 0 0-4.604-1.102 4.125 4.125 0 0 0-2.123 7.708 9.337 9.337 0 0 0 4.121.952 9.38 9.38 0 0 0 2.625-.372M9 10.128v2.927m0 0v4.54a9.337 9.337 0 0 0 4.871-1.459 9.337 9.337 0 0 0 4.871 1.459V13.055m-9.742-2.927A9.337 9.337 0 0 1 9 10.128m11.114-1.551c.366.19.742.346 1.126.467m-2.252-4.124a4.125 4.125 0 0 0-8.193 0m5.196 9.044a4.125 4.125 0 0 1-3.196-4.044 4.125 4.125 0 0 1 3.196-4.044 4.125 4.125 0 0 1 3.196 4.044 4.125 4.125 0 0 1-3.196 4.044Z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-math-dark-teal mb-3">Batalla en Vivo</h2>
                        <p className="text-math-slate font-medium">Compite en tiempo real con otros matemáticos.</p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Código de Sala (ej. MATE99)"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value.toUpperCase())}
                            className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-math-teal outline-none transition-all font-bold tracking-wider"
                        />
                        <input
                            type="text"
                            placeholder="Tu Apodo"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-math-teal outline-none transition-all font-bold"
                        />
                        <button
                            onClick={handleJoin}
                            className="btn-primary w-full py-5 text-lg"
                        >
                            Unirse al Lobby
                        </button>
                        <button onClick={onBack} className="w-full text-slate-400 font-bold hover:text-math-dark-teal transition-colors py-2 text-sm">
                            Volver al Menú
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-math-mint flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl w-full max-w-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-math-teal/5 rounded-full -mr-16 -mt-16" />

                <div className="relative">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-black text-math-dark-teal mb-2">Lobby de Batalla</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">En línea: {roomName}</span>
                            </div>
                        </div>
                        <div className="bg-math-teal/10 px-4 py-2 rounded-xl text-math-teal font-black text-sm">
                            {players.length} Jugadores
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {players.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-math-teal/30 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-math-teal">
                                    {p.nickname[0].toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-math-dark-teal">{p.nickname} {p.nickname === nickname && "(Tú)"}</div>
                                    <div className="text-[10px] font-black text-slate-300 uppercase">Listo para la acción</div>
                                </div>
                            </div>
                        ))}
                        {players.length < 2 && (
                            <div className="flex items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-100 col-span-1 sm:col-span-2">
                                <span className="text-slate-300 font-bold italic">Esperando a más contrincantes...</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleStartGame}
                            disabled={players.length < 1}
                            className="btn-primary flex-1 py-5 text-lg shadow-2xl shadow-math-teal/30 disabled:opacity-50 disabled:shadow-none"
                        >
                            Comenzar Partida
                        </button>
                        <button onClick={() => setIsJoined(false)} className="btn-secondary px-8">
                            Salir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
