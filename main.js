
document.addEventListener('DOMContentLoaded', () => {
    // Gallery
    const galleryImages = document.querySelectorAll('.gallery-images img');
    const prevButton = document.querySelector('.gallery .prev');
    const nextButton = document.querySelector('.gallery .next');
    let currentIndex = 0;

    function showImage(index) {
        galleryImages.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        showImage(currentIndex);
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(currentIndex);
    }

    if (prevButton && nextButton) {
        nextButton.addEventListener('click', showNextImage);
        prevButton.addEventListener('click', showPrevImage);
    }

    if (galleryImages.length > 0) {
        const activeImage = document.querySelector('.gallery-images img.active');
        if (activeImage) {
            currentIndex = Array.from(galleryImages).indexOf(activeImage);
        } else {
            currentIndex = 0;
            showImage(currentIndex);
        }
    }

    // Kakao Map
    if (typeof kakao !== 'undefined' && typeof kakao.maps !== 'undefined') {
        kakao.maps.load(() => {
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                const mapOption = {
                    center: new kakao.maps.LatLng(37.4980044, 127.0277063), // 강남역
                    level: 3
                };

                const map = new kakao.maps.Map(mapContainer, mapOption);

                const markerPosition = new kakao.maps.LatLng(37.4980044, 127.0277063);
                const marker = new kakao.maps.Marker({
                    position: markerPosition
                });
                marker.setMap(map);

                const iwContent = '<div style="padding:5px;">웨딩팰리스<br><a href="https://map.kakao.com/link/map/웨딩팰리스,37.4980044,127.0277063" style="color:blue" target="_blank">길찾기</a></div>';
                const infowindow = new kakao.maps.InfoWindow({
                    content: iwContent
                });
                infowindow.open(map, marker);
            }
        });
    }
});
