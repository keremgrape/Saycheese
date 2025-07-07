document.addEventListener('DOMContentLoaded', () => {
    // Preloader (Yüklenme Ekranı)
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
        });
    }

    // Mobil Navigasyon Menüsü Toggle
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burgerMenu.classList.toggle('toggle');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burgerMenu.classList.remove('toggle');
            });
        });
    }

    // Navigasyon linklerine tıklayınca yumuşak kaydırma
    document.querySelectorAll('.nav-links a, .explore-btn').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Şansını Döndür butonu hariç diğerleri için yumuşak kaydırma
            if (this.id !== 'spinWheelBtn') {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = document.querySelector('.main-header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // Sayfa kaydırıldığında header'a gölge ekleme
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        } else {
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Basit bir "scroll-reveal" animasyonu
    const fadeInElements = document.querySelectorAll('.content-section h2, .content-section p, .image-grid, .flavor-items, .gallery-grid, .contact-form');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });

    // Hero içeriği animasyonu
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                heroContent.style.opacity = 1;
                heroContent.style.transform = 'translateY(0)';
                heroContent.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            }, 500);
        });
    }

    /* --- Şans Çarkı Fonksiyonelliği --- */
    const spinWheelBtn = document.getElementById('spinWheelBtn');
    const spinWheelModal = document.getElementById('spinWheelModal');
    const closeButton = document.querySelector('.close-button');
    const spinButton = document.getElementById('spinButton');
    const wheelResult = document.getElementById('wheelResult');
    const resultDetails = document.getElementById('resultDetails');
    const canvas = document.getElementById('spinWheelCanvas');
    const ctx = canvas.getContext('2d');

    const locations = [
        { name: "Ulu Cami", description: "Osmanlı'nın ilk camilerinden biri, ihtişamlı mimarisi ve huzurlu atmosferiyle büyüleyici." },
        { name: "Yeşil Türbe", description: "Sultan Çelebi Mehmet tarafından yaptırılan, İznik çinileriyle ünlü eşsiz bir yapı." },
        { name: "Koza Han", description: "İpek ticaretinin kalbi, tarihi atmosferi ve şirin kafeleriyle keyifli bir mola yeri." },
        { name: "Uludağ", description: "Kışın kayak, yazın doğa yürüyüşleri ve muhteşem manzaralar sunan Bursa'nın simgesi." },
        { name: "Gölyazı Köyü", description: "Bembeyaz evleri ve göl üzerindeki konumuyla kartpostallık bir balıkçı köyü." },
        { name: "Cumalıkızık Köyü", description: "UNESCO Dünya Mirası listesindeki tarihi Osmanlı köyü, dar sokakları ve otantik evleriyle zamanda yolculuk." },
        { name: "Irgandı Köprüsü", description: "Dünya üzerinde üzerinde çarşı bulunan dört köprüden biri, el sanatları dükkanlarıyla dolu." },
        { name: "Tophane Saat Kulesi", description: "Panoramik Bursa manzarası sunan tarihi bir nokta ve şehrin sembollerinden." }
    ];

    const segmentColors = [
        getComputedStyle(document.documentElement).getPropertyValue('--wheel-segment-1'),
        getComputedStyle(document.documentElement).getPropertyValue('--wheel-segment-2'),
        getComputedStyle(document.documentElement).getPropertyValue('--wheel-segment-3'),
        getComputedStyle(document.documentElement).getPropertyValue('--wheel-segment-4'),
        getComputedStyle(document.documentElement).getPropertyValue('--wheel-segment-5'),
        getComputedStyle(document.documentElement).getPropertyValue('--wheel-segment-6'),
        getComputedStyle(document.documentElement).getPropertyValue('--wheel-segment-1'), // Tekrar eden renkler
        getComputedStyle(document.documentElement).getPropertyValue('--wheel-segment-2')
    ];

    let currentRotation = 0;
    let isSpinning = false;

    function drawWheel() {
        const arc = Math.PI / (locations.length / 2);
        const radius = canvas.width / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        for (let i = 0; i < locations.length; i++) {
            const angle = i * arc;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, angle, angle + arc);
            ctx.lineTo(radius, radius);
            ctx.closePath();
            ctx.fillStyle = segmentColors[i % segmentColors.length];
            ctx.fill();

            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px "Open Sans", sans-serif';
            ctx.fillText(locations[i].name, radius * 0.85, 0); // Metni biraz içe al
            ctx.restore();
        }
    }

    drawWheel(); // Çarkı başlangıçta çiz

    spinWheelBtn.addEventListener('click', () => {
        spinWheelModal.style.display = 'flex'; // Modalı göster
        wheelResult.textContent = ''; // Önceki sonucu temizle
        resultDetails.innerHTML = '';
        resultDetails.style.opacity = 0;
        isSpinning = false; // Her açıldığında tekrar döndürülebilir olsun
        canvas.style.transition = 'none'; // Geçişi sıfırla
        canvas.style.transform = `rotate(${currentRotation}deg)`; // Mevcut pozisyonu koru
        drawWheel(); // Çarkı yeniden çiz (text pozisyonlaması için)
    });

    closeButton.addEventListener('click', () => {
        spinWheelModal.style.display = 'none'; // Modalı kapat
    });

    window.addEventListener('click', (event) => {
        if (event.target == spinWheelModal) {
            spinWheelModal.style.display = 'none'; // Modal dışına tıklayınca kapat
        }
    });

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        wheelResult.textContent = 'Şansın Dönüyor...';
        resultDetails.innerHTML = '';
        resultDetails.style.opacity = 0;

        const spinDegrees = Math.floor(Math.random() * 360) + 3600; // En az 10 tam tur + rastgele açı
        currentRotation += spinDegrees;

        canvas.style.transition = 'transform 5s cubic-bezier(0.1, 0.8, 0.4, 1)';
        canvas.style.transform = `rotate(${currentRotation}deg)`;

        // Dönüş tamamlandığında sonucu belirle
        setTimeout(() => {
            isSpinning = false;
            const finalRotation = currentRotation % 360;
            const segmentAngle = 360 / locations.length;
            
            // Okun gösterdiği dilimi hesapla (ok üstte, 0 derecede)
            // Çarkın döndüğü yöne ve okun konumuna göre ayarlama
            let winningIndex = Math.floor((360 - (finalRotation % 360) + 90) % 360 / segmentAngle);
            
            // Eğer okun 0 derece olduğunu varsayıyorsak:
            // let winningIndex = Math.floor((360 - (finalRotation % 360) + (segmentAngle / 2)) % 360 / segmentAngle);
            
            // Bu hesaplama biraz deneme-yanılma gerektirebilir, 
            // çarkın çizim şekline ve okun tam konumuna bağlıdır.
            // Örneğin: Ok tam üstte, segmentler saat yönünde çiziliyorsa:
            winningIndex = (locations.length - 1) - Math.floor((finalRotation + segmentAngle / 2) % 360 / segmentAngle);
            if (winningIndex < 0) winningIndex += locations.length;
            
            // Basit bir yaklaşımla, okun işaret ettiği segmenti bulmak:
            // Ok 0 derece (yukarı) işaret ediyorsa, dönüş açısının tam tersi yönü bulunur.
            const adjustedRotation = (finalRotation + 270) % 360; // 270 derece ekleyerek oku yukarı getir.
            winningIndex = Math.floor(adjustedRotation / segmentAngle);
            winningIndex = locations.length - 1 - winningIndex; // Reverse for correct order

            if (winningIndex < 0) winningIndex += locations.length; // Ensure non-negative index


            // Daha güvenilir bir hesaplama:
            // Çarkın 0 derecesi sağda ise ve saat yönünün tersine dönüyorsa:
            // const degreesPerSegment = 360 / locations.length;
            // const normalizedRotation = (currentRotation % 360 + 360) % 360; // 0-359 arasına getir
            // const segmentIndex = Math.floor(normalizedRotation / degreesPerSegment);
            // winningIndex = (locations.length - 1 - segmentIndex + locations.length) % locations.length;


            // En basit ve genellikle işe yarayan yöntem:
            const totalSegments = locations.length;
            const degreesPerSegment = 360 / totalSegments;
            const landedAngle = currentRotation % 360;
            const index = Math.floor((landedAngle + degreesPerSegment / 2) / degreesPerSegment) % totalSegments;
            winningIndex = totalSegments - 1 - index;


            const chosenLocation = locations[winningIndex];

            wheelResult.textContent = `Şanslı Konumunuz: ${chosenLocation.name}!`;
            resultDetails.innerHTML = `<h3>${chosenLocation.name} Hakkında</h3><p>${chosenLocation.description}</p>`;
            resultDetails.style.opacity = 1;

        }, 5000); // Dönüş süresi ile aynı olmalı (5s)
    });

    // Çark için yerel konumların listesi. Burayı istediğiniz gibi genişletebilirsiniz.
    // Bursa'nın önemli yerleri buraya eklendi.
    // Bu liste, .js dosyasının en başında tanımlanmış olmalı.
});
