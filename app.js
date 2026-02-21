// Shopping Cart App for Room Escape Game
const app = document.getElementById('app');


let truthItems = [];
let cartItems = [];

// Fetch both items.json (for cart) and truth.json (for win/lose check)
Promise.all([
  fetch('items.json').then(res => res.json()),
  fetch('truth.json').then(res => res.json())
]).then(([itemsData, truthData]) => {
  cartItems = JSON.parse(JSON.stringify(itemsData.items));
  truthItems = truthData.items;
  renderCart();
});

function renderCart() {
  app.innerHTML = `
    <div class="cart-title">Shopping Cart</div>
    <div class="cart-list">
      ${cartItems.map((item, idx) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="item-image" />
          <div class="item-info">
            <span class="item-name">${item.name}</span>
            <span class="item-cost">$${item.cost.toFixed(2)}</span>
          </div>
          <button class="remove-btn" onclick="removeItem(${idx})">&times;</button>
        </div>
      `).join('')}
    </div>
    <div class="cart-total">Total: $${cartItems.reduce((sum, i) => sum + i.cost, 0).toFixed(2)}</div>
    <button class="buy-btn" onclick="buyAll()">Buy All</button>
  `;
}

window.removeItem = function(idx) {
  cartItems.splice(idx, 1);
  renderCart();
};

window.buyAll = function() {
  // Compare cartItems to truthItems (order and content)
  if (arraysEqual(cartItems, truthItems)) {
    showLottery();
  } else {
    // Check if cart contains any item not in truthItems
    const cartNames = cartItems.map(i => i.name);
    const truthNames = truthItems.map(i => i.name);
    const extraItems = cartNames.filter(name => !truthNames.includes(name));
    if (extraItems.length > 0) {
      showLose('tooMany');
    } else {
      showLose('notEnough');
    }
  }
};

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  // Compare by name and cost
  for (let i = 0; i < a.length; i++) {
    if (a[i].name !== b[i].name || a[i].cost !== b[i].cost) return false;
  }
  return true;
}

function showLottery() {
  app.innerHTML += `
    <div class="lottery-modal">
      <div class="lottery-content">
        <div class="lottery-letter">cl</div>
        <div>Congratulations! You win the lottery event!</div>
      </div>
    </div>
  `;
}

function showLose() {
  // Accepts a type: 'tooMany' or 'notEnough'
  let message = '';
  if (arguments[0] === 'notEnough') {
    message = "You don't have everything you need.";
  } else {
    message = "You brought too many things you don't need.";
  }
  app.innerHTML += `
    <div class="lose-modal">
      <div class="lose-content">
        <div class="lose-message">${message}</div>
        <button class="reset-btn" onclick="closeLoseModal()">Continue Shopping</button>
        <button class="reset-btn" style="margin-left:10px;" onclick="restartCart()">Restart</button>
      </div>
    </div>
  `;

window.showLose = showLose;

window.restartCart = function() {
  // Reset cart to the original items.json contents and close modal
  fetch('items.json')
    .then(res => res.json())
    .then(data => {
      cartItems = JSON.parse(JSON.stringify(data.items));
      renderCart();
      closeLoseModal();
    });
};

window.closeLoseModal = function() {
  const modal = document.querySelector('.lose-modal');
  if (modal) modal.remove();
};
}

window.resetCart = function() {
  // Reset cart to the original items.json contents
  fetch('items.json')
    .then(res => res.json())
    .then(data => {
      cartItems = JSON.parse(JSON.stringify(data.items));
      renderCart();
    });
};
