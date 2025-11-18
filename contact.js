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
    
    // Add event listeners for plan selection
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
    
    // Initialize pricing
    updatePricing();
});

// Update plan selection visual state
function updatePlanSelection() {
    document.querySelectorAll('.plan-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`.plan-option[data-plan="${selectedPlan}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
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

// Generate email content from form data
function generateEmailContent() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const institution = document.getElementById('institution').value;
    const projectType = document.getElementById('projectType').options[document.getElementById('projectType').selectedIndex].text;
    const projectTitle = document.getElementById('projectTitle').value;
    const researchQuestion = document.getElementById('researchQuestion').value;
    const deadline = document.getElementById('deadline').value;
    const supervisorInfo = document.getElementById('supervisorInfo').value;
    
    const analysisTypes = Array.from(document.querySelectorAll('input[name="analysisType"]:checked'))
        .map(cb => document.querySelector(`label[for="${cb.id}"]`).textContent)
        .join(', ');
        
    const specificTests = document.getElementById('specificTests').value;
    const numTests = document.getElementById('numTests').value;
    const numGraphs = document.getElementById('numGraphs').value;
    const softwarePreference = document.getElementById('softwarePreference').options[document.getElementById('softwarePreference').selectedIndex].text;
    const dataDescription = document.getElementById('dataDescription').value;
    const dataSize = document.getElementById('dataSize').options[document.getElementById('dataSize').selectedIndex].text;
    const urgency = document.getElementById('urgency').options[document.getElementById('urgency').selectedIndex].text;
    const additionalRequirements = document.getElementById('additionalRequirements').value;
    const reportType = document.getElementById('reportType').options[document.getElementById('reportType').selectedIndex].text;
    const codeDelivery = document.getElementById('codeDelivery').options[document.getElementById('codeDelivery').selectedIndex].text;
    const presentationType = document.getElementById('presentationType').options[document.getElementById('presentationType').selectedIndex].text;
    const additionalSlides = document.getElementById('additionalSlides').value;

    let emailBody = `NOUVELLE DEMANDE D'ANALYSE DE DONNÉES\n\n`;
    emailBody += `=== INFORMATIONS PERSONNELLES ===\n`;
    emailBody += `Nom: ${firstName} ${lastName}\n`;
    emailBody += `Email: ${email}\n`;
    emailBody += `Téléphone: ${phone || 'Non fourni'}\n`;
    emailBody += `Institution: ${institution || 'Non fournie'}\n\n`;
    
    emailBody += `=== DÉTAILS DU PROJET ===\n`;
    emailBody += `Type de projet: ${projectType}\n`;
    emailBody += `Titre: ${projectTitle}\n`;
    emailBody += `Question de recherche: ${researchQuestion}\n`;
    emailBody += `Délai souhaité: ${deadline || 'Non spécifié'}\n`;
    emailBody += `Superviseur: ${supervisorInfo || 'Non spécifié'}\n\n`;
    
    emailBody += `=== EXIGENCES D'ANALYSE ===\n`;
    emailBody += `Plan sélectionné: ${planDisplayNames[window.currentPlan] || window.currentPlan}\n`;
    emailBody += `Types d'analyse: ${analysisTypes}\n`;
    emailBody += `Tests spécifiques: ${specificTests || 'Non spécifié'}\n`;
    emailBody += `Nombre de tests: ${numTests}\n`;
    emailBody += `Nombre de graphiques: ${numGraphs}\n`;
    emailBody += `Logiciel préféré: ${softwarePreference}\n`;
    emailBody += `Taille des données: ${dataSize}\n`;
    emailBody += `Niveau d'urgence: ${urgency}\n`;
    emailBody += `Description des données: ${dataDescription || 'Non fournie'}\n`;
    emailBody += `Exigences supplémentaires: ${additionalRequirements || 'Aucune'}\n\n`;
    
    emailBody += `=== PRIX ESTIMÉ ===\n`;
    emailBody += `Prix total estimé: ${window.currentTotal || currentPlanConfig.basePrice} DA\n\n`;
    
    emailBody += `Date de soumission: ${new Date().toLocaleString('fr-FR')}\n`;
    // Add these to the email body
    emailBody += `Type de rapport: ${reportType}\n`;
    emailBody += `Livraison du code: ${codeDelivery}\n`;
    emailBody += `Présentation: ${presentationType}\n`;
    if (additionalSlides > 0) {
        emailBody += `Slides supplémentaires: ${additionalSlides}\n`;
    }
    
    return emailBody;
}

// Submit form and open email client
function submitForm() {
    // Generate email content
    const emailContent = generateEmailContent();
    const projectTitle = document.getElementById('projectTitle').value;
    
    // Create email subject
    const emailSubject = `Demande d'analyse - ${projectTitle || 'Nouveau projet'}`;
    
    // Your email address
    const yourEmail = 'sarb5057@gmail.com';
    
    // Try to open the user's default email client
    const mailtoLink = `mailto:${yourEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailContent)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Also show a success message with instructions
    showEmailInstructions(emailContent);
}

// Show email instructions modal
function showEmailInstructions(emailContent) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: #059669; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 15px;">✓</div>
            <h2 style="color: #0f172a; margin: 0 0 10px;">Demande presque terminée!</h2>
            <p style="color: #64748b; margin: 0;">Veuillez envoyer l'email suivant à sarb5057@gmail.com</p>
        </div>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #0f172a; margin: 0 0 15px; font-size: 16px;">Contenu de l'email à envoyer:</h3>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; font-family: monospace; font-size: 14px; white-space: pre-wrap; max-height: 300px; overflow-y: auto;">
${emailContent}
            </div>
        </div>
        
        <div style="background: #dbeafe; border: 1px solid #2563eb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h4 style="color: #1e40af; margin: 0 0 10px; font-size: 14px;">Instructions:</h4>
            <ol style="color: #374151; margin: 0; padding-left: 20px; font-size: 14px;">
                <li>Votre client email devrait s'ouvrir automatiquement</li>
                <li>Vérifiez que l'adresse de destination est: <strong>sarb5057@gmail.com</strong></li>
                <li>Ajoutez votre fichier de données en pièce jointe si nécessaire</li>
                <li>Envoyez l'email</li>
            </ol>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="copyEmailBtn" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;">Copier le contenu</button>
            <button id="closeModalBtn" style="background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;">Fermer</button>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Add event listeners
    document.getElementById('copyEmailBtn').addEventListener('click', function() {
        navigator.clipboard.writeText(emailContent).then(function() {
            const btn = document.getElementById('copyEmailBtn');
            const originalText = btn.textContent;
            btn.textContent = '✓ Copié!';
            btn.style.background = '#059669';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#2563eb';
            }, 2000);
        });
    });
    
    document.getElementById('closeModalBtn').addEventListener('click', function() {
        document.body.removeChild(modalOverlay);
        // Also show the original success message
        document.getElementById('step-4').classList.remove('active');
        document.getElementById('success-message').classList.add('active');
    });
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
            document.getElementById('step-4').classList.remove('active');
            document.getElementById('success-message').classList.add('active');
        }
    });
}
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
// Redirect to home page
function goHome() {
    window.location.href = 'index.html'; // Adjust to your actual homepage URL
}