import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { v4 as uuidv4 } from 'uuid';

export interface User{
    id : string;
    email : string;
    role : 'admin' | 'user';
    apiKey : string;
    createdAt: string;
}

interface StaticApiKey {
    key: string;
    owner: string;
}

@Injectable()
export class AuthService {
    constructor(private readonly storage: StorageService) {}

    register(email: string): { apiKey: string } {
        const users = this.storage.read<User[]>('users.json');

        if (users.some((user) => user.email === email)){
            throw new ConflictException(`Email ${email} is already registered`)
        }

        const newUser: User = {
            id: uuidv4(),
            email,
            role: 'user',
            apiKey: uuidv4(),
            createdAt: new Date().toISOString(),
        };

        this.storage.write('users.json', [...users, newUser]);

        return {apiKey : newUser.apiKey}
    }

    getMe(apiKey: string) {
        const users = this.storage.read<User[]>('users.json');

        let target = users.find((user) => user.apiKey === apiKey);
        if (!target) {
            throw new NotFoundException(`API-Key ${apiKey} was not found.`);
        }

        return target;
    }

    regenerateKey(apiKey: string): { apiKey: string } { 
        const users = this.storage.read<User[]>('users.json');

        const target = users.find((user) => user.apiKey === apiKey);
        if (!target) {
            throw new NotFoundException(`API-Key ${apiKey} was not found.`);
        }

        target!.apiKey = uuidv4();
        let usersUpdated = users.filter((user) => user.apiKey !== apiKey);

        this.storage.write('users.json', [...usersUpdated, target]);

        return { apiKey: target.apiKey };
    }
    

    deleteAccount(apiKey: string): { message: string } {
        const users = this.storage.read<User[]>('users.json');
        let target = users.find((user) => user.apiKey === apiKey);
        let usersUpdated = users.filter((user) => user.apiKey !== apiKey);
        this.storage.write('users.json', usersUpdated);

        return { message: `L'utilisateur ${target?.email} a été supprimé.`};
    }

    findByApiKey(apiKey: string): User | undefined {
        const users = this.storage.read<User[]>('users.json');
        const user = users.find((user) => user.apiKey === apiKey);
        if (user) return user;

        const staticKeys = this.storage.read<StaticApiKey[]>('api-keys.json');
        const staticKey = staticKeys.find((entry) => entry.key === apiKey);
        if (staticKey) {
            return {
                id: staticKey.key,
                email: staticKey.owner,
                role: 'admin',
                apiKey: staticKey.key,
                createdAt: new Date(0).toISOString(),
            };
        }

        return undefined;
    }
}
