document.getElementById('giveawayForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const phoneNumber = document.getElementById('phone').value;
    const resultDiv = document.getElementById('result');
    
    // Validate phone number (simple check for Nigerian numbers)
    if (!phoneNumber.match(/^[0-9]{11}$/) || !phoneNumber.startsWith('0')) {
        resultDiv.textContent = "Please enter a valid Nigerian phone number!";
        resultDiv.style.display = "block";
        resultDiv.style.color = "#ff3333";
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('button');
    submitBtn.textContent = "Processing...";
    submitBtn.disabled = true;
    
    // Fake processing delay
    setTimeout(function() {
        // Create confetti effect
        createConfetti();
        
        // Show the April Fools' message
        resultDiv.innerHTML = `
            APRIL FOOLS'! 🤣<br><br>
            We just wanted to say <span class="phone-number">${phoneNumber}</span>!<br>
            There's no free airtime, but we hope you have a great April Fools' Day!<br><br>
            
        `;
        resultDiv.style.display = "block";
        
        // Reset form
        submitBtn.textContent = "GOT ME! TRY AGAIN?";
        submitBtn.disabled = false;
        document.getElementById('giveawayForm').reset();
        
        // Make everything shake for fun
        document.querySelector('.container').style.animation = "shake 0.5s";
        setTimeout(() => {
            document.querySelector('.container').style.animation = "pulse 2s infinite alternate";
        }, 500);
    }, 2000);
});

function createConfetti() {
    const colors = ['#ffcc00', '#ff3333', '#33ccff', '#33ff33', '#cc33ff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.opacity = '1';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const animationDuration = Math.random() * 3 + 2;
        confetti.style.animation = `fall ${animationDuration}s linear forwards`;
        
        // Create keyframes for falling
        const keyframes = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.innerHTML = keyframes;
        document.head.appendChild(style);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
            style.remove();
        }, animationDuration * 1000);
    }
}