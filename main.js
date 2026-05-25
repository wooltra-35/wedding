
document.addEventListener('DOMContentLoaded', function() {

    // --- Initializations --- //
    const weddingDate = new Date('2026-08-30T18:00:00');

    // --- Functions --- //
    function initCalendar() {
        const calendarContainer = document.querySelector('.calendar');
        if (!calendarContainer) return;

        const year = weddingDate.getFullYear();
        const month = weddingDate.getMonth();
        const today = new Date();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        let html = `
            <div class="calendar-header"><h3>${year}년 ${month + 1}월</h3></div>
            <div class="calendar-grid">
                <div class="day-name">일</div><div class="day-name">월</div><div class="day-name">화</div><div class="day-name">수</div><div class="day-name">목</div><div class="day-name">금</div><div class="day-name">토</div>
        `;
        for (let i = 0; i < startDayOfWeek; i++) { html += `<div class="day empty"></div>`; }
        for (let day = 1; day <= daysInMonth; day++) {
            let dayClass = 'day';
            if (year === weddingDate.getFullYear() && month === weddingDate.getMonth() && day === weddingDate.getDate()) {
                dayClass += ' wedding-day';
            } else if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayClass += ' today';
            }
            html += `<div class="${dayClass}">${day}</div>`;
        }
        html += '</div>';
        calendarContainer.innerHTML = html;
    }

    function initDDay() {
        const dDayContainer = document.querySelector('.d-day');
        if (!dDayContainer) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weddingDay = new Date(weddingDate.getTime());
        weddingDay.setHours(0, 0, 0, 0);
        const diff = weddingDay.getTime() - today.getTime();
        const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (daysLeft > 0) {
            dDayContainer.innerHTML = `<p><span class="name">상모</span> ❤️ <span class="name">유나</span>의 결혼식이 <strong style="color:var(--primary-color);">${daysLeft}</strong>일 남았습니다.</p>`;
        } else if (daysLeft === 0) {
            dDayContainer.innerHTML = `<p><span class="name">상모</span> ❤️ <span class="name">유나</span>의 결혼식, 바로 <strong style="color:var(--primary-color);">오늘</strong>입니다!</p>`;
        } else {
            dDayContainer.innerHTML = "<p>두 사람의 행복한 앞날을 축복해주세요.</p>";
        }
    }

    function initKakaoMap() {
        const mapContainer = document.getElementById('map');
        if (mapContainer && typeof kakao !== 'undefined' && kakao.maps) {
            kakao.maps.load(() => {
                const mapOption = {
                    center: new kakao.maps.LatLng(37.4484, 127.0543),
                    level: 4
                };
                const map = new kakao.maps.Map(mapContainer, mapOption);
                const markerPosition = new kakao.maps.LatLng(37.4484, 127.0543);
                const marker = new kakao.maps.Marker({ position: markerPosition });
                marker.setMap(map);
                const iwContent = '<div style="padding:5px;text-align:center;font-size:0.9rem;">보넬리가든<br><a href="https://map.kakao.com/link/map/보넬리가든,37.4484,127.0543" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/보넬리가든,37.4484,127.0543" style="color:blue" target="_blank">길찾기</a></div>';
                const infowindow = new kakao.maps.InfoWindow({ content: iwContent, removable: true });
                kakao.maps.event.addListener(marker, 'click', function () { infowindow.open(map, marker); });
            });
        }
    }

    function initGallery() {
        const container = document.querySelector('.gallery-container');
        const carousel = document.querySelector('.gallery-carousel');
        if (!carousel || !container) return;

        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const images = carousel.querySelectorAll('img');
        const imageCount = images.length;
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        function updateCarousel() {
            carousel.style.transition = 'transform 0.5s ease-in-out';
            carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
        }

        function handleGesture() {
            const touchDiff = touchEndX - touchStartX;
            if (touchDiff > 50 && currentIndex > 0) { // Swipe Right
                currentIndex--;
            } else if (touchDiff < -50 && currentIndex < imageCount - 1) { // Swipe Left
                currentIndex++;
            }
            updateCarousel();
        }

        if (imageCount > 1) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % imageCount;
                updateCarousel();
            });
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + imageCount) % imageCount;
                updateCarousel();
            });
            
            container.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });

            container.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleGesture();
            });

        } else {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        }
    }

    function initAccordions() {
        const accordions = document.querySelectorAll('.accordion-header');
        accordions.forEach(acc => {
            acc.addEventListener('click', () => {
                const panel = acc.nextElementSibling;
                const isActive = acc.classList.toggle('active');
                panel.classList.toggle('show', isActive);

                accordions.forEach(otherAcc => {
                    if (otherAcc !== acc && otherAcc.classList.contains('active')) {
                        otherAcc.classList.remove('active');
                        otherAcc.nextElementSibling.classList.remove('show');
                    }
                });
            });
        });

        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                const account = btn.dataset.account;
                navigator.clipboard.writeText(account).then(() => {
                    alert('계좌번호가 복사되었습니다.');
                }).catch(err => {
                    alert('복사에 실패했습니다.');
                    console.error('Copy failed', err);
                });
            });
        });
    }

    function initShareAndCopy() {
        const kakaoBtn = document.getElementById('share-kakao');
        const copyBtn = document.getElementById('copy-link');

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('청첩장 링크가 복사되었습니다!');
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                    alert('링크 복사에 실패했습니다.');
                });
            });
        }

        if (kakaoBtn && typeof Kakao !== 'undefined') {
            if (!Kakao.isInitialized()) {
                try {
                    Kakao.init('4735caea5648d5df0a21861927141a31');
                } catch(e) {
                    console.error("Kakao.init failed:", e)
                }
            }
            kakaoBtn.addEventListener('click', () => {
                Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                        title: '상모와 유나의 결혼식에 초대합니다',
                        description: '2026년 8월 30일, 보넬리가든에서 저희의 새로운 시작을 함께 축복해주세요.',
                        imageUrl: window.location.protocol + '//' + window.location.host + '/' + 'images/UTK_1722-1sk.jpg',
                        link: { mobileWebUrl: window.location.href, webUrl: window.location.href },
                    },
                    buttons: [{ title: '청첩장 보기', link: { mobileWebUrl: window.location.href, webUrl: window.location.href }}],
                });
            });
        }
    }

    // --- Event Listeners & Initial Function Calls --- //
    initCalendar();
    initDDay();
    initKakaoMap();
    initGallery();
    initAccordions(); // <-- 이 부분을 새로 추가했습니다!
    
    const kakaoScript = document.createElement('script');
    kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
    kakaoScript.integrity = "sha384-6tE/HE2S315kBNZ/w57E9NO1024aD3c2dRe1Y2lC/HW+2s+QZdxuGfUuE9VDEsG/"
    kakaoScript.crossOrigin = "anonymous"
    kakaoScript.onload = () => {
        initShareAndCopy();
    };
    document.head.appendChild(kakaoScript);

    const navBtn = document.querySelector('.nav-btn');
    if (navBtn) {
        navBtn.addEventListener('click', () => { window.open('https://map.kakao.com/link/to/보넬리가든,37.4484,127.0543'); });
    }
});
