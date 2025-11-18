// Plan-specific configuration
const planConfigs = {
    'Essentiel': {
        basePrice: 5000,
        includedTests: 3,
        includedGraphs: 5,
        includedData: 'small',
        features: [
            'Statistiques descriptives',
            '3 tests statistiques inclus',
            '5 graphiques inclus',
            '≤ 1000 observations',
            'Rapport d\'analyse complet'
        ]
    },
    'Avance': {
        basePrice: 9500,
        includedTests: 8,
        includedGraphs: 10,
        includedData: 'medium',
        features: [
            'Statistiques descriptives',
            '8 tests statistiques inclus',
            '10 graphiques inclus',
            '1001 - 5000 observations',
            'Rapport d\'analyse détaillé',
            'Analyses multivariées'
        ]
    },
    'Complet': {
        basePrice: 25000,
        includedTests: 999, // Essentially unlimited
        includedGraphs: 999, // Essentially unlimited
        includedData: 'xlarge',
        features: [
            'Toutes analyses statistiques',
            'Tests statistiques illimités',
            'Graphiques illimités',
            'Jeu de données illimité',
            'Rapport complet et présentation',
            'Support jusqu\'à la soutenance',
            'Révisions illimitées'
        ]
    }
};

// Pricing configuration for extras
const pricingConfig = {
    testPrice: 500,
    graphPrice: 300,
    analysisPrices: {
        descriptive: 0,
        inferential: 500,
        regression: 800,
        multivariate: 1200,
        ml: 2000,
        other: 0
    },
    dataSizePrices: {
        small: 0,
        medium: 1500,
        large: 3000,
        xlarge: 5000
    },
    urgencyPrices: {
        normal: 0,
        urgent: 2000,
        express: 4000
    },
    reportTypePrices: {
        word: 0,
        latex: 500
    },
    presentationPrices: {
        none: 0,
        professional: 2000,
        latex: 1000
    },
    additionalSlidesPrices: {
        0: 0,
        5: 1000,
        10: 2000,
        15: 3000,
        20: 4000
    }
};

// Get URL parameters to determine selected plan
const urlParams = new URLSearchParams(window.location.search);
let selectedPlan = urlParams.get('plan') || 'Essentiel';

// Handle URL encoding for plan names with accents
if (selectedPlan === 'Avanc%C3%A9') {
    selectedPlan = 'Avance'; // Decoded version
}

let currentPlanConfig = planConfigs[selectedPlan];

// If plan is not found, default to Essentiel
if (!currentPlanConfig) {
    selectedPlan = 'Essentiel';
    currentPlanConfig = planConfigs[selectedPlan];
}

// Display names for plans (with proper accents)
const planDisplayNames = {
    'Essentiel': 'Essentiel',
    'Avance': 'Avancé',
    'Complet': 'Complet'
};

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    // Set the selected plan in the summary with proper display name
    document.getElementById('summary-plan').textContent = planDisplayNames[selectedPlan] || selectedPlan;
    
    // Set initial plan selection
    document.querySelector(`input[name="selectedPlan"][value="${selectedPlan}"]`).checked = true;
    updatePlanSelection();
    
    // Update plan information
    updatePlanInformation();
    
    // Set today as minimum date for deadline
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deadline').min = today;
    
    // Add event listeners for plan selection - FIXED VERSION
    document.querySelectorAll('.plan-option').forEach(option => {
        option.addEventListener('click', function(e) {
            // Don't trigger if clicking on the radio button itself
            if (e.target.type === 'radio') return;
            
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                selectedPlan = radio.value;
                currentPlanConfig = planConfigs[selectedPlan];
                updatePlanSelection();
                updatePlanInformation();
                updatePricing();
            }
        });
    });
    
    // Also listen for direct radio button changes
    document.querySelectorAll('input[name="selectedPlan"]').forEach(radio => {
        radio.addEventListener('change', function() {
            selectedPlan = this.value;
            currentPlanConfig = planConfigs[selectedPlan];
            updatePlanSelection();
            updatePlanInformation();
            updatePricing();
        });
    });
    
    // Add event listeners for checkboxes to update pricing
    document.querySelectorAll('input[name="analysisType"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePricing);
    });

    // Add event listeners for other form elements that affect pricing
    document.querySelectorAll('#numTests, #numGraphs, #dataSize, #urgency, #reportType, #presentationType, #additionalSlides').forEach(element => {
        element.addEventListener('change', updatePricing);
    });
    
    // Set form email when email field changes
    document.getElementById('email').addEventListener('change', function() {
        document.getElementById('form-email').value = this.value;
    });

    // Initialize pricing
    updatePricing();
});

// Update plan selection visual state
function updatePlanSelection() {
    document.querySelectorAll('.plan-option').forEach(option => {
        option.classList.remove('selected');
        const radio = option.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            option.classList.add('selected');
        }
    });
}

// Update plan information based on selected plan
function updatePlanInformation() {
    const planConfig = planConfigs[selectedPlan];
    
    // Update plan name and price with proper display name
    document.getElementById('selected-plan-name').textContent = planDisplayNames[selectedPlan] || selectedPlan;
    document.getElementById('selected-plan-price').textContent = `${planConfig.basePrice} DA`;
    
    // Update included features
    document.getElementById('included-tests').textContent = 
        planConfig.includedTests === 999 ? 'Tests statistiques illimités' : `${planConfig.includedTests} tests statistiques inclus`;
    
    document.getElementById('included-graphs').textContent = 
        planConfig.includedGraphs === 999 ? 'Graphiques illimités' : `${planConfig.includedGraphs} graphiques inclus`;
    
    document.getElementById('included-data').textContent = 
        planConfig.includedData === 'xlarge' ? 'Jeu de données illimité' : 
        planConfig.includedData === 'medium' ? '1001 - 5000 observations' : '≤ 1000 observations';
    
    // Update pricing info text
    document.getElementById('tests-info').textContent = 
        planConfig.includedTests === 999 ? 
        'Tests illimités inclus dans le plan' : 
        `${pricingConfig.testPrice} DA par test au-delà de ${planConfig.includedTests} tests inclus`;
    
    document.getElementById('graphs-info').textContent = 
        planConfig.includedGraphs === 999 ? 
        'Graphiques illimités inclus dans le plan' : 
        `${pricingConfig.graphPrice} DA par graphique au-delà de ${planConfig.includedGraphs} inclus`;
    
    // Update base price label
    document.getElementById('base-price-label').textContent = `Plan ${planDisplayNames[selectedPlan] || selectedPlan}:`;
}

// Update pricing based on user selections
function updatePricing() {
    let total = currentPlanConfig.basePrice;
    let analysisCost = 0;
    let testsCost = 0;
    let graphsCost = 0;
    let dataCost = 0;
    let urgencyCost = 0;
    let reportCost = 0;
    let presentationCost = 0;
    let additionalSlidesCost = 0;
    
    // Calculate analysis costs
    document.querySelectorAll('input[name="analysisType"]:checked').forEach(checkbox => {
        const price = parseInt(checkbox.getAttribute('data-price'));
        analysisCost += price;
    });
    
    // Calculate tests cost (only if not unlimited)
    if (currentPlanConfig.includedTests !== 999) {
        const numTests = parseInt(document.getElementById('numTests').value) || 0;
        if (numTests > currentPlanConfig.includedTests) {
            testsCost = (numTests - currentPlanConfig.includedTests) * pricingConfig.testPrice;
        }
    }
    
    // Calculate graphs cost (only if not unlimited)
    if (currentPlanConfig.includedGraphs !== 999) {
        const numGraphs = parseInt(document.getElementById('numGraphs').value) || 0;
        if (numGraphs > currentPlanConfig.includedGraphs) {
            graphsCost = (numGraphs - currentPlanConfig.includedGraphs) * pricingConfig.graphPrice;
        }
    }
    
    // Calculate data size cost (only if not unlimited)
    if (currentPlanConfig.includedData !== 'xlarge') {
        const dataSizeSelect = document.getElementById('dataSize');
        const dataSizePrice = parseInt(dataSizeSelect.options[dataSizeSelect.selectedIndex].getAttribute('data-price'));
        dataCost = dataSizePrice;
    } else {
        // For Complet plan, set data size to xlarge by default
        document.getElementById('dataSize').value = 'xlarge';
    }
    
    // Calculate urgency cost
    const urgencySelect = document.getElementById('urgency');
    const urgencyPrice = parseInt(urgencySelect.options[urgencySelect.selectedIndex].getAttribute('data-price'));
    urgencyCost = urgencyPrice;
    
    // Calculate report type cost
    const reportTypeSelect = document.getElementById('reportType');
    const reportTypePrice = parseInt(reportTypeSelect.options[reportTypeSelect.selectedIndex].getAttribute('data-price'));
    reportCost = reportTypePrice;
    
    // Calculate presentation cost
    const presentationSelect = document.getElementById('presentationType');
    const presentationType = presentationSelect.value;
    const presentationPrice = parseInt(presentationSelect.options[presentationSelect.selectedIndex].getAttribute('data-price'));
    presentationCost = presentationPrice;
    
    // Show/hide additional slides based on presentation selection
    const additionalSlidesGroup = document.getElementById('additionalSlidesGroup');
    if (presentationType === 'none') {
        additionalSlidesGroup.style.display = 'none';
        // Reset additional slides when no presentation is selected
        document.getElementById('additionalSlides').value = '0';
    } else {
        additionalSlidesGroup.style.display = 'block';
    }
    
    // Calculate additional slides cost
    const additionalSlidesSelect = document.getElementById('additionalSlides');
    const additionalSlidesPrice = parseInt(additionalSlidesSelect.options[additionalSlidesSelect.selectedIndex].getAttribute('data-price'));
    additionalSlidesCost = additionalSlidesPrice;
    
    // Calculate total
    total = currentPlanConfig.basePrice + analysisCost + testsCost + graphsCost + dataCost + urgencyCost + reportCost + presentationCost + additionalSlidesCost;
    
    // Update display
    document.getElementById('base-price').textContent = `${currentPlanConfig.basePrice} DA`;
    document.getElementById('analysis-price').textContent = `${analysisCost} DA`;
    document.getElementById('tests-price').textContent = `${testsCost} DA`;
    document.getElementById('graphs-price').textContent = `${graphsCost} DA`;
    document.getElementById('data-price').textContent = `${dataCost} DA`;
    document.getElementById('urgency-price').textContent = `${urgencyCost} DA`;
    document.getElementById('report-price').textContent = `${reportCost} DA`;
    document.getElementById('presentation-price').textContent = `${presentationCost} DA`;
    document.getElementById('additional-slides-price').textContent = `${additionalSlidesCost} DA`;
    document.getElementById('total-price').textContent = `${total} DA`;
    
    // Store total for later use
    window.currentTotal = total;
    window.currentPlan = selectedPlan;
}

// Update summary section
function updateSummary() {
    // Personal info
    document.getElementById('summary-name').textContent = 
        `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`;
    document.getElementById('summary-email').textContent = document.getElementById('email').value;
    
    // Project details
    const projectTypeSelect = document.getElementById('projectType');
    const projectTypeText = projectTypeSelect.options[projectTypeSelect.selectedIndex].text;
    document.getElementById('summary-project-type').textContent = projectTypeText;
    document.getElementById('summary-project-title').textContent = document.getElementById('projectTitle').value;
    document.getElementById('summary-research-question').textContent = 
        document.getElementById('researchQuestion').value.substring(0, 100) + 
        (document.getElementById('researchQuestion').value.length > 100 ? '...' : '');
    
    // Analysis types
    const analysisTypes = Array.from(document.querySelectorAll('input[name="analysisType"]:checked'))
        .map(cb => {
            const label = document.querySelector(`label[for="${cb.id}"]`).textContent;
            return label;
        })
        .join(', ');
    document.getElementById('summary-analysis-types').textContent = analysisTypes || 'Non spécifié';
    
    // Software preference
    const softwareSelect = document.getElementById('softwarePreference');
    const softwareText = softwareSelect.value ? softwareSelect.options[softwareSelect.selectedIndex].text : 'Aucune préférence';
    document.getElementById('summary-software').textContent = softwareText;
    
    // Deadline
    const deadline = document.getElementById('deadline').value;
    if (deadline) {
        const dateObj = new Date(deadline);
        const formattedDate = dateObj.toLocaleDateString('fr-FR');
        document.getElementById('summary-deadline').textContent = formattedDate;
    } else {
        document.getElementById('summary-deadline').textContent = 'Non spécifié';
    }
    
    // Plan and total price
    document.getElementById('summary-plan').textContent = planDisplayNames[window.currentPlan] || window.currentPlan;
    document.getElementById('summary-total-price').textContent = `${window.currentTotal || currentPlanConfig.basePrice} DA`;
    
    // Update hidden form fields for Formspree
    document.getElementById('form-total-price').value = window.currentTotal || currentPlanConfig.basePrice;
    document.getElementById('form-selected-plan').value = planDisplayNames[window.currentPlan] || window.currentPlan;
    document.getElementById('form-email').value = document.getElementById('email').value;
}

// Navigation between steps
function nextStep(currentStep) {
    // Validate current step before proceeding
    if (validateStep(currentStep)) {
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.getElementById(`step-${currentStep + 1}`).classList.add('active');
        
        // Update progress bar
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('completed');
        document.querySelector(`.progress-step[data-step="${currentStep + 1}"]`).classList.add('active');
        
        // If moving to confirmation step, update summary
        if (currentStep === 3) {
            updateSummary();
        }
    }
}

function prevStep(currentStep) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep - 1}`).classList.add('active');
    
    // Update progress bar
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep - 1}"]`).classList.add('active');
}

// Validate form steps
function validateStep(step) {
    let isValid = true;
    
    if (step === 1) {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        
        if (!firstName || !lastName || !email) {
            alert('Veuillez remplir tous les champs obligatoires');
            isValid = false;
        } else if (!isValidEmail(email)) {
            alert('Veuillez saisir une adresse e-mail valide');
            isValid = false;
        }
    } else if (step === 2) {
        const projectType = document.getElementById('projectType').value;
        const projectTitle = document.getElementById('projectTitle').value;
        const researchQuestion = document.getElementById('researchQuestion').value;
        
        if (!projectType || !projectTitle || !researchQuestion) {
            alert('Veuillez remplir tous les champs obligatoires');
            isValid = false;
        }
    } else if (step === 3) {
        const analysisTypes = document.querySelectorAll('input[name="analysisType"]:checked');
        if (analysisTypes.length === 0) {
            alert('Veuillez sélectionner au moins un type d\'analyse');
            isValid = false;
        }
    }
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Handle form submission
document.getElementById('analysis-request-form').addEventListener('submit', function(e) {
    // Prevent default form submission
    e.preventDefault();
    
    // Update summary one last time before submission
    updateSummary();
    
    // Show success message
    document.getElementById('step-4').classList.remove('active');
    document.getElementById('success-message').classList.add('active');
    
    // Submit the form to Formspree
    this.submit();
});

// Redirect to home page
function goHome() {
    window.location.href = 'index.html';
}
