document.addEventListener('DOMContentLoaded', function() {
    const nameElement = document.getElementById('cycling-name');
    const navbarNameElement = document.getElementById('navbar-name');

    if (nameElement) {
        const names = [
            "Tom Han Chongye",
            "Tom Han",
            "Chongye Han",
            "韩重烨"
        ];
        let currentIndex = 0;

        // Function to update all name instances
        function updateNames() {
            const currentName = names[currentIndex];
            nameElement.textContent = currentName;
            if (navbarNameElement) {
                navbarNameElement.textContent = currentName;
            }
            document.title = currentName; // Update browser tab title
        }

        // Initial update
        updateNames();

        nameElement.style.cursor = 'pointer'; // Indicate it's clickable

        nameElement.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % names.length;
            updateNames();
        });
    }
});