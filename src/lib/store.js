import { writable } from 'svelte/store';

const files = writable({});
const year = writable(new Date().getFullYear() - 2);
const isValidated = writable(false);

export { files, year, isValidated };
