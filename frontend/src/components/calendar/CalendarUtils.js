export function computeColor(num_val) {
    return `hsla(${(num_val * 13) % 255}, ${84}%, ${55}%, ${0.95})`;
}