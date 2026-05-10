// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('nexus_cart')||'[]');
let wishlist = JSON.parse(localStorage.getItem('nexus_wishlist')||'[]');
let orders = JSON.parse(localStorage.getItem('nexus_orders')||'[]');
let user = JSON.parse(localStorage.getItem('nexus_user')||'null');
let currentProduct = null;
let checkoutStep = 1;
let selectedPayMethod = 'card';
let checkoutData = {};
let pageHistory = [];

// ===== NAVIGATION =====
function goTo(pageId, data) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const page = document.getElementById('page-'+pageId);
  if (!page) return;
  page.classList.add('active');
  window.scrollTo(0,0);
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  const navItem = document.getElementById('nav-'+pageId);
  if(navItem) navItem.classList.add('active');
  pageHistory.push(pageId);
  // Render specific pages
  if(pageId==='home') renderHome();
  if(pageId==='products') renderProducts(PRODUCTS);
  if(pageId==='categories') renderAllCategories();
  if(pageId==='deals') renderDeals();
  if(pageId==='cart') renderCart();
  if(pageId==='checkout') renderCheckout();
  if(pageId==='wishlist') renderWishlist();
  if(pageId==='profile'){if(!user){openModal('authModal');return;}renderProfile();}
  if(pageId==='blog') renderBlog();
  if(pageId==='about') renderAbout();
  if(pageId==='compare') renderCompare();
  if(pageId==='product-detail' && data) renderProductDetail(data);
  if(pageId==='search' && data) renderSearch(data);
}

// ===== RENDER HOME =====
function renderHome(){
  // Hero mini products
  const heroGrid = document.getElementById('heroProductGrid');
  if(heroGrid){
    heroGrid.innerHTML = [0,1,2,3].map(i=>`
      <div class="mini-product" onclick="openProduct(${PRODUCTS[i].id})">
        <div class="mini-product-img">${PRODUCTS[i].emoji}</div>
        <div class="mini-product-info">
          <h4>${PRODUCTS[i].name.substring(0,20)}...</h4>
          <p>₹${PRODUCTS[i].price.toLocaleString()}</p>
        </div>
      </div>`).join('');
  }
  // Categories
  const homeCats = document.getElementById('homeCategories');
  if(homeCats) homeCats.innerHTML = CATEGORIES.slice(0,8).map(c=>categoryCard(c)).join('');
  // Flash sale
  const flashGrid = document.getElementById('flashSaleGrid');
  if(flashGrid) flashGrid.innerHTML = FLASH_PRODUCTS.map(id=>productCard(PRODUCTS.find(p=>p.id===id))).join('');
  // Featured
  const featuredGrid = document.getElementById('featuredGrid');
  if(featuredGrid) featuredGrid.innerHTML = PRODUCTS.slice(4,12).map(p=>productCard(p)).join('');
  // Testimonials
  const testiGrid = document.getElementById('testimonialsGrid');
  if(testiGrid) testiGrid.innerHTML = TESTIMONIALS.map(t=>`
    <div class="testimonial-card">
      <div class="test-text">${t.text}</div>
      <div class="test-author">
        <div class="test-avatar" style="background:${t.color};">${t.name[0]}</div>
        <div><div class="test-name">${t.name}</div><div class="test-role">${t.role}</div></div>
        <div style="margin-left:auto;color:var(--gold);font-size:0.8rem;">★★★★★</div>
      </div>
    </div>`).join('');
}

function categoryCard(c){
  return `<div class="category-card" onclick="filterByCategory('${c.id}')">
    <span class="category-icon">${c.icon}</span>
    <div class="category-name">${c.name}</div>
    <div class="category-count">${c.count.toLocaleString()} items</div>
  </div>`;
}

function productCard(p){
  if(!p) return '';
  const inWish = wishlist.includes(p.id);
  const disc = Math.round((1-p.price/p.original)*100);
  return `<div class="product-card">
    ${p.badge?`<div class="product-badge badge-${p.badge}">${p.badge==='sale'?`-${disc}%`:p.badge.toUpperCase()}</div>`:''}
    <button class="product-wishlist ${inWish?'active':''}" onclick="toggleWishlist(${p.id},event)">${inWish?'♥':'♡'}</button>
    <div class="product-img" onclick="openProduct(${p.id})">${p.emoji}</div>
    <div class="product-info">
      <div class="product-cat">${p.cat}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating">
        <div class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</div>
        <div class="rating-count">${p.rating} (${p.reviews.toLocaleString()})</div>
      </div>
      <div class="product-price">
        <span class="price-current">₹${p.price.toLocaleString()}</span>
        <span class="price-original">₹${p.original.toLocaleString()}</span>
        <span class="price-discount">-${disc}%</span>
      </div>
      <div class="product-actions">
        <button class="btn-cart" onclick="addToCart(${p.id})">Add to Cart 🛒</button>
        <button class="btn-cart" style="flex:0;padding:0.6rem 0.8rem;background:var(--bg3);border:1px solid var(--border);color:var(--text2);" onclick="openProduct(${p.id})">👁</button>
      </div>
    </div>
  </div>`;
}

// ===== RENDER PRODUCTS =====
function renderProducts(prods){
  const grid = document.getElementById('productsGrid');
  const subtitle = document.getElementById('productsSubtitle');
  if(!grid) return;
  const filterRow = document.getElementById('filterRow');
  if(filterRow) filterRow.innerHTML = ['All',...CATEGORIES.map(c=>c.name)].map(n=>`<div class="filter-tag ${n==='All'?'active':''}" onclick="filterTag(this,'${n}')">${n}</div>`).join('');
  if(subtitle) subtitle.textContent = `Showing ${prods.length} products`;
  grid.innerHTML = prods.map(p=>productCard(p)).join('');
}

function filterByCategory(catId){
  goTo('products');
  const filtered = PRODUCTS.filter(p=>p.cat===catId);
  setTimeout(()=>renderProducts(filtered),100);
}

function filterTag(el,cat){
  document.querySelectorAll('.filter-tag').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  const filtered = cat==='All'?PRODUCTS:PRODUCTS.filter(p=>CATEGORIES.find(c=>c.name===cat&&c.id===p.cat));
  renderProducts(filtered);
}

function sortProducts(val){
  let sorted=[...PRODUCTS];
  if(val==='price-low') sorted.sort((a,b)=>a.price-b.price);
  else if(val==='price-high') sorted.sort((a,b)=>b.price-a.price);
  else if(val==='rating') sorted.sort((a,b)=>b.rating-a.rating);
  else if(val==='newest') sorted.reverse();
  renderProducts(sorted);
}

function renderAllCategories(){
  const grid = document.getElementById('allCategoriesGrid');
  if(grid) grid.innerHTML = CATEGORIES.map(c=>categoryCard(c)).join('');
}

// ===== RENDER DEALS =====
function renderDeals(){
  const grid = document.getElementById('dealsGrid');
  if(grid) grid.innerHTML = PRODUCTS.filter(p=>p.badge==='sale'||p.badge==='hot').map(p=>productCard(p)).join('');
}

// ===== PRODUCT DETAIL =====
function openProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  currentProduct = p;
  goTo('product-detail', p);
}

function renderProductDetail(p){
  const disc = Math.round((1-p.price/p.original)*100);
  const related = PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);
  const content = document.getElementById('productDetailContent');
  if(!content) return;
  content.innerHTML = `
    <div class="pd-gallery">
      <div class="pd-main-img">${p.emoji}</div>
      <div class="pd-thumbs">
        ${[p.emoji,'📦','🏷️','⭐'].map((e,i)=>`<div class="pd-thumb ${i===0?'active':''}" onclick="selectThumb(this)">${e}</div>`).join('')}
      </div>
    </div>
    <div class="pd-info">
      <div class="pd-breadcrumb">
        <span onclick="goTo('home')">Home</span><span class="sep"> / </span>
        <span onclick="filterByCategory('${p.cat}')">${p.cat}</span><span class="sep"> / </span>
        <span>${p.name}</span>
      </div>
      <h1 class="pd-title">${p.name}</h1>
      <div class="pd-rating-row">
        <div class="stars" style="font-size:1rem;">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</div>
        <span style="font-size:0.9rem;">${p.rating}</span>
        <span class="pd-reviews-link">(${p.reviews.toLocaleString()} reviews)</span>
        <span style="background:rgba(67,233,123,0.15);color:var(--accent3);font-size:0.78rem;padding:0.2rem 0.5rem;border-radius:4px;font-weight:600;">In Stock ✓</span>
      </div>
      <div class="pd-price-row">
        <span class="pd-price">₹${p.price.toLocaleString()}</span>
        <span class="pd-original">₹${p.original.toLocaleString()}</span>
        <span class="pd-off">${disc}% OFF</span>
      </div>
      <p class="pd-desc">${p.desc} Premium quality guaranteed with 30-day hassle-free returns and 1-year manufacturer warranty.</p>
      ${p.colors.length?`<div class="pd-options"><div class="pd-option-label">Color</div><div class="pd-option-row">${p.colors.map(c=>`<div class="color-btn" style="background:${c};" onclick="selectOption(this,'color')"></div>`).join('')}</div></div>`:''}
      ${p.sizes.length?`<div class="pd-options"><div class="pd-option-label">Size</div><div class="pd-option-row">${p.sizes.map(s=>`<button class="option-btn" onclick="selectOption(this,'size')">${s}</button>`).join('')}</div></div>`:''}
      <div class="qty-row">
        <div class="pd-option-label">Quantity</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <div class="qty-display" id="qtyDisplay">1</div>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
      </div>
      <div class="pd-add-row">
        <button class="btn btn-primary btn-add-cart" onclick="addToCart(${p.id})">🛒 Add to Cart</button>
        <button class="btn-buy-now" onclick="buyNow(${p.id})">Buy Now →</button>
      </div>
      <div class="pd-features">
        <div class="pd-feature"><span>🚚</span> Free delivery above ₹499</div>
        <div class="pd-feature"><span>↩️</span> 30-day easy returns</div>
        <div class="pd-feature"><span>🔒</span> Secure payment</div>
        <div class="pd-feature"><span>⭐</span> 1 year warranty</div>
        <div class="pd-feature"><span>🎁</span> Gift wrapping available</div>
        <div class="pd-feature"><span>💳</span> EMI available</div>
      </div>
    </div>`;
  const relGrid = document.getElementById('relatedProducts');
  if(relGrid) relGrid.innerHTML = related.map(p=>productCard(p)).join('');
}

let qty = 1;
function changeQty(delta){
  qty = Math.max(1,qty+delta);
  const el = document.getElementById('qtyDisplay');
  if(el) el.textContent = qty;
}
function selectThumb(el){document.querySelectorAll('.pd-thumb').forEach(t=>t.classList.remove('active'));el.classList.add('active');}
function selectOption(el,type){document.querySelectorAll(`.option-btn,.color-btn`).forEach(b=>{if(b.classList.contains(type==='color'?'color-btn':'option-btn'))b.classList.remove('active');});el.classList.add('active');}

// ===== CART =====
function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cart.push({id,qty:1,name:p.name,price:p.price,emoji:p.emoji});
  saveCart();
  showToast(`${p.emoji} ${p.name.substring(0,30)} added to cart!`,'success');
}
function removeFromCart(id){
  cart = cart.filter(c=>c.id!==id);
  saveCart();
  renderCart();
  updateDrawer();
}
function updateCartQty(id,delta){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty = Math.max(1,item.qty+delta);
  saveCart();
  renderCart();
  updateDrawer();
}
function saveCart(){
  localStorage.setItem('nexus_cart',JSON.stringify(cart));
  const total = cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById('cartBadge').textContent = total;
  document.getElementById('drawerCount').textContent = total;
  updateDrawer();
}
function getCartTotal(){return cart.reduce((s,c)=>s+c.price*c.qty,0);}

function renderCart(){
  const content = document.getElementById('cartContent');
  if(!content) return;
  if(cart.length===0){
    content.innerHTML = `<div class="empty-state"><div class="icon">🛒</div><h3>Your cart is empty</h3><p>Looks like you haven't added anything yet.</p><button class="btn btn-primary" onclick="goTo('products')">Start Shopping</button></div>`;
    return;
  }
  const subtotal = getCartTotal();
  const shipping = subtotal > 499 ? 0 : 99;
  const discount = 500;
  const total = subtotal + shipping - discount;
  content.innerHTML = `<div class="cart-layout">
    <div>
      <div class="cart-items">
        <div class="cart-header-row"><span>Product</span><span>Price</span><span>Qty</span><span>Total</span><span></span></div>
        ${cart.map(item=>`<div class="cart-item">
          <div class="cart-item-info"><div class="cart-item-img">${item.emoji}</div><div><div class="cart-item-name">${item.name}</div><div class="cart-item-variant">Variant: Standard</div></div></div>
          <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
          <div><div class="qty-control" style="display:inline-flex;">
            <button class="qty-btn" onclick="updateCartQty(${item.id},-1)">−</button>
            <div class="qty-display">${item.qty}</div>
            <button class="qty-btn" onclick="updateCartQty(${item.id},1)">+</button>
          </div></div>
          <div class="cart-item-price">₹${(item.price*item.qty).toLocaleString()}</div>
          <button class="cart-remove" onclick="removeFromCart(${item.id})">🗑</button>
        </div>`).join('')}
      </div>
    </div>
    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal (${cart.reduce((s,c)=>s+c.qty,0)} items)</span><span>₹${subtotal.toLocaleString()}</span></div>
      <div class="summary-row"><span>Shipping</span><span style="color:var(--accent3)">${shipping===0?'FREE':'₹'+shipping}</span></div>
      <div class="summary-row"><span>Discount (NEXUS60)</span><span style="color:var(--accent3)">−₹${discount}</span></div>
      <div class="summary-row total"><span>Total</span><span>₹${Math.max(0,total).toLocaleString()}</span></div>
      <div class="coupon-row">
        <input type="text" class="coupon-input" placeholder="Coupon code" id="couponInput">
        <button class="btn-coupon" onclick="applyCoupon()">Apply</button>
      </div>
      <button class="btn btn-primary" style="width:100%;margin-top:0.5rem;" onclick="goTo('checkout')">Proceed to Checkout →</button>
      <button class="btn btn-outline" style="width:100%;margin-top:0.5rem;" onclick="goTo('products')">Continue Shopping</button>
    </div>
  </div>`;
}

function applyCoupon(){
  const code = document.getElementById('couponInput')?.value?.toUpperCase();
  const valid = ['NEXUS60','MEGA70','SAVE100','WELCOME50'];
  if(valid.includes(code)) showToast('✅ Coupon applied successfully!','success');
  else showToast('❌ Invalid coupon code','error');
}

// ===== CART DRAWER =====
function openCartDrawer(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('show');
  updateDrawer();
}
function closeCartDrawer(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('show');
}
function updateDrawer(){
  const body = document.getElementById('drawerBody');
  const totalEl = document.getElementById('drawerTotal');
  if(!body) return;
  if(cart.length===0){body.innerHTML='<div class="empty-state" style="padding:2rem;"><div class="icon">🛒</div><p>Cart is empty</p></div>';return;}
  body.innerHTML = cart.map(item=>`<div class="drawer-item"><div class="drawer-item-img">${item.emoji}</div><div class="drawer-item-info"><div class="drawer-item-name">${item.name}</div><div class="drawer-item-price">₹${item.price.toLocaleString()}</div><div class="drawer-item-qty">Qty: ${item.qty}</div></div><button class="cart-remove" onclick="removeFromCart(${item.id})">✕</button></div>`).join('');
  if(totalEl) totalEl.textContent = '₹'+getCartTotal().toLocaleString();
}

// ===== WISHLIST =====
function toggleWishlist(id,e){
  if(e) e.stopPropagation();
  if(wishlist.includes(id)) wishlist=wishlist.filter(w=>w!==id);
  else wishlist.push(id);
  localStorage.setItem('nexus_wishlist',JSON.stringify(wishlist));
  const badge = document.getElementById('wishBadge');
  if(wishlist.length>0){badge.style.display='flex';badge.textContent=wishlist.length;}
  else badge.style.display='none';
  // Re-render cards
  document.querySelectorAll('.product-card').forEach(card=>{});
  showToast(wishlist.includes(id)?'♥ Added to wishlist':'♡ Removed from wishlist','info');
}

function renderWishlist(){
  const grid = document.getElementById('wishlistGrid');
  const count = document.getElementById('wishlistCount');
  if(!grid) return;
  const items = PRODUCTS.filter(p=>wishlist.includes(p.id));
  if(count) count.textContent = `${items.length} items saved`;
  if(items.length===0){grid.innerHTML='<div class="empty-state"><div class="icon">♡</div><h3>No saved items</h3><p>Click the heart icon on any product to save it.</p><button class="btn btn-primary" onclick="goTo(\'products\')">Explore Products</button></div>';return;}
  grid.innerHTML = items.map(p=>productCard(p)).join('');
}

// ===== CHECKOUT =====
function renderCheckout(){
  if(cart.length===0){goTo('cart');return;}
  const content = document.getElementById('checkoutContent');
  if(!content) return;
  const subtotal = getCartTotal();
  const shipping = subtotal>499?0:99;
  const total = subtotal+shipping-500;
  content.innerHTML = `<div class="checkout-layout">
    <div class="checkout-form">
      <div class="checkout-steps">
        ${['Shipping','Payment','Review'].map((s,i)=>`<div class="step ${checkoutStep>i+1?'done':checkoutStep===i+1?'active':''}"><div class="step-num">${checkoutStep>i+1?'✓':i+1}</div><div class="step-label">${s}</div></div>`).join('')}
      </div>
      <div id="checkoutStepContent"></div>
    </div>
    <div class="cart-summary">
      <h3>Order Summary</h3>
      ${cart.map(item=>`<div class="summary-row"><span>${item.emoji} ${item.name.substring(0,20)}... ×${item.qty}</span><span>₹${(item.price*item.qty).toLocaleString()}</span></div>`).join('')}
      <div class="summary-row"><span>Shipping</span><span style="color:var(--accent3)">${shipping===0?'FREE':'₹'+shipping}</span></div>
      <div class="summary-row"><span>Discount</span><span style="color:var(--accent3)">−₹500</span></div>
      <div class="summary-row total"><span>Total</span><span>₹${Math.max(0,total).toLocaleString()}</span></div>
      <div style="display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap;">
        <div class="pay-icon">VISA</div><div class="pay-icon">MC</div><div class="pay-icon">UPI</div><div class="pay-icon">AMEX</div>
      </div>
      <div style="margin-top:1rem;background:rgba(67,233,123,0.1);border:1px solid rgba(67,233,123,0.2);border-radius:8px;padding:0.8rem;font-size:0.8rem;color:var(--accent3);">🔒 100% Secure & Encrypted Payment</div>
    </div>
  </div>`;
  renderCheckoutStep();
}

function renderCheckoutStep(){
  const el = document.getElementById('checkoutStepContent');
  if(!el) return;
  if(checkoutStep===1) el.innerHTML = `
    <div class="form-section"><h3>📍 Shipping Information</h3>
    <div class="form-grid">
      <div class="form-group"><label>First Name</label><input type="text" placeholder="Rahul" id="fn" value="${checkoutData.fn||''}"></div>
      <div class="form-group"><label>Last Name</label><input type="text" placeholder="Sharma" id="ln" value="${checkoutData.ln||''}"></div>
      <div class="form-group full"><label>Email</label><input type="email" placeholder="rahul@email.com" id="email" value="${checkoutData.email||''}"></div>
      <div class="form-group full"><label>Phone</label><input type="tel" placeholder="+91 98765 43210" id="phone" value="${checkoutData.phone||''}"></div>
      <div class="form-group full"><label>Address</label><input type="text" placeholder="123, MG Road" id="addr" value="${checkoutData.addr||''}"></div>
      <div class="form-group"><label>City</label><input type="text" placeholder="Mumbai" id="city" value="${checkoutData.city||''}"></div>
      <div class="form-group"><label>State</label><select id="state"><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option><option>Gujarat</option><option>Rajasthan</option></select></div>
      <div class="form-group"><label>PIN Code</label><input type="text" placeholder="400001" id="pin" value="${checkoutData.pin||''}"></div>
      <div class="form-group"><label>Country</label><select><option>India</option></select></div>
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:1rem;" onclick="nextStep()">Continue to Payment →</button></div>`;
  else if(checkoutStep===2) el.innerHTML = `
    <div class="form-section"><h3>💳 Payment Method</h3>
    <div class="payment-methods">
      <div class="pay-method active" id="pm-card" onclick="selectPayMethod('card')"><span class="pay-method-icon">💳</span><div class="pay-method-label">Card</div></div>
      <div class="pay-method" id="pm-upi" onclick="selectPayMethod('upi')"><span class="pay-method-icon">📲</span><div class="pay-method-label">UPI</div></div>
      <div class="pay-method" id="pm-netbank" onclick="selectPayMethod('netbank')"><span class="pay-method-icon">🏦</span><div class="pay-method-label">Net Banking</div></div>
      <div class="pay-method" id="pm-wallet" onclick="selectPayMethod('wallet')"><span class="pay-method-icon">👛</span><div class="pay-method-label">Wallet</div></div>
      <div class="pay-method" id="pm-cod" onclick="selectPayMethod('cod')"><span class="pay-method-icon">💵</span><div class="pay-method-label">Cash on Delivery</div></div>
    </div>
    <div id="payMethodContent"></div>
    <button class="btn btn-primary" style="width:100%;margin-top:1.5rem;" onclick="nextStep()">Review Order →</button>
    <button class="btn btn-outline" style="width:100%;margin-top:0.5rem;" onclick="prevStep()">← Back</button></div>`;
  if(checkoutStep===2) renderPayMethod('card');
  else if(checkoutStep===3) el.innerHTML = `
    <div class="form-section"><h3>📋 Review Your Order</h3>
    <div style="background:var(--bg3);border-radius:10px;padding:1.2rem;margin-bottom:1rem;">
      <div style="font-size:0.82rem;color:var(--text2);margin-bottom:0.5rem;font-weight:600;text-transform:uppercase;">Delivery Address</div>
      <div style="font-size:0.9rem;">${checkoutData.fn||'Rahul'} ${checkoutData.ln||'Sharma'}</div>
      <div style="font-size:0.85rem;color:var(--text2);">${checkoutData.addr||'123 MG Road'}, ${checkoutData.city||'Mumbai'}, ${checkoutData.pin||'400001'}</div>
    </div>
    <div style="background:var(--bg3);border-radius:10px;padding:1.2rem;margin-bottom:1rem;">
      <div style="font-size:0.82rem;color:var(--text2);margin-bottom:0.5rem;font-weight:600;text-transform:uppercase;">Payment</div>
      <div style="font-size:0.9rem;">${selectedPayMethod==='card'?'💳 Credit/Debit Card ending in ••••':selectedPayMethod==='upi'?'📲 UPI Payment':selectedPayMethod==='cod'?'💵 Cash on Delivery':'💳 '+selectedPayMethod}</div>
    </div>
    <div style="background:var(--bg3);border-radius:10px;padding:1.2rem;margin-bottom:1.5rem;">
      <div style="font-size:0.82rem;color:var(--text2);margin-bottom:0.8rem;font-weight:600;text-transform:uppercase;">Items</div>
      ${cart.map(item=>`<div style="display:flex;justify-content:space-between;font-size:0.88rem;padding:0.3rem 0;">${item.emoji} ${item.name.substring(0,28)}... ×${item.qty}<span>₹${(item.price*item.qty).toLocaleString()}</span></div>`).join('')}
    </div>
    <button class="btn btn-primary" style="width:100%;font-size:1rem;padding:1rem;" onclick="placeOrder()">🎉 Place Order</button>
    <button class="btn btn-outline" style="width:100%;margin-top:0.5rem;" onclick="prevStep()">← Back</button></div>`;
}

function selectPayMethod(method){
  selectedPayMethod = method;
  document.querySelectorAll('.pay-method').forEach(m=>m.classList.remove('active'));
  document.getElementById('pm-'+method)?.classList.add('active');
  renderPayMethod(method);
}

function renderPayMethod(method){
  const el = document.getElementById('payMethodContent');
  if(!el) return;
  if(method==='card') el.innerHTML=`
    <div class="card-fields">
      <div class="card-preview">
        <div class="card-chip"></div>
        <div class="card-number-display" id="cardNumDisplay">•••• •••• •••• ••••</div>
        <div class="card-row"><span>CARD HOLDER<br><b id="cardNameDisplay">YOUR NAME</b></span><span style="text-align:right;">EXPIRES<br><b id="cardExpDisplay">MM/YY</b></span></div>
      </div>
      <div class="form-grid">
        <div class="form-group full"><label>Card Number</label><input type="text" maxlength="19" placeholder="1234 5678 9012 3456" oninput="fmtCard(this)" id="cardNum"></div>
        <div class="form-group full"><label>Cardholder Name</label><input type="text" placeholder="Rahul Sharma" oninput="document.getElementById('cardNameDisplay').textContent=this.value.toUpperCase()||'YOUR NAME'"></div>
        <div class="form-group"><label>Expiry Date</label><input type="text" maxlength="5" placeholder="MM/YY" oninput="fmtExp(this)" id="cardExp"></div>
        <div class="form-group"><label>CVV</label><input type="password" maxlength="3" placeholder="•••"></div>
      </div>
      <div style="margin-top:0.5rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
        <div class="pay-icon" style="background:rgba(0,82,224,0.15);color:#0052E0;">VISA</div>
        <div class="pay-icon" style="background:rgba(235,0,27,0.15);color:#EB001B;">MC</div>
        <div class="pay-icon">AMEX</div>
        <div class="pay-icon">RUPAY</div>
      </div>
    </div>`;
  else if(method==='upi') el.innerHTML=`
    <div class="upi-box">
      <div class="form-group"><label>UPI ID</label><input type="text" placeholder="yourname@upi" id="upiId"></div>
      <p style="font-size:0.82rem;color:var(--text2);margin-bottom:0.5rem;">Or pay via app:</p>
      <div class="upi-apps">
        <div class="upi-app" onclick="selectUpiApp(this,'GPay')"><div class="upi-app-icon">🟢</div><div class="upi-app-name">GPay</div></div>
        <div class="upi-app" onclick="selectUpiApp(this,'PhonePe')"><div class="upi-app-icon">🟣</div><div class="upi-app-name">PhonePe</div></div>
        <div class="upi-app" onclick="selectUpiApp(this,'Paytm')"><div class="upi-app-icon">🔵</div><div class="upi-app-name">Paytm</div></div>
        <div class="upi-app" onclick="selectUpiApp(this,'BHIM')"><div class="upi-app-icon">🟠</div><div class="upi-app-name">BHIM</div></div>
      </div>
    </div>`;
  else if(method==='netbank') el.innerHTML=`
    <div class="upi-box">
      <div class="form-group"><label>Select Your Bank</label><select class="form-group input" style="width:100%;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:0.7rem;color:var(--text);font-family:'DM Sans',sans-serif;"><option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option><option>Kotak Mahindra Bank</option><option>Punjab National Bank</option><option>Bank of Baroda</option><option>Yes Bank</option></select></div>
      <p style="font-size:0.8rem;color:var(--text3);">You will be redirected to your bank's secure page</p>
    </div>`;
  else if(method==='wallet') el.innerHTML=`
    <div class="upi-box">
      <p style="font-size:0.85rem;color:var(--text2);margin-bottom:0.8rem;">Select wallet:</p>
      <div class="wallets-grid">
        <div class="wallet-item" onclick="selectWallet(this)"><div>🔵</div><div><div style="font-weight:600;font-size:0.85rem;">Paytm</div><div style="font-size:0.72rem;color:var(--accent3);">Bal: ₹1,240</div></div></div>
        <div class="wallet-item" onclick="selectWallet(this)"><div>🟠</div><div><div style="font-weight:600;font-size:0.85rem;">Amazon Pay</div><div style="font-size:0.72rem;color:var(--accent3);">Bal: ₹850</div></div></div>
        <div class="wallet-item" onclick="selectWallet(this)"><div>🟣</div><div><div style="font-weight:600;font-size:0.85rem;">Mobikwik</div><div style="font-size:0.72rem;color:var(--accent3);">Bal: ₹320</div></div></div>
        <div class="wallet-item" onclick="selectWallet(this)"><div>🔴</div><div><div style="font-weight:600;font-size:0.85rem;">Freecharge</div><div style="font-size:0.72rem;color:var(--accent3);">Bal: ₹0</div></div></div>
      </div>
    </div>`;
  else if(method==='cod') el.innerHTML=`
    <div class="upi-box">
      <div style="font-size:2rem;text-align:center;margin-bottom:0.8rem;">💵</div>
      <p style="text-align:center;font-size:0.9rem;color:var(--text2);">Pay cash when your order is delivered. COD charge of ₹49 applies.</p>
      <div style="margin-top:1rem;background:rgba(108,99,255,0.1);border-radius:8px;padding:0.8rem;font-size:0.8rem;color:var(--text2);">✓ COD available for orders up to ₹10,000<br>✓ Keep exact change ready for smooth delivery</div>
    </div>`;
}

function fmtCard(el){let v=el.value.replace(/\D/g,'').substring(0,16).replace(/(.{4})/g,'$1 ').trim();el.value=v;document.getElementById('cardNumDisplay').textContent=v||'•••• •••• •••• ••••';}
function fmtExp(el){let v=el.value.replace(/\D/g,'');if(v.length>=2)v=v.slice(0,2)+'/'+v.slice(2,4);el.value=v;document.getElementById('cardExpDisplay').textContent=v||'MM/YY';}
function selectUpiApp(el,name){document.querySelectorAll('.upi-app').forEach(a=>a.style.borderColor='var(--border)');el.style.borderColor='var(--accent)';showToast(`Opening ${name}...`,'info');}
function selectWallet(el){document.querySelectorAll('.wallet-item').forEach(w=>w.style.borderColor='var(--border)');el.style.borderColor='var(--accent)';}

function nextStep(){
  if(checkoutStep===1){
    checkoutData={fn:document.getElementById('fn')?.value,ln:document.getElementById('ln')?.value,email:document.getElementById('email')?.value,addr:document.getElementById('addr')?.value,city:document.getElementById('city')?.value,pin:document.getElementById('pin')?.value};
  }
  if(checkoutStep<3) checkoutStep++;
  renderCheckout();
}
function prevStep(){if(checkoutStep>1) checkoutStep--;renderCheckout();}

function placeOrder(){
  const orderId = 'NX-2026-'+Math.random().toString(36).substring(2,8).toUpperCase();
  const orderItems = [...cart];
  const orderTotal = Math.max(0,getCartTotal()-500);
  const order = {id:orderId,items:orderItems,total:orderTotal,date:new Date().toLocaleDateString('en-IN'),status:'Processing',address:checkoutData};
  orders.push(order);
  localStorage.setItem('nexus_orders',JSON.stringify(orders));
  cart = [];
  saveCart();
  checkoutStep = 1;
  goTo('order-confirm');
  renderOrderConfirm(order);
}

function renderOrderConfirm(order){
  const content = document.getElementById('orderConfirmContent');
  if(!content) return;
  content.innerHTML = `<div class="confirm-box">
    <div class="confirm-icon">🎉</div>
    <h2>Order Placed Successfully!</h2>
    <p>Thank you for shopping at NEXUS! Your order is confirmed and will be delivered soon.</p>
    <div class="order-id">${order.id}</div>
    <div class="order-steps">
      <div class="order-step"><div class="order-step-dot">✓</div><div><b>Order Confirmed</b><br><small style="color:var(--text3);">Just now</small></div></div>
      <div class="order-step"><div class="order-step-dot" style="background:var(--text3);">○</div><div><b>Processing</b><br><small style="color:var(--text3);">Within 2 hours</small></div></div>
      <div class="order-step"><div class="order-step-dot" style="background:var(--text3);">○</div><div><b>Shipped</b><br><small style="color:var(--text3);">Within 24 hours</small></div></div>
      <div class="order-step"><div class="order-step-dot" style="background:var(--text3);">○</div><div><b>Out for Delivery</b><br><small style="color:var(--text3);">Expected ${new Date(Date.now()+3*86400000).toLocaleDateString('en-IN')}</small></div></div>
      <div class="order-step"><div class="order-step-dot" style="background:var(--text3);">○</div><div><b>Delivered</b><br><small style="color:var(--text3);">Expected in 3-5 days</small></div></div>
    </div>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="goTo('profile');showProfileTab('orders')">View Orders</button>
      <button class="btn btn-outline" onclick="goTo('track');document.getElementById('trackOrderId').value='${order.id}'">Track Order</button>
      <button class="btn btn-outline" onclick="goTo('home')">Continue Shopping</button>
    </div>
  </div>`;
}

// ===== AUTH =====
function doLogin(){
  const email = document.getElementById('loginEmail').value || 'demo@nexus.com';
  const pass = document.getElementById('loginPass').value;
  user = {name:'Demo User',email:email,avatar:'DU',joined:'Jan 2024'};
  localStorage.setItem('nexus_user',JSON.stringify(user));
  closeModal('authModal');
  document.getElementById('authBtn').style.display='none';
  document.getElementById('profileBtn').style.display='flex';
  showToast('👋 Welcome back! Logged in successfully.','success');
}
function showSignup(){
  document.getElementById('authForm').innerHTML = `
    <h2>Create Account 🚀</h2>
    <p>Join NEXUS for exclusive deals and offers</p>
    <div class="form-group"><label>Full Name</label><input type="text" placeholder="Your Name"></div>
    <div class="form-group"><label>Email</label><input type="email" placeholder="you@email.com"></div>
    <div class="form-group"><label>Password</label><input type="password" placeholder="Create password"></div>
    <button class="btn btn-primary" style="width:100%;margin-bottom:1rem;" onclick="doLogin()">Create Account</button>
    <p style="text-align:center;font-size:0.82rem;color:var(--text2);">Already have an account? <span style="color:var(--accent);cursor:pointer;" onclick="openModal('authModal')">Sign In</span></p>`;
}
function logout(){
  user=null;localStorage.removeItem('nexus_user');
  document.getElementById('authBtn').style.display='flex';
  document.getElementById('profileBtn').style.display='none';
  goTo('home');showToast('Logged out successfully','info');
}

// ===== PROFILE =====
function renderProfile(){
  if(!user) return;
  document.getElementById('profileDisplayName').textContent=user.name;
  document.getElementById('profileDisplayEmail').textContent=user.email;
  document.getElementById('profileAvatar').textContent=user.name[0];
  showProfileTab('orders');
}
function showProfileTab(tab){
  document.querySelectorAll('.profile-menu-item').forEach(m=>m.classList.remove('active'));
  const el = document.getElementById('profileContent');
  if(!el) return;
  if(tab==='orders'){
    el.innerHTML=`<h3 style="margin-bottom:1.5rem;">My Orders</h3>
    ${orders.length===0?`<div class="empty-state"><div class="icon">📦</div><h3>No orders yet</h3><p>Your placed orders will appear here.</p><button class="btn btn-primary" onclick="goTo('products')">Shop Now</button></div>`:
    `<table class="orders-table"><thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>
    ${orders.map(o=>`<tr><td style="font-family:'Syne',sans-serif;">${o.id}</td><td>${o.date}</td><td>${o.items.length} items</td><td>₹${o.total.toLocaleString()}</td><td><span class="status-badge status-processing">⚙ Processing</span></td><td><button class="btn btn-outline btn-sm" onclick="goTo('track');document.getElementById('trackOrderId').value='${o.id}'">Track</button></td></tr>`).join('')}
    </tbody></table>`}`;
  } else if(tab==='wishlist2'){
    const items=PRODUCTS.filter(p=>wishlist.includes(p.id));
    el.innerHTML=`<h3 style="margin-bottom:1.5rem;">My Wishlist (${items.length})</h3><div class="products-grid">${items.map(p=>productCard(p)).join('')}</div>`;
  } else if(tab==='addresses'){
    el.innerHTML=`<h3 style="margin-bottom:1.5rem;">Saved Addresses</h3>
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:1.2rem;margin-bottom:1rem;">
      <div style="font-weight:600;margin-bottom:0.3rem;">🏠 Home <span style="background:var(--accent);color:#fff;font-size:0.65rem;padding:0.15rem 0.4rem;border-radius:4px;margin-left:0.5rem;">Default</span></div>
      <div style="font-size:0.85rem;color:var(--text2);">Demo User, 123 MG Road, Mumbai, Maharashtra 400001</div>
    </div>
    <button class="btn btn-outline btn-sm">+ Add New Address</button>`;
  } else if(tab==='settings'){
    el.innerHTML=`<h3 style="margin-bottom:1.5rem;">Account Settings</h3>
    <div class="form-grid">
      <div class="form-group"><label>First Name</label><input type="text" value="${user.name.split(' ')[0]}"></div>
      <div class="form-group"><label>Last Name</label><input type="text" value="${user.name.split(' ')[1]||''}"></div>
      <div class="form-group full"><label>Email</label><input type="email" value="${user.email}"></div>
      <div class="form-group full"><label>Phone</label><input type="tel" value="+91 98765 43210"></div>
    </div>
    <button class="btn btn-primary btn-sm" style="margin-top:0.5rem;" onclick="showToast('Settings saved!','success')">Save Changes</button>`;
  } else if(tab==='wallet'){
    el.innerHTML=`<h3 style="margin-bottom:1.5rem;">Wallet & Payments</h3>
    <div style="background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:12px;padding:1.5rem;color:#fff;margin-bottom:1.5rem;">
      <div style="font-size:0.82rem;opacity:0.8;margin-bottom:0.3rem;">NEXUS Wallet Balance</div>
      <div style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;">₹2,340</div>
      <div style="font-size:0.75rem;opacity:0.7;margin-top:0.5rem;">Member since ${user.joined}</div>
    </div>
    <h4 style="margin-bottom:1rem;">Saved Cards</h4>
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:1rem;display:flex;align-items:center;gap:1rem;">
      <div>💳</div><div><div style="font-weight:600;font-size:0.88rem;">HDFC Visa ••••4242</div><div style="font-size:0.75rem;color:var(--text3);">Expires 09/27</div></div>
    </div>
    <button class="btn btn-outline btn-sm" style="margin-top:1rem;">+ Add Card</button>`;
  }
}

// ===== SEARCH =====
function doSearch(){
  const q = document.getElementById('searchInput').value;
  if(!q.trim()) return;
  goTo('search', q);
}
function renderSearch(q){
  document.getElementById('searchQuery').textContent = `Showing results for "${q}"`;
  const results = PRODUCTS.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.cat.toLowerCase().includes(q.toLowerCase()));
  document.getElementById('searchGrid').innerHTML = results.length?results.map(p=>productCard(p)).join(''):
    `<div class="empty-state"><div class="icon">🔍</div><h3>No results for "${q}"</h3><p>Try different keywords.</p></div>`;
}

// ===== TRACK ORDER =====
function trackOrder(){
  const id = document.getElementById('trackOrderId').value;
  const el = document.getElementById('trackResult');
  const knownOrder = orders.find(o=>o.id===id);
  if(id.startsWith('NX-')||knownOrder){
    el.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;">
        <div><div style="font-size:0.8rem;color:var(--text3);">Order ID</div><div style="font-family:'Syne',sans-serif;font-weight:700;">${id}</div></div>
        <span class="status-badge status-processing">⚙ Processing</span>
      </div>
      <div class="track-timeline">
        ${[{icon:'✅',label:'Order Placed',desc:'Your order was placed successfully',done:true},{icon:'⚙️',label:'Processing',desc:'Seller is preparing your order',done:true,current:true},{icon:'📦',label:'Packed & Shipped',desc:'Estimated: Today evening',done:false},{icon:'🚚',label:'Out for Delivery',desc:'Expected: ${new Date(Date.now()+2*86400000).toLocaleDateString("en-IN")}',done:false},{icon:'✓',label:'Delivered',desc:'Enjoy your purchase!',done:false}].map(s=>`
        <div class="track-step ${s.done?'done':''} ${s.current?'current':''}">
          <div class="track-step-dot">${s.done||s.current?s.icon:'○'}</div>
          <div class="track-step-info"><h4>${s.label}</h4><p>${s.desc}</p></div>
        </div>`).join('')}
      </div>
    </div>`;
  } else {
    el.innerHTML='<div class="empty-state" style="padding:2rem;"><div class="icon">❓</div><h3>Order Not Found</h3><p>Try format: NX-2026-XXXXXX</p></div>';
  }
}

// ===== BLOG =====
function renderBlog(){
  const grid = document.getElementById('blogGrid');
  if(grid) grid.innerHTML = BLOG_POSTS.map(b=>`<div class="blog-card">
    <div class="blog-img">${b.emoji}</div>
    <div class="blog-content">
      <div class="blog-tag">${b.tag}</div>
      <div class="blog-title">${b.title}</div>
      <div class="blog-meta">${b.date} · ${b.read} read</div>
    </div>
  </div>`).join('');
}

// ===== ABOUT =====
function renderAbout(){
  const grid = document.getElementById('teamGrid');
  if(grid) grid.innerHTML = TEAM.map(t=>`<div class="team-card">
    <div class="team-avatar" style="background:${t.color};">${t.emoji}</div>
    <div class="team-name">${t.name}</div>
    <div class="team-role">${t.role}</div>
  </div>`).join('');
}

// ===== COMPARE =====
function renderCompare(){
  const content = document.getElementById('compareContent');
  const p1=PRODUCTS[0], p2=PRODUCTS[4], p3=PRODUCTS[12];
  if(!content) return;
  content.innerHTML=`<table class="compare-table">
    <thead><tr><th>Feature</th><th>${p1.emoji} ${p1.name.substring(0,20)}</th><th>${p2.emoji} ${p2.name.substring(0,20)}</th><th>${p3.emoji} ${p3.name.substring(0,20)}</th></tr></thead>
    <tbody>
      <tr><td>Price</td><td>₹${p1.price.toLocaleString()}</td><td>₹${p2.price.toLocaleString()}</td><td>₹${p3.price.toLocaleString()}</td></tr>
      <tr><td>Rating</td><td>${p1.rating}★</td><td>${p2.rating}★</td><td>${p3.rating}★</td></tr>
      <tr><td>In Stock</td><td class="compare-check">✓</td><td class="compare-check">✓</td><td class="compare-check">✓</td></tr>
      <tr><td>Free Delivery</td><td class="compare-check">✓</td><td class="compare-check">✓</td><td class="compare-x">✗</td></tr>
      <tr><td>Warranty</td><td>1 Year</td><td>1 Year</td><td>6 Months</td></tr>
      <tr><td>Returns</td><td>30 Days</td><td>30 Days</td><td>30 Days</td></tr>
    </tbody>
  </table>
  <div class="products-grid" style="margin-top:2rem;">${[p1,p2,p3].map(p=>productCard(p)).join('')}</div>`;
}

// ===== MISC =====
function buyNow(id){
  addToCart(id);
  goTo('checkout');
}
function subscribeNewsletter(){showToast('🎉 Subscribed successfully! Check your inbox.','success');}
function sendMessage(){showToast('✉️ Message sent! We\'ll reply within 24 hours.','success');}

// ===== TOAST =====
function showToast(msg,type='info'){
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(()=>toast.remove(),3500);
}

// ===== MODAL =====
function openModal(id){document.getElementById(id).classList.add('show');}
function closeModal(id){document.getElementById(id).classList.remove('show');}
document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show');}));

// ===== COUNTDOWN =====
function startCountdown(hEl,mEl,sEl,totalSeconds){
  function tick(){
    if(totalSeconds<=0) return;
    totalSeconds--;
    const h=Math.floor(totalSeconds/3600),m=Math.floor((totalSeconds%3600)/60),s=totalSeconds%60;
    if(document.getElementById(hEl)) document.getElementById(hEl).textContent=String(h).padStart(2,'0');
    if(document.getElementById(mEl)) document.getElementById(mEl).textContent=String(m).padStart(2,'0');
    if(document.getElementById(sEl)) document.getElementById(sEl).textContent=String(s).padStart(2,'0');
    setTimeout(tick,1000);
  }
  tick();
}
startCountdown('cd-h','cd-m','cd-s',4*3600+23*60+59);
startCountdown('d-h','d-m','d-s',12*3600+45*60+30);

// ===== INIT =====
function init(){
  if(user){document.getElementById('authBtn').style.display='none';document.getElementById('profileBtn').style.display='flex';}
  const total=cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById('cartBadge').textContent=total;
  if(wishlist.length>0){const b=document.getElementById('wishBadge');b.style.display='flex';b.textContent=wishlist.length;}
  renderHome();
}
init();
