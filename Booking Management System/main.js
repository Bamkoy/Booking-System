  let bookings = [];
        let clients = [];
        let currentDate = new Date();

        document.addEventListener('DOMContentLoaded', function() {
            loadSampleData();
            renderCalendar();
            updateDashboard();
            renderBookings();
            renderClients();
            setMinDate();
        });

        function setMinDate() {
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('bookingDate');
            if (dateInput) {
                dateInput.min = today;
            }
        }

        function loadSampleData() {
            const today = new Date().toISOString().split('T')[0];
            
            bookings = [
                {
                    id: 1,
                    clientName: 'Emma Wilson',
                    phone: '555-0101',
                    service: 'Haircut',
                    stylist: 'Sarah Johnson',
                    date: today,
                    time: '10:00',
                    status: 'confirmed',
                    notes: 'Regular client'
                },
                {
                    id: 2,
                    clientName: 'John Smith',
                    phone: '555-0102',
                    service: 'Hair Coloring',
                    stylist: 'Emily Chen',
                    date: today,
                    time: '14:30',
                    status: 'pending',
                    notes: ''
                }
            ];

            clients = [
                { id: 1, name: 'Emma Wilson', email: 'emma@email.com', phone: '555-0101', services: 'Haircut, Manicure' },
                { id: 2, name: 'John Smith', email: 'john@email.com', phone: '555-0102', services: 'Hair Coloring' }
            ];
        }

        function switchTab(event, tabName) {
            const allTabs = document.querySelectorAll('.tab-content');
            const allButtons = document.querySelectorAll('.nav-tab');
            
            allTabs.forEach(function(tab) {
                tab.classList.remove('active');
            });
            
            allButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            const targetTab = document.getElementById(tabName);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            if (event && event.target) {
                event.target.classList.add('active');
            }

            if (tabName === 'calendar') renderCalendar();
            if (tabName === 'dashboard') updateDashboard();
            if (tabName === 'bookings') renderBookings();
            if (tabName === 'clients') renderClients();
        }

        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const monthElement = document.getElementById('currentMonth');
            if (monthElement) {
                monthElement.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            }

            let html = '';
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            days.forEach(function(day) {
                html += '<div class="calendar-header">' + day + '</div>';
            });

            for (let i = 0; i < firstDay; i++) {
                html += '<div class="calendar-day"></div>';
            }

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                const isToday = dateStr === todayStr;
                const dayBookings = bookings.filter(function(b) {
                    return b.date === dateStr;
                });

                html += '<div class="calendar-day ' + (isToday ? 'today' : '') + '" onclick="showDayBookings(\'' + dateStr + '\')">';
                html += '<div class="day-number">' + day + '</div>';
                
                dayBookings.forEach(function(b) {
                    html += '<div class="appointment-item">' + b.time + ' - ' + b.clientName + '</div>';
                });

                html += '</div>';
            }

            const calendarGrid = document.getElementById('calendarGrid');
            if (calendarGrid) {
                calendarGrid.innerHTML = html;
            }
        }

        function prevMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        }

        function nextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        }

        function showDayBookings(date) {
            const dayBookings = bookings.filter(function(b) {
                return b.date === date;
            });
            
            if (dayBookings.length === 0) {
                alert('No appointments scheduled for this day.');
                return;
            }
            
            let message = 'Appointments for ' + date + ':\n\n';
            dayBookings.forEach(function(b) {
                message += b.time + ' - ' + b.clientName + ' (' + b.service + ')\n';
            });
            alert(message);
        }

        function updateDashboard() {
            const today = new Date().toISOString().split('T')[0];
            const todayBookings = bookings.filter(function(b) {
                return b.date === today;
            });
            
            const weekStart = new Date();
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() + 7);
            
            const weekBookings = bookings.filter(function(b) {
                const bDate = new Date(b.date);
                return bDate >= weekStart && bDate <= weekEnd;
            });

            const pending = bookings.filter(function(b) {
                return b.status === 'pending';
            });

            const todayCountEl = document.getElementById('todayCount');
            const weekCountEl = document.getElementById('weekCount');
            const clientCountEl = document.getElementById('clientCount');
            const pendingCountEl = document.getElementById('pendingCount');

            if (todayCountEl) todayCountEl.textContent = todayBookings.length;
            if (weekCountEl) weekCountEl.textContent = weekBookings.length;
            if (clientCountEl) clientCountEl.textContent = clients.length;
            if (pendingCountEl) pendingCountEl.textContent = pending.length;

            let scheduleHtml = '';
            if (todayBookings.length === 0) {
                scheduleHtml = '<div class="empty-state"><p>No appointments scheduled for today.</p></div>';
            } else {
                todayBookings.sort(function(a, b) {
                    return a.time.localeCompare(b.time);
                });
                
                todayBookings.forEach(function(b) {
                    scheduleHtml += '<div class="appointment-card">';
                    scheduleHtml += '<div class="appointment-header">';
                    scheduleHtml += '<span class="appointment-time">' + b.time + '</span>';
                    scheduleHtml += '<span class="status-badge status-' + b.status + '">' + b.status.toUpperCase() + '</span>';
                    scheduleHtml += '</div>';
                    scheduleHtml += '<div class="appointment-details">';
                    scheduleHtml += '<strong>' + b.clientName + '</strong> - ' + b.service + '<br>';
                    scheduleHtml += 'Stylist: ' + b.stylist + '<br>';
                    scheduleHtml += 'Phone: ' + b.phone;
                    scheduleHtml += '</div>';
                    scheduleHtml += '</div>';
                });
            }
            
            const scheduleEl = document.getElementById('todaySchedule');
            if (scheduleEl) {
                scheduleEl.innerHTML = scheduleHtml;
            }
        }

        function renderBookings() {
            let html = '';
            const sorted = bookings.slice().sort(function(a, b) {
                const dateCompare = b.date.localeCompare(a.date);
                if (dateCompare !== 0) return dateCompare;
                return b.time.localeCompare(a.time);
            });

            sorted.forEach(function(b) {
                html += '<div class="appointment-card">';
                html += '<div class="appointment-header">';
                html += '<div><span class="appointment-time">' + b.date + ' at ' + b.time + '</span></div>';
                html += '<div>';
                html += '<span class="status-badge status-' + b.status + '">' + b.status.toUpperCase() + '</span>';
                html += '<button class="btn btn-danger" onclick="deleteBooking(' + b.id + ')" style="margin-left: 10px; padding: 5px 15px;">Delete</button>';
                html += '</div>';
                html += '</div>';
                html += '<div class="appointment-details">';
                html += '<strong>Client:</strong> ' + b.clientName + ' (' + b.phone + ')<br>';
                html += '<strong>Service:</strong> ' + b.service + '<br>';
                html += '<strong>Stylist:</strong> ' + b.stylist;
                if (b.notes) {
                    html += '<br><strong>Notes:</strong> ' + b.notes;
                }
                html += '</div>';
                html += '</div>';
            });

            const bookingsListEl = document.getElementById('bookingsList');
            if (bookingsListEl) {
                bookingsListEl.innerHTML = html || '<div class="empty-state"><p>No bookings yet.</p></div>';
            }
        }

        function renderClients() {
            let html = '';
            clients.forEach(function(c) {
                html += '<div class="client-card">';
                html += '<div class="client-name">' + c.name + '</div>';
                html += '<div class="client-info">📧 ' + (c.email || 'N/A') + '</div>';
                html += '<div class="client-info">📞 ' + c.phone + '</div>';
                html += '<div class="client-info">💇 Preferred: ' + (c.services || 'N/A') + '</div>';
                html += '<button class="btn btn-danger" onclick="deleteClient(' + c.id + ')" style="margin-top: 10px;">Delete</button>';
                html += '</div>';
            });

            const clientsListEl = document.getElementById('clientsList');
            if (clientsListEl) {
                clientsListEl.innerHTML = html || '<div class="empty-state"><p>No clients yet.</p></div>';
            }
        }

        function openBookingModal() {
            const modal = document.getElementById('bookingModal');
            if (modal) {
                modal.classList.add('active');
            }
        }

        function closeBookingModal() {
            const modal = document.getElementById('bookingModal');
            if (modal) {
                modal.classList.remove('active');
                const form = modal.querySelector('form');
                if (form) {
                    form.reset();
                }
            }
        }

        function openClientModal() {
            const modal = document.getElementById('clientModal');
            if (modal) {
                modal.classList.add('active');
            }
        }

        function closeClientModal() {
            const modal = document.getElementById('clientModal');
            if (modal) {
                modal.classList.remove('active');
                const form = modal.querySelector('form');
                if (form) {
                    form.reset();
                }
            }
        }

        function saveBooking(e) {
            e.preventDefault();
            
            const booking = {
                id: Date.now(),
                clientName: document.getElementById('clientName').value,
                phone: document.getElementById('clientPhone').value,
                service: document.getElementById('service').value,
                stylist: document.getElementById('stylist').value,
                date: document.getElementById('bookingDate').value,
                time: document.getElementById('bookingTime').value,
                status: 'confirmed',
                notes: document.getElementById('bookingNotes').value
            };

            bookings.push(booking);
            closeBookingModal();
            renderBookings();
            updateDashboard();
            renderCalendar();
            alert('Booking created successfully!');
        }

        function saveClient(e) {
            e.preventDefault();
            
            const client = {
                id: Date.now(),
                name: document.getElementById('newClientName').value,
                email: document.getElementById('newClientEmail').value,
                phone: document.getElementById('newClientPhone').value,
                services: document.getElementById('newClientServices').value
            };

            clients.push(client);
            closeClientModal();
            renderClients();
            updateDashboard();
            alert('Client added successfully!');
        }

        function deleteBooking(id) {
            if (confirm('Are you sure you want to delete this booking?')) {
                bookings = bookings.filter(function(b) {
                    return b.id !== id;
                });
                renderBookings();
                updateDashboard();
                renderCalendar();
            }
        }

        function deleteClient(id) {
            if (confirm('Are you sure you want to delete this client?')) {
                clients = clients.filter(function(c) {
                    return c.id !== id;
                });
                renderClients();
                updateDashboard();
            }
        }

        function filterBookings() {
            const searchInput = document.getElementById('searchBookings');
            if (!searchInput) return;
            
            const search = searchInput.value.toLowerCase();
            const filtered = bookings.filter(function(b) {
                return b.clientName.toLowerCase().includes(search) ||
                       b.service.toLowerCase().includes(search) ||
                       b.date.includes(search);
            });

            let html = '';
            filtered.forEach(function(b) {
                html += '<div class="appointment-card">';
                html += '<div class="appointment-header">';
                html += '<div><span class="appointment-time">' + b.date + ' at ' + b.time + '</span></div>';
                html += '<div>';
                html += '<span class="status-badge status-' + b.status + '">' + b.status.toUpperCase() + '</span>';
                html += '<button class="btn btn-danger" onclick="deleteBooking(' + b.id + ')" style="margin-left: 10px; padding: 5px 15px;">Delete</button>';
                html += '</div>';
                html += '</div>';
                html += '<div class="appointment-details">';
                html += '<strong>Client:</strong> ' + b.clientName + ' (' + b.phone + ')<br>';
                html += '<strong>Service:</strong> ' + b.service + '<br>';
                html += '<strong>Stylist:</strong> ' + b.stylist;
                if (b.notes) {
                    html += '<br><strong>Notes:</strong> ' + b.notes;
                }
                html += '</div>';
                html += '</div>';
            });

            const bookingsListEl = document.getElementById('bookingsList');
            if (bookingsListEl) {
                bookingsListEl.innerHTML = html || '<div class="empty-state"><p>No bookings match your search.</p></div>';
            }
        }

        function filterClients() {
            const searchInput = document.getElementById('searchClients');
            if (!searchInput) return;
            
            const search = searchInput.value.toLowerCase();
            const filtered = clients.filter(function(c) {
                return c.name.toLowerCase().includes(search) ||
                       c.phone.includes(search) ||
                       (c.email && c.email.toLowerCase().includes(search));
            });

            let html = '';
            filtered.forEach(function(c) {
                html += '<div class="client-card">';
                html += '<div class="client-name">' + c.name + '</div>';
                html += '<div class="client-info">📧 ' + (c.email || 'N/A') + '</div>';
                html += '<div class="client-info">📞 ' + c.phone + '</div>';
                html += '<div class="client-info">💇 Preferred: ' + (c.services || 'N/A') + '</div>';
                html += '<button class="btn btn-danger" onclick="deleteClient(' + c.id + ')" style="margin-top: 10px;">Delete</button>';
                html += '</div>';
            });

            const clientsListEl = document.getElementById('clientsList');
            if (clientsListEl) {
                clientsListEl.innerHTML = html || '<div class="empty-state"><p>No clients match your search.</p></div>';
            }
        }