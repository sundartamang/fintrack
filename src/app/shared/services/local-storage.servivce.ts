import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

    saveToLocalStorage(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error saving data to LocalStorage', error);
        }
    }

    getFromLocalStorage<T>(key: string): T | null {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) as T : null;
        } catch (error) {
            console.error('Error loading data from LocalStorage', error);
            return null;
        }
    }

    saveToLocalStorageWithExpiry(key: string, value: any, ttlInMs: number): void {
        const item = {
            value,
            expiry: Date.now() + ttlInMs
        };

        localStorage.setItem(key, JSON.stringify(item));
    }

    getFromLocalStorageWithExpiry<T>(key: string): T | null {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);

            // Check if expired
            if (Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }

            return item.value as T;

        } catch (error) {
            console.error('Error reading LocalStorage with expiry', error);
            return null;
        }
    }

    deleteFromLocalStorage(key: string): void {
        localStorage.removeItem(key);
    }

    clearLocalStorage(): void {
        localStorage.clear();
    }
}
