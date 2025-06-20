    document.addEventListener('DOMContentLoaded', function() {
  const guestForm = document.getElementById('guest-form');
  const guestNameInput = document.getElementById('guest-name');
  const guestCategorySelect = document.getElementById('guest-category');
  const guestList = document.getElementById('guest-list');
  
  let guests = [];
  const MAX_GUESTS = 10;

  
  if (localStorage.getItem('guests')) {
    guests = JSON.parse(localStorage.getItem('guests'));
    renderGuestList();
  }
  guestForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = guestNameInput.value.trim();
    const category = guestCategorySelect.value;
    
    if (!name) return;
    
    if (guests.length >= MAX_GUESTS) {
      alert(`Sorry, the guest list is limited to ${MAX_GUESTS} people.`);
      return;
    }
    const newGuest = {
      id: Date.now(),
      name,
      category,
      attending: true,
      timestamp: new Date().toLocaleString()
    };

    guests.push(newGuest);
    saveGuests();
    renderGuestList();
    
    guestNameInput.value = '';
    guestNameInput.focus();
  });
  function renderGuestList() {
    guestList.innerHTML = '';
    
    guests.forEach(guest => {
      const guestItem = document.createElement('div');
      guestItem.className = `guest-item ${guest.category}`;
      guestItem.dataset.id = guest.id;
      
      const guestInfo = document.createElement('div');
      guestInfo.className = 'guest-info';
      
      const guestName = document.createElement('div');
      guestName.className = `guest-name ${guest.attending ? 'attending' : 'not-attending'}`;
      guestName.textContent = guest.name;
      
      const guestCategory = document.createElement('div');
      guestCategory.className = 'guest-category';
      guestCategory.textContent = `Category: ${guest.category.charAt(0).toUpperCase() + guest.category.slice(1)}`;
      
      const guestTime = document.createElement('div');
      guestTime.className = 'guest-time';
      guestTime.textContent = `Added: ${guest.timestamp}`;
      
      guestInfo.appendChild(guestName);
      guestInfo.appendChild(guestCategory);
      guestInfo.appendChild(guestTime);
      
      const guestActions = document.createElement('div');
      guestActions.className = 'guest-actions';
      
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'toggle-btn';
      toggleBtn.textContent = guest.attending ? 'Not Attending' : 'Attending';
      toggleBtn.addEventListener('click', () => toggleAttendance(guest.id));
      
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => editGuest(guest.id));
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => removeGuest(guest.id));
      
      guestActions.appendChild(toggleBtn);
      guestActions.appendChild(editBtn);
      guestActions.appendChild(removeBtn);
      
      guestItem.appendChild(guestInfo);
      guestItem.appendChild(guestActions);
      
      guestList.appendChild(guestItem);
    });
  }
  function toggleAttendance(id) {
    const guest = guests.find(g => g.id === id);
    if (guest) {
      guest.attending = !guest.attending;
      saveGuests();
      renderGuestList();
    }
  }
   function editGuest(id) {
    const guest = guests.find(g => g.id === id);
    if (!guest) return;
    
    const newName = prompt('Edit guest name:', guest.name);
    if (newName && newName.trim() !== '') {
      guest.name = newName.trim();
      guest.timestamp = new Date().toLocaleString();
      saveGuests();
      renderGuestList();
    }
  }

  function removeGuest(id) {
    if (confirm('Are you sure you want to remove this guest?')) {
      guests = guests.filter(guest => guest.id !== id);
      saveGuests();
      renderGuestList();
    }
  }

  function saveGuests() {
    localStorage.setItem('guests', JSON.stringify(guests));
  }
}); 