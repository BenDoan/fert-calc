import { writable } from 'svelte/store';

const files = writable({});
const isValidated = writable(false);

export { files, isValidated };
