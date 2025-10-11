// app.js
import { fetchProducts } from './data.js';
import { renderProducts, openProductModal } from './ui.js';

const productGrid = document.getElementById('product-grid');
const modal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const yearEl = document.getElementById('year');
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

yearEl && (yearEl.textContent = new Date().getFullYear());

// menu toggle for small screens
if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', (!expanded).toString());
        menu.style.display = expanded ? 'none' : 'flex';
    });
}

async function initProductsPage() {
    if (!productGrid) return;
    try {
        const products = await fetchProducts();
        // localStorage favorites
        const favorites = new Set(JSON.parse(localStorage.getItem('noirelle-favs') || '[]'));

        function updateRender(filtered = products) {
            renderProducts(filtered, productGrid, handleDetails, favorites);
            attachFavoriteHandlers();
        }

        function attachFavoriteHandlers() {
            productGrid.querySelectorAll('.favorite').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = btn.dataset.id;
                    if (favorites.has(id)) {
                        favorites.delete(id);
                    } else {
                        favorites.add(id);
                    }
                    localStorage.setItem('noirelle-favs', JSON.stringify(Array.from(favorites)));
                    updateRender(currentFiltered);
                });
            });
        }

        function handleDetails(id) {
            const p = products.find(x => x.id === id);
            if (p) openProductModal(p, modal);
        }

        // filtering & sorting controls (if present)
        let currentFiltered = products.slice();
        const catSel = document.getElementById('filter-category');
        const sortSel = document.getElementById('sort-by');

        if (catSel) catSel.addEventListener('change', () => {
            const cat = catSel.value;
            currentFiltered = cat === 'all' ? products.slice() : products.filter(p => p.category === cat);
            applySort();
            updateRender(currentFiltered);
        });

        if (sortSel) sortSel.addEventListener('change', () => {
            applySort();
            updateRender(currentFiltered);
        });

        function applySort() {
            const val = sortSel ? sortSel.value : 'featured';
            if (val === 'price-asc') currentFiltered.sort((a, b) => a.price - b.price);
            else if (val === 'price-desc') currentFiltered.sort((a, b) => b.price - a.price);
            else currentFiltered.sort((a, b) => products.indexOf(a) - products.indexOf(b));
        }

        applySort();
        updateRender(currentFiltered);

        // modal close
        if (modal) {
            modalClose && modalClose.addEventListener('click', () => modal.close());
            modal.addEventListener('cancel', () => modal.close());
        }
    } catch (err) {
        console.error(err);
        if (productGrid) productGrid.innerHTML = `<p class="error">Unable to load products at this time.</p>`;
    }
}

// Initialize product page only if product-grid exists
initProductsPage();
