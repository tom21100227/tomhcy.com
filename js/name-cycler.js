
document.addEventListener('DOMContentLoaded', function() {
    const nameElement = document.getElementById('cycling-name');
    if (nameElement) {
        const names = [
            "Tom Han",
            "Chongye Han",
            "韩重烨"
        ];
        let currentIndex = 0;

        nameElement.style.cursor = 'pointer'; // Indicate it's clickable

        nameElement.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % names.length;
            nameElement.textContent = names[currentIndex];
        });
    }
});
