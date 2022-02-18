import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';

export class Config {
    /**
     * @param {string} name
     * @param {object} defaultConfig
     */
    constructor(name, defaultConfig = {}) {
        if (!name || typeof name !== 'string') {
            throw new Error(`want: string, got: ${typeof name}`);
        }
        this.name = name;
        this.home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
        this._mkdir(this.home);
        this._createConfigFile(defaultConfig);
        const conf = this._read();
        Object.assign(this, conf);
    }
    _mkdir() {
        try {
            readdirSync(`${this.home}/.config`);
        } catch {
            mkdirSync(`${this.home}/.config`);
        }
    }
    _createConfigFile(defaultConfig = {}) {
        try {
            statSync(`${this.home}/.config/${this.name}.json`);
        } catch {
            writeFileSync(`${this.home}/.config/${this.name}.json`, JSON.stringify(defaultConfig, void 0, 4) || '{}');
        }
    }
    _read() {
        return JSON.parse(readFileSync(`${this.home}/.config/${this.name}.json`, 'utf-8'));
    }
    /**
     * @param {string} key key
     * @return {unknown}
     */
    get(key) {
        const conf = this._read();
        Object.assign(this, conf);
        return this[key];
    }
    /**
     * @param {string} key key
     * @param {unknown} value value
     */
    set(key, value) {
        const conf = this._read();
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
