// data.js
export async function fetchProducts(url = './data/products.json') {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('fetchProducts error:', err);
        throw err;
    }
}
