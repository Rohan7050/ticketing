import {scrypt, randomBytes} from 'crypto';
import { promisify } from 'util';

const scryptAsunc = promisify(scrypt);

export class Password {
    static async toHash(password: string): Promise<string> {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsunc(password, salt, 64)) as Buffer;  
        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPasswort: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPasswort.split('.');
        const buf = (await scryptAsunc(suppliedPassword, salt, 64)) as Buffer;  
        return buf.toString('hex') === hashedPassword;
    }
}
