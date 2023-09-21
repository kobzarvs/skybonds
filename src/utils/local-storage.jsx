export function loadLsItem(key, defaultValue) {
    try {
        const value = localStorage.getItem(key);
        if (!value) return defaultValue;
        return JSON.parse(value);
    } catch (e) {
        return defaultValue;
    }
}

export function saveLsItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(e);
    }
}
