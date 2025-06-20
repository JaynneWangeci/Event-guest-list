document.addEventListener('DOMContentLoaded', () => {
      const guestForm = document.getElementById('guest-form');
      const guestNameInput = document.getElementById('guest-name');
      const guestCategorySelect = document.getElementById('guest-category');
      const guestList = document.getElementById('guest-list');
      const emptyState = document.getElementById('empty-state');
      const limitWarning = document.getElementById('limit-warning');
      const guestProgress = document.getElementById('guest-progress');
      const totalGuestsElement = document.getElementById('total-guests');
      const attendingGuestsElement = document.getElementById('attending-guests');
      const remainingSpotsElement = document.getElementById('remaining-spots');
      
      let guests = [];
      const MAX_GUESTS = 10;

      addSampleGuests();
      
      guestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = guestNameInput.value.trim();
        const category = guestCategorySelect.value;
        
        if (!name) return;
        
        if (guests.length >= MAX_GUESTS) {
          showLimitWarning();
          return;
        }
        
        addGuest(name, category);
        guestNameInput.value = '';
        guestNameInput.focus();
      });
      
      function addGuest(name, category) {
        const newGuest = {
          id: Date.now(),
          name,
          category,
          attending: true,
          timestamp: new Date()
        };
        
        guests.push(newGuest);
        renderGuestList();
        updateStats();
        updateProgressBar();
      }
      
      function addSampleGuests() {
        const sampleGuests = [
          { name: "Chasty lyl", category: "friend" },
          { name: "TravishZain", category: "family" },
          { name: "Jaynne Aurelius", category: "colleague" }
        ];
        
        sampleGuests.forEach(guest => {
          addGuest(guest.name, guest.category);
        });
      }
      
      function renderGuestList() {
        if (guests.length === 0) {
          emptyState.style.display = 'block';
          return;
        }
        
        emptyState.style.display = 'none';
        guestList.innerHTML = '';
        
        guests.forEach(guest => {
          const guestItem = document.createElement('li');
          guestItem.className = 'guest-item';
          guestItem.dataset.id = guest.id;
          
          const categoryClass = `category-${guest.category}`;
          const statusClass = guest.attending ? 'status-attending' : 'status-not-attending';
          const statusText = guest.attending ? 'Attending' : 'Not Attending';
          
    
          const formattedTime = guest.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const formattedDate = guest.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
          
          guestItem.innerHTML = `
            <div class="guest-info">
              <div class="guest-name">
                ${guest.name}
                <span class="guest-category ${categoryClass}">${guest.category.charAt(0).toUpperCase() + guest.category.slice(1)}</span>
              </div>
              <div class="guest-details">
                <span class="guest-status ${statusClass}">${statusText}</span>
                <span class="timestamp">Added: ${formattedDate} at ${formattedTime}</span>
              </div>
            </div>
            <div class="guest-actions">
              <button class="action-btn toggle-btn" onclick="toggleAttendance(${guest.id})">Toggle RSVP</button>
              <button class="action-btn edit-btn" onclick="editGuest(${guest.id})">Edit</button>
              <button class="action-btn delete-btn" onclick="removeGuest(${guest.id})">Remove</button>
            </div>
          `;
          
          guestList.appendChild(guestItem);
        });
      }
      
      function updateStats() {
        totalGuestsElement.textContent = guests.length;
        
        const attendingCount = guests.filter(guest => guest.attending).length;
        attendingGuestsElement.textContent = attendingCount;
        
        const remaining = MAX_GUESTS - guests.length;
        remainingSpotsElement.textContent = remaining;
      }
      
      function updateProgressBar() {
        const percentage = (guests.length / MAX_GUESTS) * 100;
        guestProgress.style.width = `${percentage}%`;
        
        if (guests.length >= MAX_GUESTS) {
          guestProgress.style.background = 'linear-gradient(90deg, #ff6b6b, #ff8787)';
        } else {
          guestProgress.style.background = 'linear-gradient(90deg, #69db7c, #40c057)';
        }
      }
      
      function showLimitWarning() {
        limitWarning.style.display = 'block';
        
        setTimeout(() => {
          limitWarning.style.display = 'none';
        }, 3000);
      }
      
      window.toggleAttendance = function(id) {
        guests = guests.map(guest => {
          if (guest.id === id) {
            return { ...guest, attending: !guest.attending };
          }
          return guest;
        });
        
        renderGuestList();
        updateStats();
      };
      
      window.removeGuest = function(id) {
        guests = guests.filter(guest => guest.id !== id);
        renderGuestList();
        updateStats();
        updateProgressBar();
      };
      
      window.editGuest = function(id) {
        const guest = guests.find(g => g.id === id);
        if (!guest) return;
        
        const newName = prompt('Edit guest name:', guest.name);
        if (newName && newName.trim() !== '') {
          guest.name = newName.trim();
          renderGuestList();
        }
      };
      renderGuestList();
      updateStats();
      updateProgressBar();
    });