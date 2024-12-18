document.getElementById("help-button").addEventListener("click", function() {
    const helpContent = document.getElementById("help-content");
    if (helpContent.style.display === "none" || helpContent.style.display === "") {
        helpContent.style.display = "block";
    } else {
        helpContent.style.display = "none";
    }
});

// Toggle Help Modal
function toggleHelp() {
    const helpModal = document.getElementById("helpModal");
    helpModal.style.display = (helpModal.style.display === "none" || helpModal.style.display === "") ? "block" : "none";
}

// Prediction Function for Mastitis
function predictMastitis() {
    const temperature = parseFloat(document.getElementById("temperature").value);
    const hardness = parseInt(document.getElementById("hardness").value, 10);
    const pain = parseInt(document.getElementById("pain").value, 10);
    const milkVisibility = document.getElementById("milk_visibility").value;
    const milkColor = parseInt(document.getElementById("milk_color").value, 10);
    const resultElement = document.getElementById("result");

    // Input Validation
    if (!isValidRange(temperature, 30, 45)) {
        updateResult("Temperature must be a valid number between 30 and 45.", "error");
        return;
    }

    if (!isValidRange(hardness, 0, 5)) {
        updateResult("Hardness must be a valid number between 0 and 5.", "error");
        return;
    }

    if (!isValidRange(pain, 0, 5)) {
        updateResult("Pain must be a valid number between 0 and 5.", "error");
        return;
    }

    if (!["0", "1"].includes(milkVisibility)) {
        updateResult("Milk Visibility must be either 0 or 1.", "error");
        return;
    }

    if (!isValidRange(milkColor, 0, 5)) {
        updateResult("Milk Color must be a valid number between 0 and 5.", "error");
        return;
    }

    // API Call
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            temperature,
            hardness,
            pain,
            milk_visibility: parseInt(milkVisibility, 10),
            milk_color: milkColor
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            updateResult(`Error: ${data.error}`, "error");
        } else if (data.prediction) {
            updateResult(data.prediction, "success");
        } else {
            updateResult("Unexpected response from server.", "error");
        }
    })
    .catch(() => {
        updateResult("Error: Unable to connect to the server.", "error");
    });
}

// Utility to Update Result Element
function updateResult(message, status) {
    const resultElement = document.getElementById("result");
    resultElement.textContent = message;
    resultElement.className = status;
}

// Validate Input Range
function isValidRange(value, min, max) {
    return !isNaN(value) && value >= min && value <= max;
}

// Toggle Chatbot Visibility
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.style.display = (chatbot.style.display === 'none' || chatbot.style.display === '') ? 'flex' : 'none';
}

// Handle Chatbot Message Sending
function sendChatbotMessage() {
    const inputField = document.getElementById('chatbot-input');
    const message = inputField.value.trim().toLowerCase();
    const messagesContainer = document.getElementById('chatbot-messages');

    if (!message) return;

    // Append User Message
    appendMessage(messagesContainer, message, 'user');

    // Append Bot Response
    const response = findBestResponse(message);
    appendMessage(messagesContainer, response, 'bot');

    // Clear Input
    inputField.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Utility to Append Messages to Chatbot
function appendMessage(container, message, type) {
    const msgElement = document.createElement('div');
    msgElement.className = `chatbot-message ${type}`;
    msgElement.textContent = message;
    container.appendChild(msgElement);
}

function findBestResponse(message) {
    // Define responses
    const responses = [
        
        { keywords: ["what", "define", "definition","mastitis"], response: "Mastitis is a disease that causes inflammation of the mammary gland in cows, commonly due to bacterial infections." },
        { keywords: ["symptoms"], response: "Common symptoms include udder swelling, redness, heat, pain, fever, and abnormal milk production." },
        { keywords: ["symptoms", "mastitis", "signs", "what are the symptoms"], response: "Common symptoms include udder swelling, redness, heat, pain, fever, and abnormal milk production." },
        { keywords: ["early", "signs", "initial", "symptoms"], response: "Early signs of mastitis include slight swelling of the udder, reduced milk yield, and mild pain during milking." },
        { keywords: ["prevent", "mastitis", "prevention", "avoid"], response: "Prevention strategies include proper hygiene, clean milking techniques, regular health checks, and avoiding udder injuries." },
        { keywords: ["hygiene", "cleaning", "sanitize", "equipment"], response: "Good hygiene practices like cleaning udders, sanitizing milking equipment, and using post-milking teat dips can prevent mastitis." },
        { keywords: ["milking", "techniques", "proper", "manual", "machine"], response: "Using proper milking techniques, such as gentle hand milking and clean machinery, helps prevent mastitis." },
        { keywords: ["types"], response: "There are two types of mastitis: clinical mastitis, with visible symptoms, and subclinical mastitis, which has no obvious signs but affects milk quality." },
        { keywords: ["clinical", "mastitis"], response: "Clinical mastitis causes visible symptoms such as udder swelling, redness, fever, and clots in the milk." },
        { keywords: ["subclinical", "mastitis"], response: "Subclinical mastitis has no visible symptoms but can be identified through milk tests showing increased somatic cell counts." },
        { keywords: ["causes", "mastitis", "why", "reason"], response: "Mastitis is caused by bacteria entering through the teat canal, often due to poor hygiene, injuries, or environmental stress." },
        { keywords: ["bacteria", "pathogens", "infection"], response: "The main bacteria causing mastitis are Staphylococcus aureus, Streptococcus agalactiae, and Escherichia coli." },
        { keywords: ["risk", "factors", "high", "causes"], response: "Risk factors include poor hygiene, contaminated bedding, improper milking practices, overcrowding, and udder injuries." },
        { keywords: ["stress", "environment", "overcrowding", "injury"], response: "Environmental stress, overcrowding, and physical injuries to the udder can increase the risk of mastitis in cows." },
        { keywords: ["diagnosis", "detect", "test", "somatic cell count"], response: "Mastitis can be diagnosed through physical examination, milk changes, somatic cell count (SCC), and bacterial cultures." },
        { keywords: ["milk", "testing", "cell", "count"], response: "Somatic cell count tests and bacterial cultures are common methods for identifying subclinical mastitis." },
        { keywords: ["milk", "quality", "safety", "drop", "clots"], response: "Mastitis reduces milk quality, resulting in clots, discoloration, abnormal consistency, and decreased production." },
        { keywords: ["milk", "safety", "consumption"], response: "Milk from cows with mastitis should not be consumed or sold, as it may contain bacteria and antibiotics." },
        { keywords: ["treatment", "mastitis", "cure", "heal"], response: "Treatment includes consulting a veterinarian, administering antibiotics, and using proper milking techniques to relieve udder pressure." },
        { keywords: ["antibiotics", "medication", "drug", "medicine"], response: "Antibiotics like penicillin and amoxicillin are commonly used to treat bacterial infections causing mastitis." },
        { keywords: ["natural", "remedies", "alternative", "home", "treatment"], response: "Natural treatments include applying warm compresses to the udder, ensuring complete milking, and improving cow nutrition." },
        { keywords: ["follow-up", "care", "recovery", "post-treatment"], response: "Follow-up care involves monitoring milk quality, maintaining hygiene, and ensuring proper cow nutrition after treatment." },
        { keywords: ["complications", "risks", "untreated", "problems"], response: "Untreated mastitis can cause udder damage, reduced milk yield, systemic infections, and even death in severe cases." },
        { keywords: ["udder", "swelling", "redness", "pain", "heat"], response: "Mastitis often causes swelling, redness, heat, and pain in the cow's udder, making it uncomfortable for milking." },
        { keywords: ["udder", "cleaning", "teat", "disinfect", "sanitation"], response: "Clean udders and teat disinfection with pre- and post-milking dips are critical to preventing mastitis." },
        { keywords: ["nutrition", "diet", "health", "vitamins"], response: "Ensuring proper cow nutrition with a balanced diet rich in vitamins and minerals can strengthen immunity against mastitis." },
        { keywords: ["stress", "management", "environment", "comfort"], response: "Reducing environmental stress, overcrowding, and providing clean, comfortable bedding can help minimize mastitis risk." },
        { keywords: ["chronic", "mastitis", "recurring", "persistent"], response: "Chronic mastitis occurs when infections are not fully treated, leading to recurring inflammation and reduced milk production." },
        { keywords: ["how", "treat", "mastitis", "steps"], response: "To treat mastitis, consult a vet for antibiotics, apply warm compresses, ensure frequent milking, and keep the cow in a clean environment." },
        { keywords: ["udder", "damage", "injury", "physical"], response: "Physical injuries to the udder, such as cuts or bruises, increase susceptibility to mastitis and should be treated immediately." },
        { keywords: ["bedding", "contamination", "cleanliness", "dirty"], response: "Dirty bedding can harbor bacteria that cause mastitis, so it’s important to regularly clean and replace bedding materials." },
        { keywords: ["how", "identify", "detect", "early"], response: "Early detection of mastitis involves observing milk consistency, udder swelling, and monitoring somatic cell counts." },
        { keywords: ["economic", "loss", "impact", "cost"], response: "Mastitis leads to significant economic losses due to reduced milk production, veterinary costs, and discarded milk." },
        { keywords: ["vaccines", "immunity", "prevention"], response: "Vaccines can help prevent certain types of mastitis by improving the cow's immunity against specific bacterial infections." },
    { keywords: ["how many", "days", "detect", "mastitis"], response: "Mastitis can typically be detected within a few days of the onset of symptoms, but subclinical mastitis may require milk testing to identify, which can take longer." },
    { keywords: ["how", "long", "diagnosis", "mastitis"], response: "Mastitis can usually be diagnosed within a few days of symptoms like swelling, redness, or changes in milk quality. However, subclinical mastitis may take longer to detect through milk tests." },
    { keywords: ["detect", "mastitis", "time", "take", "symptoms"], response: "The time it takes to detect mastitis depends on its type: clinical mastitis can be detected immediately due to visible symptoms, while subclinical mastitis may require several days for milk tests to show changes." },
    { keywords: ["mastitis", "how", "fast", "diagnosed"], response: "Mastitis is diagnosed relatively quickly, often within a few days, through a combination of physical examination, milk changes, and somatic cell count testing." },
    { keywords: ["early", "detection", "mastitis", "symptoms"], response: "Early detection of mastitis is important and can be achieved within a few days if there are visible symptoms or changes in milk quality. Subclinical cases may take longer to detect." },
    { keywords: ["clinical", "mastitis", "subclinical", "difference"], response: "Clinical mastitis shows visible symptoms like udder swelling, pain, and milk changes, making it easier to detect quickly. Subclinical mastitis may take longer to identify, as it lacks visible signs." },
    { keywords: ["early", "signs", "mastitis", "diagnose"], response: "Early signs of mastitis, such as slight swelling or changes in milk consistency, can usually be diagnosed within a few days, but more advanced tests may be needed for subclinical cases." },
    { keywords: ["how", "detect", "early", "mastitis", "subclinical"], response: "Early detection of subclinical mastitis often requires milk testing for somatic cell count or bacterial cultures, and it may take a few days to confirm the diagnosis." },
    { keywords: ["risk", "factors", "mastitis", "diagnosis"], response: "Risk factors such as poor hygiene, teat injuries, and overcrowding can make mastitis more likely to develop. Early diagnosis can help prevent the disease from worsening." },
    { keywords: ["milk", "quality", "testing", "mastitis"], response: "Milk quality testing, such as somatic cell count or bacterial culture, is essential for detecting subclinical mastitis, which may not show visible symptoms for several days." },
    { keywords: ["prevention", "methods", "early", "mastitis"], response: "Preventing mastitis early through good hygiene practices, proper milking techniques, and regular health checks can help identify potential issues before they become severe." },
    { keywords: [], response: "I'm sorry, I don't understand. Could you please rephrase or ask another question?" },
        { keywords: ["mastitis"], response: "Mastitis is an inflammation of the udder, often caused by bacterial infections or injuries." },
    ];
        
    for (const { keywords, response } of responses) {
        if (keywords.some(keyword => message.includes(keyword))) {
            return response;
        }
    }
    return "I'm not sure how to help with that. Could you try rephrasing?";
}
