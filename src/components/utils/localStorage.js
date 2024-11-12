// localStorage.js

/**
 * Set a value in localStorage.
 * @param {string} key - The key under which the value will be stored.
 * @param {any} value - The value to store. It will be stringified.
 */
export const setData = (key, value) => {
    try {
        const stringValue = JSON.stringify(value);
        localStorage.setItem(key, stringValue);
    } catch (error) {
        console.error('Error setting item in localStorage:', error);
    }
};

/**
 * Get a value from localStorage.
 * @param {string} key - The key of the value to retrieve.
 * @returns {any} - The parsed value from localStorage or null if the key does not exist.
 */
export const getData = (key) => {
    try {
        const stringValue = localStorage.getItem(key);
        return stringValue ? JSON.parse(stringValue) : null;
    } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return null;
    }
};

/**
 * Remove a value from localStorage.
 * @param {string} key - The key of the value to remove.
 */
export const removeData = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing item from localStorage:', error);
    }
};
