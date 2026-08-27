
export type Role  =  'HOST' | 'MODERATOR' | 'PARTICIPANT';

export interface Participant {
    userId: string;
    username: string;
    role: Role;
}

export interface Room {
    roomId: string;
    hostId: string | null;
    participants: Map<string, Participant>;
    state: {
        videoId: string | null;
        currentTime: number;
        playbackState: 'PLAYING' | 'PAUSED';
    }
}