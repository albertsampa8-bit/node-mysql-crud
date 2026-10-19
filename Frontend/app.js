// When this page is served by the Express server (localhost:3000, or a deployed
// URL) the API is on the same origin. When opened from another local port or
// straight from a file, point at the local server instead.
const isLocalDev = ['localhost', '127.0.0.1', ''].includes(location.hostname);
const API_BASE = isLocalDev && location.port !== '3000' ? 'http://localhost:3000' : '';
const API = API_BASE + '/api/products';

const form = document.getElementById('product-form');
const formPanel = document.getElementById('form-panel');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const statusEl = document.getElementById('status');
const rowsEl = document.getElementById('product-rows');
const countEl = document.getElementById('count');
const filterEl = document.getElementById('filter-category');
const idInput = document.getElementById('product-id');

const FIELDS = ['product_name', 'category', 'brand', 'key_spec', 'release_year', 'price'];
let products = [];

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = type || '';
}

async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed (' + res.status + ')');
  return data;
}

function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '';
  return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// READ: load every product, then redraw the table
async function loadProducts() {
  try {
    products = await request(API);
    renderFilter();
    renderTable();
  } catch (err) {
    setStatus('Could not load products. Is the server running? ' + err.message, 'error');
  }
}

function renderFilter() {
  const current = filterEl.value;
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
  filterEl.innerHTML = '';
  filterEl.add(new Option('All', ''));
  categories.forEach(c => filterEl.add(new Option(c, c)));
  filterEl.value = categories.includes(current) ? current : '';
}

function renderTable() {
  const selected = filterEl.value;
  const visible = selected ? products.filter(p => p.category === selected) : products;
  countEl.textContent = '(' + visible.length + ')';
  rowsEl.innerHTML = '';

  if (visible.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 7;
    td.className = 'empty';
    td.textContent = 'No products to show. Add one with the form.';
    tr.appendChild(td);
    rowsEl.appendChild(tr);
    return;
  }

  visible.forEach(p => {
    const tr = document.createElement('tr');
    if (String(p.id) === idInput.value) tr.className = 'being-edited';

    const cell = (text, cls) => {
      const td = document.createElement('td');
      td.textContent = text ?? '';
      if (cls) td.className = cls;
      return td;
    };
    tr.append(
      cell(p.product_name, 'name'),
      cell(p.category),
      cell(p.brand),
      cell(p.key_spec, 'spec'),
      cell(p.release_year, 'num'),
      cell(formatPrice(p.price), 'num')
    );

    const actions = document.createElement('td');
    actions.className = 'buttons';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn-secondary btn-small';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(p.id));
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn-danger btn-small';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteProduct(p));
    actions.append(editBtn, delBtn);
    tr.appendChild(actions);

    rowsEl.appendChild(tr);
  });
}

function resetForm() {
  form.reset();
  idInput.value = '';
  formTitle.textContent = 'Add a product';
  submitBtn.textContent = 'Add product';
  cancelBtn.hidden = true;
  formPanel.classList.remove('editing');
}

// Edit: fetch one record (GET /:id) and load it into the form
async function startEdit(id) {
  try {
    const p = await request(API + '/' + id);
    FIELDS.forEach(f => { document.getElementById(f).value = p[f] ?? ''; });
    idInput.value = p.id;
    formTitle.textContent = 'Edit product';
    submitBtn.textContent = 'Save changes';
    cancelBtn.hidden = false;
    formPanel.classList.add('editing');
    setStatus('Editing ' + p.product_name + '.', '');
    renderTable();
    document.getElementById('product_name').focus();
    formPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

function readForm() {
  const body = {};
  FIELDS.forEach(f => {
    const value = document.getElementById(f).value.trim();
    body[f] = value === '' ? null : value;
  });
  return body;
}

// CREATE (POST) or UPDATE (PUT), depending on whether a record is being edited
form.addEventListener('submit', async event => {
  event.preventDefault();
  const body = readForm();
  if (!body.product_name) {
    setStatus('Enter a product name before saving.', 'error');
    document.getElementById('product_name').focus();
    return;
  }

  const editingId = idInput.value;
  try {
    if (editingId) {
      await request(API + '/' + editingId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setStatus('Saved changes to ' + body.product_name + '.', 'ok');
    } else {
      await request(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setStatus('Added ' + body.product_name + '.', 'ok');
    }
    resetForm();
    await loadProducts();
  } catch (err) {
    setStatus(err.message, 'error');
  }
});

// DELETE
async function deleteProduct(p) {
  if (!confirm('Delete "' + p.product_name + '"? This cannot be undone.')) return;
  try {
    await request(API + '/' + p.id, { method: 'DELETE' });
    if (String(p.id) === idInput.value) resetForm();
    setStatus('Deleted ' + p.product_name + '.', 'ok');
    await loadProducts();
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

cancelBtn.addEventListener('click', () => {
  resetForm();
  setStatus('', '');
  renderTable();
});
filterEl.addEventListener('change', renderTable);

loadProducts();
