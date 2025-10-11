// ui.js
export function formatPrice(p) { return `$${p.toFixed(2)}`; }

export function renderProducts(products, container, onDetailClick, favoritesSet) {
    container.innerHTML = '';
    products.forEach(prod => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" loading="lazy" width="400" height="300">
      <div class="card-body">
        <h3>${prod.name}</h3>
        <p class="muted">${prod.description}</p>
        <div class="meta">
          <span class="price">${formatPrice(prod.price)}</span>
        </div>
        <div style="margin-top:.6rem;display:flex;gap:.5rem;justify-content:flex-end">
          <button class="btn details" data-id="${prod.id}">Details</button>
          <button class="btn ${favoritesSet.has(prod.id) ? 'secondary' : ''} favorite" data-id="${prod.id}" aria-pressed="${favoritesSet.has(prod.id)}">
            ${favoritesSet.has(prod.id) ? 'Favorited' : 'Favorite'}
          </button>
        </div>
      </div>
    `;
        container.appendChild(card);
    });

    // attach listeners
    container.querySelectorAll('.details').forEach(btn => {
        btn.addEventListener('click', (e) => onDetailClick(e.target.dataset.id));
    });
}

export function openProductModal(product, dialogEl) {
    const html = `
    <h2>${product.name}</h2>
    <img src="${product.image}" alt="${product.name}" loading="lazy" style="width:100%;max-height:300px;object-fit:cover">
    <p>${product.description}</p>
    <p><strong>Price:</strong> ${formatPrice(product.price)} • <strong>SKU:</strong> ${product.sku}</p>
    <p><strong>Category:</strong> ${product.category}</p>
  `;
    document.getElementById('modal-content').innerHTML = html;
    if (typeof dialogEl.showModal === 'function') {
        dialogEl.showModal();
    } else {
        alert(`${product.name}\n\n${product.description}`);
    }
}
