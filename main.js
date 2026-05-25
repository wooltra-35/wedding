
document.addEventListener('DOMContentLoaded', () => {

    // --- Kakao SDK Init --- //
    if (window.Kakao && !window.Kakao.isInitialized()) {
        // IMPORTANT: Replace with your actual Kakao App JavaScript Key
        window.Kakao.init('4735caea5648d5df0a21861927141a31');
    }

    // --- Photo Gallery --- //
    const carousel = document.querySelector('.gallery-carousel');
    if (carousel) {
        const images = carousel.querySelectorAll('img');
        const totalImages = images.length;
        let currentIndex = 0;

        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        function updateCarousel() {
            const offset = -currentIndex * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateCarousel();
        });
    }

    // --- Accordion for Bank Accounts --- //
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            accordions.forEach(other => { if (other !== accordion) other.classList.remove('active'); });
            accordion.classList.toggle('active');
        });
    });

    // --- Copy to Clipboard for Accounts --- //
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const accountNumber = e.currentTarget.dataset.account;
            navigator.clipboard.writeText(accountNumber).then(() => alert('계좌번호가 복사되었습니다.'));
        });
    });

    // --- Calendar & D-Day --- //
    const weddingDate = new Date('2026-08-30T18:00:00');
    createCalendar(2026, 8);
    calculateDday();

    function createCalendar(year, month) {
        const calendarContainer = document.querySelector('.calendar');
        if (!calendarContainer) return;
        const monthFirstDay = new Date(year, month - 1, 1).getDay();
        const monthLastDate = new Date(year, month, 0).getDate();

        let calendarHTML = `
            <div class="month-header">${year}년 ${month}월</div>
            <table>
                <thead>
                    <tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr>
                </thead>
                <tbody>
        `;

        let date = 1;
        let calendarWeek = '';
        for (let i = 0; i < 6; i++) {
            calendarWeek += '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < monthFirstDay) {
                    calendarWeek += '<td></td>';
                } else if (date > monthLastDate) {
                    calendarWeek += '<td></td>';
                } else {
                    if (date === 30) {
                        calendarWeek += `<td class="wedding-day"><span>${date}</span></td>`;
                    } else {
                        calendarWeek += `<td>${date}</td>`;
                    }
                    date++;
                }
            }
            calendarWeek += '</tr>';
            if (date > monthLastDate) break;
        }

        calendarHTML += calendarWeek + '</tbody></table>';
        calendarContainer.innerHTML = calendarHTML;
    }

    function calculateDday() {
        const dDayContainer = document.querySelector('.d-day');
        if (!dDayContainer) return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weddingDay = new Date(weddingDate);
        weddingDay.setHours(0, 0, 0, 0);
        const timeDiff = weddingDay.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft > 0) {
            dDayContainer.innerHTML = `상모와 유나의 결혼식까지 <span class="d-day-highlight">${daysLeft}일</span> 남았습니다.`;
        } else if (daysLeft === 0) {
            dDayContainer.innerHTML = `<span class="d-day-highlight">오늘은 저희의 결혼식 날입니다!</span>`;
        } else {
            dDayContainer.innerHTML = `저희의 결혼식이 <span class="d-day-highlight">${-daysLeft}일</span> 지났습니다. 감사합니다.`;
        }
    }

    // --- Kakao Map --- //
    if (window.kakao && window.kakao.maps) {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            const mapOption = { center: new kakao.maps.LatLng(37.4615, 127.0402), level: 4 };
            const map = new kakao.maps.Map(mapContainer, mapOption);
            const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(37.4615, 127.0402) });
            marker.setMap(map);
        }
    }

    // --- Footer Buttons --- //
    const kakaoShareBtn = document.getElementById('share-kakao');
    if (kakaoShareBtn) {
        kakaoShareBtn.addEventListener('click', () => {
            window.Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: '상모와 유나의 결혼식에 초대합니다',
                    description: '2026년 8월 30일, 저희의 첫걸음을 함께 축복해주세요.',
                    imageUrl: 'https://i.ibb.co/L8yC8f7/UTK-1722-1sk.png', // Main photo
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    { title: '청첩장 보러가기', link: { mobileWebUrl: window.location.href, webUrl: window.location.href } },
                ],
            });
        });
    }

    const copyLinkBtn = document.getElementById('copy-link');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('청첩장 링크가 복사되었습니다.');
            });
        });
    }
});
