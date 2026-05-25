
document.addEventListener('DOMContentLoaded', function() {

    // 1. D-Day 카운트다운
    const dDayCounter = document.getElementById('d-day-counter');
    if (dDayCounter) {
        const weddingDate = new Date('2026-08-30T18:00:00');
        const today = new Date();
        const diff = weddingDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (daysLeft > 0) {
            dDayCounter.textContent = daysLeft;
        } else if (daysLeft === 0) {
            dDayCounter.textContent = "오늘";
        } else {
            dDayCounter.closest('.d-day').textContent = "행복한 결혼생활 시작!";
        }
    }

    // 2. 카카오맵
    const mapContainer = document.getElementById('map'); 
    if (mapContainer) {
        const mapOption = { 
            center: new kakao.maps.LatLng(37.4484, 127.0543), // 보넬리가든 (서초구 샘마루길 11) 좌표
            level: 4 
        };

        const map = new kakao.maps.Map(mapContainer, mapOption); 

        // 마커 생성
        const markerPosition  = new kakao.maps.LatLng(37.4484, 127.0543); 
        const marker = new kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map);

        // 인포윈도우 생성
        const iwContent = '<div style="padding:5px;text-align:center;font-size:0.9rem;">보넬리가든<br><a href="https://map.kakao.com/link/map/보넬리가든,37.4484,127.0543" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/보넬리가든,37.4484,127.0543" style="color:blue" target="_blank">길찾기</a></div>';
        const infowindow = new kakao.maps.InfoWindow({
            content : iwContent, 
            removable : true
        });

        kakao.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
        });
    }

    // 3. 길찾기 버튼
    const navBtn = document.querySelector('.nav-btn');
    if (navBtn) {
        navBtn.addEventListener('click', () => {
            window.open('https://map.kakao.com/link/to/보넬리가든,37.4484,127.0543');
        });
    }

    // 여기에 다른 기능들을 계속 추가할 예정입니다. 

});
