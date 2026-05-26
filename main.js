
document.addEventListener('DOMContentLoaded', () => {

    // --- Firebase Init ---
    const firebaseConfig = {
      apiKey: "AIzaSyAfs_7ngMzczZqZmvrl7XWTR6LDOjYrtTw",
      authDomain: "wooltra35-20925108-6ae65.firebaseapp.com",
      projectId: "wooltra35-20925108-6ae65",
      storageBucket: "wooltra35-20925108-6ae65.firebasestorage.app",
      messagingSenderId: "983704910868",
      appId: "1:983704910868:web:c33bfd76dc02dbc7d33b01"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // --- Kakao SDK Init --- //
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('4735caea5648d5df0a21861927141a31');
    }

    // --- Navigation Buttons (v6.0 - Address-based coordinate retrieval for accuracy) --- //
    const kakaoNaviBtn = document.getElementById('kakaonavi-btn');
    const tmapBtn = document.getElementById('tmap-btn');
    const destinationAddress = '서울 서초구 내곡동 31-61';
    const destinationName = '보넬리가든 (주차장)';

    // Use Kakao Geocoder API to get correct coordinates from the address
    if (kakaoNaviBtn && window.kakao && window.kakao.maps && window.kakao.maps.services) {
        const geocoder = new kakao.maps.services.Geocoder();

        // Disable button until coordinates are fetched
        kakaoNaviBtn.style.pointerEvents = 'none';
        kakaoNaviBtn.style.opacity = '0.7';

        geocoder.addressSearch(destinationAddress, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const destLat = parseFloat(result[0].y);
                const destLng = parseFloat(result[0].x);

                kakaoNaviBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                    if (isMobile) {
                        if (window.Kakao && window.Kakao.isInitialized()) {
                            Kakao.Navi.start({
                                name: destinationName,
                                x: destLng,
                                y: destLat,
                                coordType: 'wgs84'
                            });
                        }
                    } else {
                        window.open(`https://map.kakao.com/link/to/${encodeURIComponent(destinationName)},${destLat},${destLng}`);
                    }
                });
                // Re-enable the button
                kakaoNaviBtn.style.pointerEvents = 'auto';
                kakaoNaviBtn.style.opacity = '1';

            } else {
                console.error('Geocoder failed for navigation address:', status);
                // Fallback to name search if geocoding fails
                kakaoNaviBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open(`https://map.kakao.com/link/search/${encodeURIComponent(destinationName)}`);
                });
                kakaoNaviBtn.style.pointerEvents = 'auto';
                kakaoNaviBtn.style.opacity = '1';
            }
        });
    } else if (kakaoNaviBtn) {
         // Fallback if Kakao SDK is not available
         kakaoNaviBtn.addEventListener('click', (e) => {
             e.preventDefault();
             window.open(`https://map.kakao.com/link/search/${encodeURIComponent(destinationName)}`);
         });
    }

    if (tmapBtn) {
        tmapBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const tmapDestinationName = '보넬리가든주차장'; // Tmap works better with no spaces
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if(isMobile) {
                window.open(`tmap://search?name=${encodeURIComponent(tmapDestinationName)}`);
            } else {
                window.open(`https://s.tmap.co.kr/search?name=${encodeURIComponent(tmapDestinationName)}`);
            }
        });
    }


    // --- NEW: Gallery Grid & Lightbox Logic --- //
    const gridItems = document.querySelectorAll('.grid-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const prevSlideBtn = document.querySelector('.prev-slide');
    const nextSlideBtn = document.querySelector('.next-slide');

    let currentImageIndex = 0;
    const images = Array.from(gridItems).map(item => item.querySelector('img').src);

    if (gridItems.length > 0) {
        gridItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentImageIndex = index;
                openLightbox(images[currentImageIndex]);
            });
        });

        const openLightbox = (src) => {
            lightboxImg.src = src;
            lightbox.style.display = 'flex';
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            lightboxImg.src = images[currentImageIndex];
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentImageIndex];
        };

        closeLightboxBtn.addEventListener('click', closeLightbox);
        prevSlideBtn.addEventListener('click', showPrevImage);
        nextSlideBtn.addEventListener('click', showNextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Click on background
                closeLightbox();
            }
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'Escape') closeLightbox();
            }
        });

        // Swipe functionality for mobile
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive: true});
        lightbox.addEventListener('touchend', e => {
            if (e.changedTouches[0].screenX < touchStartX - 50) showNextImage();
            if (e.changedTouches[0].screenX > touchStartX + 50) showPrevImage();
        });
    }

    // --- Calendar & D-Day --- //
    function createCalendar(year, month) {
        const calendarDiv = document.querySelector('.calendar');
        if (!calendarDiv) return;

        const date = new Date(year, month - 1, 1);
        const lastDate = new Date(year, month, 0).getDate();
        const startDay = date.getDay();

        let calendarHTML = '<table><thead><tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr></thead><tbody><tr>';

        let dayCount = 1;
        for (let i = 0; i < 42; i++) {
            if (i >= startDay && dayCount <= lastDate) {
                if (dayCount === 30) {
                     calendarHTML += `<td class="wedding-day"><span>${dayCount}</span></td>`;
                } else {
                     calendarHTML += `<td>${dayCount}</td>`;
                }
                dayCount++;
            } else {
                calendarHTML += '<td></td>';
            }
            if (i % 7 === 6) {
                calendarHTML += '</tr><tr>';
            }
        }
        calendarHTML += '</tbody></table>';
        calendarDiv.innerHTML = calendarHTML;
    }

    function calculateDday() {
        const dDayDiv = document.querySelector('.d-day');
        if (!dDayDiv) return;
        
        const weddingDate = new Date('2026-08-30').getTime();
        const today = new Date().getTime();
        const diff = weddingDate - today;
        const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (daysLeft > 0) {
            dDayDiv.textContent = `상모와 유나의 결혼식이 ${daysLeft}일 남았습니다.`;
        } else if (daysLeft === 0) {
            dDayDiv.textContent = '상모와 유나의 결혼식, 바로 오늘입니다!';
        } else {
            dDayDiv.textContent = `상모와 유나의 결혼식이 ${-daysLeft}일 지났습니다.`;
        }
    }
    createCalendar(2026, 8);
    calculateDday();
    

    // --- Accordion Logic --- //
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(accordion => {
        accordion.addEventListener('click', () => {
            const panel = accordion.nextElementSibling;
            const icon = accordion.querySelector('.accordion-icon');
            
            // Close other accordions
            accordions.forEach(otherAccordion => {
                if (otherAccordion !== accordion) {
                    const otherPanel = otherAccordion.nextElementSibling;
                    const otherIcon = otherAccordion.querySelector('.accordion-icon');
                    otherPanel.style.maxHeight = null;
                    if(otherIcon) otherIcon.textContent = '+';
                    otherAccordion.classList.remove('active');
                }
            });

            // Toggle current accordion
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                if(icon) icon.textContent = '+';
                accordion.classList.remove('active');
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                if(icon) icon.textContent = '−';
                accordion.classList.add('active');
            }
        });
    });

    // --- Copy to Clipboard (NEW) --- //
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('copyable-account')) {
            const account = e.target.dataset.account;
            navigator.clipboard.writeText(account).then(() => {
                alert('계좌번호가 복사되었습니다.');
            }).catch(err => {
                alert('복사에 실패했습니다.');
            });
        }
    });

    // --- Kakao Map Logic --- //
    const mapContainer = document.getElementById('map');
    if (mapContainer && window.kakao && window.kakao.maps && window.kakao.maps.services) {
        const geocoder = new kakao.maps.services.Geocoder();
        const weddingAddress = '서울 서초구 샘마루길 11'; // 지도는 예식장 위치를 표시

        geocoder.addressSearch(weddingAddress, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                const mapOption = {
                    center: coords,
                    level: 4
                };
                const map = new kakao.maps.Map(mapContainer, mapOption);

                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                const infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">보넬리가든</div>'
                });
                infowindow.open(map, marker);
                
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if(isMobile) {
                    mapContainer.addEventListener('click', function() {
                        window.open('https://map.kakao.com/?urlX=515725.0000000028&urlY=1098990&urlLevel=3&itemId=1911712146&q=%EB%B3%B4%EB%84%AC%EB%A6%AC%EA%B0%80%EB%93%A0&srcid=1911712146&map_type=TYPE_MAP');
                    });
                    map.setDraggable(false);
                    map.setZoomable(false);
                } 
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }

    // --- Share Logic --- //
    const kakaoShareBtn = document.getElementById('share-kakao');
    if (kakaoShareBtn && window.Kakao) {
        kakaoShareBtn.addEventListener('click', () => {
            const currentUrl = 'https://wedding-p2c.pages.dev';
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '상모와 유나의 결혼식에 초대합니다',
                    description: '2026년 8월 30일, 저희의 첫걸음을 함께 축복해주세요.',
                    imageUrl: `${currentUrl}/images/thumbnail.png`,
                    link: {
                        mobileWebUrl: currentUrl,
                        webUrl: currentUrl
                    }
                },
                buttons: [
                    {
                        title: '청첩장 보기',
                        link: {
                            mobileWebUrl: currentUrl,
                            webUrl: currentUrl
                        }
                    }
                ]
            });
        });
    }

    const copyLinkBtn = document.getElementById('copy-link');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const currentUrl = 'https://wedding-p2c.pages.dev';
            navigator.clipboard.writeText(currentUrl).then(() => {
                alert('청첩장 링크가 복사되었습니다.');
            });
        });
    }

    // --- RSVP Modal Logic (Reverted to Firebase) --- //
    const rsvpModal = document.getElementById('rsvp-modal');
    const openRsvpBtn = document.getElementById('open-rsvp-modal-btn');
    if (rsvpModal) {
        const closeBtn = rsvpModal.querySelector('.close-btn');
        const rsvpForm = document.getElementById('rsvp-form');
        const mealFieldset = document.getElementById('meal-fieldset');

        if (openRsvpBtn) {
            openRsvpBtn.onclick = () => rsvpModal.style.display = 'flex';
        }
        if (closeBtn) {
            closeBtn.onclick = () => rsvpModal.style.display = 'none';
        }
        window.onclick = (event) => {
            if (event.target == rsvpModal) {
                rsvpModal.style.display = 'none';
            }
        };

        if (rsvpForm) {
            const attendanceRadios = rsvpForm.elements['attendance'];
            if (attendanceRadios) {
                Array.from(attendanceRadios).forEach(radio => {
                    radio.onchange = (e) => {
                        if (e.target.value === 'absent') {
                            mealFieldset.style.display = 'none';
                        } else {
                            mealFieldset.style.display = 'block';
                        }
                    };
                });
            }

            rsvpForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = rsvpForm.querySelector('#submit-rsvp-btn');
                
                const formData = {
                    name: rsvpForm.elements.name.value,
                    contact: rsvpForm.elements.contact.value,
                    side: rsvpForm.elements.side.value,
                    attendance: rsvpForm.elements.attendance.value,
                    meal: rsvpForm.elements.attendance.value === 'attending' ? rsvpForm.elements.meal.value : 'N/A',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };

                if (!formData.name || !formData.contact) {
                    alert('성함과 연락처를 모두 입력해주세요.');
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent = '전달 중...';

                db.collection('rsvp').add(formData).then(() => {
                    alert('참석 의사를 전달해주셔서 감사합니다.');
                    rsvpModal.style.display = 'none';
                    rsvpForm.reset();
                    mealFieldset.style.display = 'block'; // Reset fieldset visibility
                }).catch(err => {
                    console.error("Error adding document: ", err);
                    alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
                }).finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '참석 의사 전달하기';
                });
            });
        }
    }

    // --- Guestbook Logic (with Edit/Delete) --- //
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const yy = date.getFullYear().toString().slice(-2);
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const dd = date.getDate().toString().padStart(2, '0');
        const hh = date.getHours().toString().padStart(2, '0');
        const min = date.getMinutes().toString().padStart(2, '0');
        return `${yy}. ${mm}. ${dd} ${hh}:${min}`;
    };

    // Render single entry
    const renderGuestbookEntry = (doc) => {
        const entry = doc.data();
        const entryDiv = document.createElement('div');
        entryDiv.className = 'guestbook-entry';
        entryDiv.setAttribute('data-id', doc.id);
        const entryDate = formatTimestamp(entry.timestamp);

        entryDiv.innerHTML = `
            <div class="entry-actions">
                <button class="edit-btn">수정</button>
                <button class="delete-btn">삭제</button>
            </div>
            <div class="entry-header">
                <strong class="entry-name">${escapeHTML(entry.name)}</strong>
                <span class="entry-date">${entryDate}</span>
            </div>
            <p class="entry-message">${escapeHTML(entry.message)}</p>
        `;
        return entryDiv;
    };

    // Fetch and display entries
    if (guestbookEntries) {
        db.collection('guestbook').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            guestbookEntries.innerHTML = '';
            snapshot.docs.forEach(doc => {
                guestbookEntries.appendChild(renderGuestbookEntry(doc));
            });
        });
    }

    // Handle form submission
    if (guestbookForm) {
        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = guestbookForm.querySelector('#submit-guestbook');
            const nameInput = guestbookForm.querySelector('#guestbook-name');
            const passwordInput = guestbookForm.querySelector('#guestbook-password');
            const messageInput = guestbookForm.querySelector('#guestbook-message');

            if (!nameInput.value || !passwordInput.value || !messageInput.value) {
                alert('이름, 비밀번호, 메시지를 모두 입력해주세요.');
                return;
            }
            if (!/^\d{4}$/.test(passwordInput.value)) {
                 alert('비밀번호는 숫자 4자리로 입력해주세요.');
                 return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = '등록 중...';

            db.collection('guestbook').add({
                name: nameInput.value,
                password: passwordInput.value, // In a real app, hash this!
                message: messageInput.value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                guestbookForm.reset();
            }).catch(err => {
                console.error("Error adding document: ", err);
                alert('메시지 등록 중 오류가 발생했습니다.');
            }).finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = '남기기';
            });
        });
    }
    
    // Handle Edit and Delete Clicks
    if (guestbookEntries) {
        guestbookEntries.addEventListener('click', (e) => {
            const entryDiv = e.target.closest('.guestbook-entry');
            if (!entryDiv) return;
            const id = entryDiv.dataset.id;

            if (e.target.classList.contains('delete-btn')) {
                handleDelete(id);
            } else if (e.target.classList.contains('edit-btn')) {
                handleEdit(id);
            }
        });
    }

    const checkPasswordAndExecute = (id, callback) => {
        const masterPassword = '3535';
        const password = prompt('글 작성 시 입력했던 비밀번호 4자리를 입력하세요.');
        if (password) {
            db.collection('guestbook').doc(id).get().then(doc => {
                if (!doc.exists) {
                    alert('해당 메시지를 찾을 수 없습니다.');
                    return;
                }
                // Check for master password OR original password
                if (password === masterPassword || doc.data().password === password) {
                    callback(doc);
                } else {
                    alert('비밀번호가 일치하지 않습니다.');
                }
            }).catch(err => {
                 alert('오류가 발생했습니다.');
                 console.error(err);
            });
        }
    };

    const handleDelete = (id) => {
        checkPasswordAndExecute(id, () => {
            if (confirm('정말로 이 메시지를 삭제하시겠습니까?')) {
                db.collection('guestbook').doc(id).delete().catch(err => {
                    alert('삭제 중 오류가 발생했습니다.');
                    console.error(err);
                });
            }
        });
    };

    const handleEdit = (id) => {
        checkPasswordAndExecute(id, (doc) => {
            const currentMessage = doc.data().message;
            const newMessage = prompt('메시지를 수정하세요.', currentMessage);
            if (newMessage && newMessage !== currentMessage) {
                db.collection('guestbook').doc(id).update({ message: newMessage }).catch(err => {
                     alert('수정 중 오류가 발생했습니다.');
                     console.error(err);
                });
            }
        });
    };

    const escapeHTML = (str) => {
      if (!str) return '';
      const p = document.createElement('p');
      p.appendChild(document.createTextNode(str));
      return p.innerHTML;
    }

    // --- Petal Animation Logic (Canvas) ---
    const canvas = document.getElementById('petal-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];

        const particleSettings = {
            count: 20, // Number of petals - REDUCED
            colors: ['rgba(255, 182, 193, 0.7)', 'rgba(248, 200, 220, 0.7)', 'rgba(255, 218, 185, 0.7)', 'rgba(254, 250, 224, 0.8)'], // White changed to light yellow
            minSize: 5,
            maxSize: 12,
            minSpeedY: 0.5,
            maxSpeedY: 2,
            minSpeedX: -0.5,
            maxSpeedX: 0.5,
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height * 2 - height; // Start from above the screen
                this.w = Math.random() * (particleSettings.maxSize - particleSettings.minSize) + particleSettings.minSize;
                this.h = this.w * 0.8;
                this.color = particleSettings.colors[Math.floor(Math.random() * particleSettings.colors.length)];
                this.speedY = Math.random() * (particleSettings.maxSpeedY - particleSettings.minSpeedY) + particleSettings.minSpeedY;
                this.speedX = Math.random() * (particleSettings.maxSpeedX - particleSettings.minSpeedX) + particleSettings.minSpeedX;
                
                // Enhanced rotation for 3D effect
                this.angle = Math.random() * 360;
                this.spin = (Math.random() - 0.5) * 3; // Base rotation speed
                this.oscillation = Math.random() * 2 * Math.PI; // Initial phase for tumble
                this.oscillationSpeed = (Math.random() - 0.5) * 0.1; // Tumble speed
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.angle += this.spin;
                this.oscillation += this.oscillationSpeed;

                // Reset particle when it goes off screen
                if (this.y > height + this.h * 2) { // Added buffer
                    this.y = -this.h;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle * Math.PI / 180);
                
                // Apply tumbling effect by scaling the horizontal axis
                const scaleX = Math.sin(this.oscillation);
                ctx.scale(scaleX, 1);

                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.w, this.h, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.restore();
            }
        }

        function init() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleSettings.count; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', init);
        init();
        animate();
    }


    // --- Text Writing Animation --- //
    if (typeof anime !== 'undefined') {
        const textWrappers = document.querySelectorAll('.text-animation');
        textWrappers.forEach((wrapper, index) => {
            wrapper.innerHTML = wrapper.textContent.replace(/./g, "<span class='letter'>$&</span>");
            anime.timeline({ loop: false })
              .add({
                targets: wrapper.querySelectorAll('.letter'),
                opacity: [0, 1],
                translateY: ["1.1em", 0],
                rotateZ: [15, 0],
                duration: 800,
                easing: "easeOutExpo",
                delay: (el, i) => 50 * i + (index * 500) // Stagger animation for multiple elements
              });
        });
    }

    // --- Scroll-based Fade-in Animation --- //
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeInSections.forEach(section => {
            observer.observe(section);
        });
    }
});
