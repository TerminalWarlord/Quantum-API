

export function debouncer(fn: (...args: any[]) => void, delay: number = 300) {
    let timer: any;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay)
    }
}