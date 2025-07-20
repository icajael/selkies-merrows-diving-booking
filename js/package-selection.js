// Package selection functionality
document.addEventListener('DOMContentLoaded', function() {
    // Package selection elements
    const packageCards = document.querySelectorAll('.package-card');
    const selectPackageBtns = document.querySelectorAll('.select-package-btn');
    const packageSelect = document.getElementById('selectedPackage');
    const paxSelect = document.getElementById('numberOfPax');
    const totalCostDisplay = document.getElementById('totalCostDisplay');
    const totalAmount = document.getElementById('totalAmount');
    const costBreakdown = document.getElementById('costBreakdown');
    
    // Package prices
    const packagePrices = {
        moonstone: 2699,
        crescent: 3999,
        sun: 3699
    };
    
    // Package selection functionality
    selectPackageBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const packageType = this.getAttribute('data-package');
            selectPackage(packageType);
        });
    });
    
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            const packageType = this.getAttribute('data-package');
            selectPackage(packageType);
        });
    });
    
    // Package selection function
    function selectPackage(packageType) {
        // Remove selected class from all cards
        packageCards.forEach(card => card.classList.remove('selected'));
        
        // Add selected class to clicked card
        const selectedCard = document.querySelector(`[data-package="${packageType}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Update the select dropdown
        packageSelect.value = packageType;
        
        // Calculate total cost
        calculateTotalCost();
        
        // Scroll to form section
        document.querySelector('.inquiry-form-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    // Listen for changes in package and pax selects
    packageSelect.addEventListener('change', function() {
        const selectedPackage = this.value;
        
        // Update visual selection
        packageCards.forEach(card => card.classList.remove('selected'));
        if (selectedPackage) {
            const selectedCard = document.querySelector(`[data-package="${selectedPackage}"]`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }
        }
        
        calculateTotalCost();
    });
    
    paxSelect.addEventListener('change', calculateTotalCost);
    
    // Calculate total cost function
    function calculateTotalCost() {
        const selectedPackage = packageSelect.value;
        const numberOfPax = parseInt(paxSelect.value) || 0;
        
        if (selectedPackage && numberOfPax > 0) {
            const packagePrice = packagePrices[selectedPackage];
            const total = packagePrice * numberOfPax;
            
            // Format price with commas
            const formattedTotal = total.toLocaleString('en-PH');
            const formattedPackagePrice = packagePrice.toLocaleString('en-PH');
            
            // Get package name
            const packageNames = {
                moonstone: 'Moon Stone Package',
                crescent: 'Crescent Moon Package',
                sun: 'Sun Package'
            };
            
            // Update display
            totalAmount.textContent = `₱${formattedTotal}`;
            costBreakdown.textContent = `${packageNames[selectedPackage]} - ${numberOfPax} ${numberOfPax === 1 ? 'person' : 'people'} × ₱${formattedPackagePrice} per person`;
            
            // Show the cost display with animation
            totalCostDisplay.style.display = 'block';
        } else {
            // Hide the cost display
            totalCostDisplay.style.display = 'none';
        }
    }
    
    // Update form data collection to include package and pax info
    window.getPackageData = function() {
        return {
            selectedPackage: packageSelect.value,
            numberOfPax: paxSelect.value,
            totalCost: packageSelect.value && paxSelect.value ? 
                packagePrices[packageSelect.value] * parseInt(paxSelect.value) : 0
        };
    };
});
