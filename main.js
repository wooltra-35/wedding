
document.addEventListener('DOMContentLoaded', () => {

    // --- Firebase Init ---
    const db = firebase.firestore();

    // --- Kakao SDK Init --- //
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('4735caea5648d5df0a21861927141a31');
    }

    // --- RSVP Modal Logic --- //
    const rsvpModal = document.getElementById('rsvp-modal');
    const openRsvpBtn = document.getElementById('open-rsvp-modal-btn');
    const closeBtn = rsvpModal.querySelector('.close-btn');
    const rsvpForm = document.getElementById('rsvp-form');
    const mealFieldset = document.getElementById('meal-fieldset');

    if (openRsvpBtn) {
        openRsvpBtn.onclick = () => rsvpModal.style.display = 'block';
    }
    if (closeBtn) {
        closeBtn.onclick = () => rsvpModal.style.display = 'none';
    }
    window.onclick = (event) => {
        if (event.target == rsvpModal) {
            rsvpModal.style.display = 'none';
        }
    };

    // Hide meal option if not attending
    rsvpForm.elements['attendance'].forEach(radio => {
        radio.onchange = (e) => {
            if (e.target.value === 'absent') {
                mealFieldset.style.display = 'none';
            } else {
                mealFieldset.style.display = 'block';
            }
        };
    });

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const contact = rsvpForm.querySelector('#rsvp-contact').value.replace(/\D/g, '');
            if (!contact || contact.length < 10) {
                alert('올바른 연락처를 입력해주세요.');
                return;
            }

            const formData = {
                name: rsvpForm.querySelector('#rsvp-name').value,
                side: rsvpForm.elements['side'].value,
                attendance: rsvpForm.elements['attendance'].value,
                meal: rsvpForm.elements['attendance'].value === 'attending' ? rsvpForm.elements['meal'].value : 'N/A',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            db.collection('rsvps').doc(contact).set(formData, { merge: true })
                .then(() => {
                    alert('참석 의사를 전달해주셔서 감사합니다.');
                    rsvpModal.style.display = 'none';
                    rsvpForm.reset();
                    mealFieldset.style.display = 'block';
                })
                .catch(error => {
                    console.error("Error writing document: ", error);
                    alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
                });
        });
    }

    // --- Guestbook Logic --- //
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');

    // Render single entry
    const renderGuestbookEntry = (doc) => {
        const entry = doc.data();
        const entryDiv = document.createElement('div');
        entryDiv.className = 'guestbook-entry';
        entryDiv.setAttribute('data-id', doc.id);

        const entryDate = entry.timestamp ? entry.timestamp.toDate().toLocaleDateString('ko-KR') : '';

        entryDiv.innerHTML = `
            <div class="entry-header">
                <strong class="entry-name">${escapeHTML(entry.name)}</strong>
                <span class="entry-date">${entryDate}</span>
            </div>
            <p class="entry-message">${escapeHTML(entry.message)}</p>
            <div class="entry-actions">
                <button class="edit-btn">수정</button>
                <button class="delete-btn">삭제</button>
            </div>
        `;
        return entryDiv;
    };

    // Listen for real-time updates
    db.collection('guestbook').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        guestbookEntries.innerHTML = '';
        snapshot.docs.forEach(doc => {
            guestbookEntries.appendChild(renderGuestbookEntry(doc));
        });
    });

    // Handle form submission
    if (guestbookForm) {
        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = guestbookForm.querySelector('#guestbook-name').value;
            const password = guestbookForm.querySelector('#guestbook-password').value;
            const message = guestbookForm.querySelector('#guestbook-message').value;

            db.collection('guestbook').add({
                name: name,
                password: password,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                guestbookForm.reset();
            }).catch(err => {
                console.error("Error adding document: ", err);
            });
        });
    }
    
    // Handle edit and delete
    if (guestbookEntries) {
        guestbookEntries.addEventListener('click', (e) => {
            const id = e.target.closest('.guestbook-entry').dataset.id;
            if (e.target.classList.contains('delete-btn')) {
                handleDelete(id);
            } else if (e.target.classList.contains('edit-btn')) {
                handleEdit(id);
            }
        });
    }

    const checkPasswordAndExecute = (id, callback) => {
        const password = prompt('비밀번호 4자리를 입력하세요.');
        if (password) {
            db.collection('guestbook').doc(id).get().then(doc => {
                if (doc.exists && doc.data().password === password) {
                    callback(doc);
                } else {
                    alert('비밀번호가 일치하지 않습니다.');
                }
            });
        }
    };

    const handleDelete = (id) => {
        checkPasswordAndExecute(id, () => {
            if (confirm('정말로 삭제하시겠습니까?')) {
                db.collection('guestbook').doc(id).delete();
            }
        });
    };

    const handleEdit = (id) => {
        checkPasswordAndExecute(id, (doc) => {
            const currentMessage = doc.data().message;
            const newMessage = prompt('메시지를 수정하세요.', currentMessage);
            if (newMessage && newMessage !== currentMessage) {
                db.collection('guestbook').doc(id).update({ message: newMessage });
            }
        });
    };

    // --- Utility to escape HTML --- //
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // --- Existing JS Code ---
    const carousel = document.querySelector('.gallery-carousel');
    if (carousel) { /* Gallery logic... */ }
    const accordions = document.querySelectorAll('.accordion');
    if (accordions.length > 0) { /* Accordion logic... */ }
    const copyButtons = document.querySelectorAll('.copy-btn');
    if (copyButtons.length > 0) { /* Copy logic... */ }
    createCalendar(2026, 8);
    calculateDday();
    if (window.kakao && window.kakao.maps) { /* Map logic... */ }
    const kakaoShareBtn = document.getElementById('share-kakao');
    if (kakaoShareBtn) { /* Kakao share logic... */ }
    const copyLinkBtn = document.getElementById('copy-link');
    if (copyLinkBtn) { /* Link copy logic... */ }

    // (Keep the implementation of createCalendar, calculateDday, and other existing functions here)
});
