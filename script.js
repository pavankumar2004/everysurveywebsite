let surveyData = [];

// Theme toggle functionality
const toggleTheme = () => {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  if (isDark) {
    html.classList.remove('dark');
    html.classList.add('light');
    document.getElementById('moonIcon').classList.remove('hidden');
    document.getElementById('sunIcon').classList.add('hidden');
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
    document.getElementById('moonIcon').classList.add('hidden');
    document.getElementById('sunIcon').classList.remove('hidden');
  }
  
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
};

// Initialize theme and event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  const html = document.documentElement;
  
  if (savedTheme === 'dark') {
    html.classList.remove('light');
    html.classList.add('dark');
    document.getElementById('moonIcon').classList.add('hidden');
    document.getElementById('sunIcon').classList.remove('hidden');
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    document.getElementById('moonIcon').classList.remove('hidden');
    document.getElementById('sunIcon').classList.add('hidden');
  }

  // Add theme toggle event listener
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});

// Fetch and render survey data
fetch('/data.json')
  .then(response => response.json())
  .then(data => {
    surveyData = data;
    renderCards();
  })
  .catch(error => console.error('Error loading data:', error));

function renderCards() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const cardContainer = document.getElementById('cardContainer');
  
  if (!cardContainer) return;
  
  cardContainer.innerHTML = '';

  const filteredData = surveyData.filter(item => 
    item['Website Name'].toLowerCase().includes(searchTerm)
  );

  filteredData.forEach(item => {
    // Create card container with flip functionality
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    
    // Create the card with front and back sides
    const card = document.createElement('div');
    card.className = 'card';
    
    // Create front of card
    const cardFront = document.createElement('div');
    cardFront.className = 'card-side card-front bg-white dark:bg-gray-800 rounded-lg shadow-md p-6';
    
    // Create ratings section with icons
    const ratingsHtml = `
      <div class="flex items-center space-x-4 mb-4">
        ${item['Trustpilot Ratings'] !== 'Not listed' ? `
          <div class="flex items-center">
            <i class="fas fa-star text-yellow-400 mr-1"></i>
            <span class="text-sm">${item['Trustpilot Ratings']}</span>
            <i class="fas fa-shield-alt text-blue-500 ml-1"></i>
          </div>
        ` : ''}
        ${item['App Store Ratings'] !== 'Not listed' ? `
          <div class="flex items-center">
            <i class="fas fa-star text-yellow-400 mr-1"></i>
            <span class="text-sm">${item['App Store Ratings']}</span>
            <i class="fab fa-apple ml-1"></i>
          </div>
        ` : ''}
        ${item['Google Play Ratings'] !== 'Not listed' ? `
          <div class="flex items-center">
            <i class="fas fa-star text-yellow-400 mr-1"></i>
            <span class="text-sm">${item['Google Play Ratings']}</span>
            <i class="fab fa-google-play ml-1"></i>
          </div>
        ` : ''}
      </div>
    `;

    // Populate front of card
    cardFront.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <h2 class="text-xl font-bold">${item['Website Name']}</h2>
        <a href="${item['Website URL']}" target="_blank" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
      ${ratingsHtml}
      <div class="card-content space-y-2">
        <div class="flex items-center">
          <i class="fas fa-dollar-sign text-green-500 mr-2"></i>
          <span>Minimum Payout: ${item['Minimum Payout']['Other']}</span>
        </div>
        <div class="flex items-center">
          <i class="fas fa-poll text-blue-500 mr-2"></i>
          <span>Pay Per Survey: ${item['Average Pay Per Survey']['Min']} - ${item['Average Pay Per Survey']['Max']}</span>
        </div>
        <div class="flex items-center">
          <i class="fas fa-info-circle text-gray-500 mr-2"></i>
          <span>${item['Additional Notes']}</span>
        </div>
      </div>
      <div class="card-actions flex justify-between">
        <a href="redirect.html?go=${btoa(item['Website URL'])}" class="sign-up-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <i class="fas fa-user-plus mr-1"></i>
          <span>Sign Up</span>
        </a>
        <button class="details-btn bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <i class="fas fa-info-circle mr-1"></i>
          <span>Details</span>
        </button>
      </div>
    `;
    
    // Create back of card
    const cardBack = document.createElement('div');
    cardBack.className = 'card-side card-back bg-white dark:bg-gray-800 rounded-lg shadow-md p-6';
    
    // Create detailed content for back of card
    let platforms = item['Special Features']['Platform'].join(', ');
    let features = item['Special Features']['Others'].join(', ');
    let paymentMethods = item['Payment Methods'].join(', ');
    let verifications = item['Registration Requirements']['Verification'].join(', ');
    
    cardBack.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <h2 class="text-xl font-bold">${item['Website Name']}</h2>
        <button class="back-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="card-content space-y-3">
        <div>
          <h3 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">Requirements</h3>
          <div class="grid grid-cols-1 gap-1">
            <div class="flex items-center">
              <i class="fas fa-user text-gray-500 mr-2"></i>
              <span>Age: ${item['Registration Requirements']['Age']}+</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-globe text-gray-500 mr-2"></i>
              <span>Region: ${item['Registration Requirements']['Region']}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-check-circle text-gray-500 mr-2"></i>
              <span>Verification: ${verifications}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">Payment Methods</h3>
          <div class="flex items-center">
            <i class="fas fa-money-bill-wave text-gray-500 mr-2"></i>
            <span>${paymentMethods}</span>
          </div>
        </div>
        
        <div>
          <h3 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">Features</h3>
          <div class="grid grid-cols-1 gap-1">
            <div class="flex items-center">
              <i class="fas fa-mobile-alt text-gray-500 mr-2"></i>
              <span>Platforms: ${platforms}</span>
            </div>
            ${features ? `
            <div class="flex items-center">
              <i class="fas fa-star text-gray-500 mr-2"></i>
              <span>Special Features: ${features}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <div class="card-actions flex justify-center">
        <a href="redirect.html?go=${btoa(item['Website URL'])}" class="sign-up-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <i class="fas fa-user-plus mr-1"></i>
          <span>Sign Up</span>
        </a>
      </div>
    `;
    
    // Append front and back to card
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    
    // Append card to its container
    cardContainer.appendChild(card);
    
    // Append the card container to the main container
    document.getElementById('cardContainer').appendChild(cardContainer);
    
    // Add click event for Details button
    cardContainer.querySelector('.details-btn').addEventListener('click', () => {
      cardContainer.classList.add('flipped');
    });
    
    // Add click event for back button
    cardContainer.querySelector('.back-btn').addEventListener('click', () => {
      cardContainer.classList.remove('flipped');
    });
  });
}

// For backward compatibility - this function is no longer used directly
function cloackLink(websiteName, url) {
  console.log(`Cloaking link for: ${websiteName}`);
  localStorage.setItem('redirectURL', url);
  localStorage.setItem(`lastClicked_${websiteName}`, new Date().toISOString());
  
  // Redirect to the proper URL format
  window.location.href = `redirect.html?go=${btoa(url)}`;
}