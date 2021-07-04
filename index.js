import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';

export class Config {
    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error(`want: string, got: ${typeof name}`);
        }
        this.name = name;
        this.home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
        this._mkdir(this.home);
        this._createConfigFile(this.home, name);
        const conf = JSON.parse(readFileSync(`${this.home}/.config/${name}.json`, 'utf-8'));
        Object.assign(this, conf);
    }
    _mkdir(home) {
        try {
            readdirSync(`${home}/.config`);
        } catch {
            mkdirSync(`${home}/.config`);
        }
    }
    _createConfigFile(home, name) {
        try {
            statSync(`${home}/.config/${name}.json`);
        } catch {
            writeFileSync(`${home}/.config/${name}.json`, '{}');
        }
    }
    /**
     * @param {string} key key
     * @return {unknown}
     */
    get(key) {
        const conf = JSON.parse(readFileSync(`${this.home}/.config/${this.name}.json`, 'utf-8'));
        Object.assign(this, conf);
        return this[key];
    }
    /**
     * @param {string} key key
     * @param {unknown} value value
     */
    set(key, value) {
        const conf = JSON.parse(readFileSync(`${this.home}/.config/${this.name}.json`, 'utf-8'));
        if (value === void 0) {
            delete conf[key];
            delete this[key];
        } else {
            conf[key] = value;
            Object.assign(this, conf);
        }
        writeFileSync(`${this.home}/.config/${this.name}.json`, JSON.stringify(conf, void 0, 4));
    }
    delete(key) {
        this.set(key, void 0);
    }
}
