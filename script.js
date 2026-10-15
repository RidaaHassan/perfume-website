// State Management
const state = {
  scentKey: localStorage.getItem('aura_scentKey') || 'amber-oud',
  scentName: localStorage.getItem('aura_scentName') || 'Amber Oud',
  scentPrice: parseFloat(localStorage.getItem('aura_scentPrice')) || 340,
  scentImg: localStorage.getItem('aura_scentImg') || 'amber-oud.webp',
  scentColor: localStorage.getItem('aura_scentColor') || '#B88E63',
  engraving: localStorage.getItem('aura_engraving') || '',
  quantity: parseInt(localStorage.getItem('aura_quantity')) || 1
};

// Save State to LocalStorage
function saveState() {
  localStorage.setItem('aura_scentKey', state.scentKey);
  localStorage.setItem('aura_scentName', state.scentName);
  localStorage.setItem('aura_scentPrice', state.scentPrice);
  localStorage.setItem('aura_scentImg', state.scentImg);
  localStorage.setItem('aura_scentColor', state.scentColor);
  localStorage.setItem('aura_engraving', state.engraving);
  localStorage.setItem('aura_quantity', state.quantity);
}

// Product Page Logic
document.addEventListener('DOMContentLoaded', () => {
  
  const productBody = document.getElementById('productPageBody');
  const scentTitle = document.getElementById('scentTitle');
  const scentDesc = document.getElementById('scentDesc');
  const engravingInput = document.getElementById('engravingInput');
  const engravingPreview = document.getElementById('engravingPreview');
  const qtyVal = document.getElementById('qtyVal');
  const scentCards = document.querySelectorAll('.scent-card');

  if (scentTitle) {
    updateProductUI();

    // Scent Selection Listener
    scentCards.forEach(card => {
      card.addEventListener('click', () => {
        scentCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        state.scentKey = card.dataset.scent;
        state.scentName = card.dataset.name;
        state.scentPrice = parseFloat(card.dataset.price);
        state.scentImg = card.dataset.img;
        state.scentColor = card.dataset.color;

        if (scentDesc) scentDesc.innerText = card.dataset.desc;

        saveState();
        updateProductUI();
        syncGalleryToScent(state.scentImg);
      });
    });

    // Engraving Input Listener
    if (engravingInput) {
      engravingInput.value = state.engraving;
      engravingInput.addEventListener('input', (e) => {
        state.engraving = e.target.value;
        if (engravingPreview) engravingPreview.innerText = state.engraving;
        saveState();
      });
    }

    // Quantity Listeners
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');

    if (qtyMinus && qtyPlus) {
      qtyMinus.addEventListener('click', () => {
        if (state.quantity > 1) {
          state.quantity--;
          qtyVal.innerText = state.quantity;
          saveState();
        }
      });

      qtyPlus.addEventListener('click', () => {
        state.quantity++;
        qtyVal.innerText = state.quantity;
        saveState();
      });
    }

    // Proceed to Checkout
    const addToOrderBtn = document.getElementById('addToOrderBtn');
    if (addToOrderBtn) {
      addToOrderBtn.addEventListener('click', () => {
        window.location.href = 'order.html';
      });
    }
  }

  // Gallery, Slider & Cursor Magnifier Logic
  initGalleryControls();

  // Order Page Initialization
  initOrderPage();
});

// Update Product Page Visuals & Theme
function updateProductUI() {
  const productBody = document.getElementById('productPageBody');
  const perfumeImg = document.getElementById('perfumeImage');
  const scentTitle = document.getElementById('scentTitle');
  const scentPrice = document.getElementById('scentPrice');
  const engravingPreview = document.getElementById('engravingPreview');
  const qtyVal = document.getElementById('qtyVal');

  if (productBody) {
    productBody.setAttribute('data-scent', state.scentKey);
  }
  
  if (perfumeImg) perfumeImg.src = state.scentImg;
  if (scentTitle) scentTitle.innerText = state.scentName;
  if (scentPrice) scentPrice.innerText = `$${state.scentPrice}`;
  if (engravingPreview) engravingPreview.innerText = state.engraving;
  if (qtyVal) qtyVal.innerText = state.quantity;
}

// Gallery Thumbnails, Next/Prev Controls & Zoom
function initGalleryControls() {
  const thumbBtns = document.querySelectorAll('.thumb-btn');
  const perfumeImg = document.getElementById('perfumeImage');
  const zoomWrapper = document.getElementById('zoomWrapper');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');

  if (!thumbBtns.length) return;

  const imageSources = [
    'amber-oud.webp',
    'musc-gold.webp',
    'night-iris.webp',
    'rose-bloom.webp',
    'sage-citrus.webp'
  ];

  let currentImageIndex = imageSources.indexOf(state.scentImg);
  if (currentImageIndex === -1) currentImageIndex = 0;

  function updateGalleryImage(index) {
    currentImageIndex = index;
    const selectedSrc = imageSources[currentImageIndex];

    if (perfumeImg) perfumeImg.src = selectedSrc;

    thumbBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentImageIndex);
    });
  }

  thumbBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => updateGalleryImage(idx));
  });

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      let newIdx = currentImageIndex - 1;
      if (newIdx < 0) newIdx = imageSources.length - 1;
      updateGalleryImage(newIdx);
    });

    nextBtn.addEventListener('click', () => {
      let newIdx = (currentImageIndex + 1) % imageSources.length;
      updateGalleryImage(newIdx);
    });
  }

  // Touch & Cursor Zoom Effect
  if (zoomWrapper && perfumeImg) {
    zoomWrapper.addEventListener('mouseenter', () => {
      zoomWrapper.classList.add('zoomed');
    });

    zoomWrapper.addEventListener('mousemove', (e) => {
      const rect = zoomWrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      perfumeImg.style.transformOrigin = `${x}% ${y}%`;
    });

    zoomWrapper.addEventListener('mouseleave', () => {
      zoomWrapper.classList.remove('zoomed');
      perfumeImg.style.transformOrigin = 'center center';
    });
  }
}

function syncGalleryToScent(imgSrc) {
  const thumbBtns = document.querySelectorAll('.thumb-btn');
  thumbBtns.forEach(btn => {
    const isMatch = btn.dataset.img === imgSrc;
    btn.classList.toggle('active', isMatch);
  });
}

// Populate Order Summary
function initOrderPage() {
  const summaryScentName = document.getElementById('summaryScentName');
  if (!summaryScentName) return;

  const summaryImg = document.getElementById('summaryImg');
  const summaryUnitPrice = document.getElementById('summaryUnitPrice');
  const summaryQty = document.getElementById('summaryQty');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');
  const summaryEngraving = document.getElementById('summaryEngraving');

  summaryScentName.innerText = state.scentName;
  summaryImg.src = state.scentImg;
  summaryUnitPrice.innerText = `$${state.scentPrice}`;
  summaryQty.innerText = state.quantity;
  
  const total = state.scentPrice * state.quantity;
  summaryTotalPrice.innerText = `$${total}`;

  summaryEngraving.innerText = state.engraving ? `Engraving: "${state.engraving}"` : 'Engraving: None';
}

// Submit Order & Show Wax Seal Modal
function submitOrder() {
  const modal = document.getElementById('waxModal');
  const modalOrderRef = document.getElementById('modalOrderRef');

  if (modalOrderRef) {
    const randomRef = Math.floor(100000 + Math.random() * 900000);
    modalOrderRef.innerText = `#AURA-${randomRef}`;
  }

  if (modal) {
    modal.style.display = 'flex';
  }
}