// Shopping Cart App for Room Escape Game
const app = document.getElementById('app');

let truthItems = [];
let cartItems = [];

// Fetch the truth.json file
fetch('truth.json')
  .then(res => res.json())
  .then(data => {
    truthItems = data.items;
    cartItems = JSON.parse(JSON.stringify(truthItems));
    renderCart();
  });

function renderCart() {
  app.innerHTML = `
    <div class="cart-title">Shopping Cart</div>
    <div class="cart-list">
      ${cartItems.map((item, idx) => `
        <div class="cart-item">
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
    showLose();
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
        <button class="reset-btn" onclick="resetCart()">Play Again</button>
      </div>
    </div>
  `;
}

function showLose() {
  app.innerHTML += `
    <div class="lose-modal">
      <div class="lose-content">
        <div class="lose-message">You brought too many things you don't need.</div>
        <button class="reset-btn" onclick="resetCart()">Try Again</button>
      </div>
    </div>
  `;
}

window.resetCart = function() {
  cartItems = JSON.parse(JSON.stringify(truthItems));
  renderCart();
};
