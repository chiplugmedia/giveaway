const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');

// Set canvas size
canvas.width = 400;
canvas.height = 400;

const prizes = [
    { value: '1 Million Naira', color: '#E6E6FA', icon: '💰' },
    { value: '10 Million Naira', color: '#E6E6FA', icon: '💎' },
    { value: 'iPhone 16 pro', color: '#E6E6FA', icon: '📱' },
    { value: '2,000 Naira', color: '#E6E6FA', icon: '💵' },
    { value: '1 Free Spin', color: '#E6E6FA', icon: '🎡' },
    { value: '500,000 Naira', color: '#E6E6FA', icon: '💸' },
    { value: '5,000 Task Points', color: '#E6E6FA', icon: '⭐' },
    { value: '5,000 Naira', color: '#E6E6FA', icon: '💶' }
];


let isSpinning = false;
let currentRotation = 0;

// Update the text drawing part in drawWheel function
function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 20;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    // Update the text drawing section
    prizes.forEach((prize, i) => {
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? '#E6E6FA' : '#F0F0FF';
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, i * sliceAngle + currentRotation, (i + 1) * sliceAngle + currentRotation);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#8A2BE2';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text and icon
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(i * sliceAngle + sliceAngle / 2 + currentRotation);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Arial';
        
        // Handle text wrapping for long prizes
        const words = prize.value.split(' ');
        if (words.length > 2) {
            ctx.fillText(`${prize.icon} ${words.slice(0, 2).join(' ')}`, radius - 25, -5);
            ctx.fillText(words.slice(2).join(' '), radius - 25, 10);
        } else {
            ctx.fillText(`${prize.icon} ${prize.value}`, radius - 25, 5);
        }
        ctx.restore();
    });

    // Draw outer circle
    ctx.beginPath();
    ctx.strokeStyle = '#8A2BE2';
    ctx.lineWidth = 10;
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw center button circle
    ctx.beginPath();
    ctx.fillStyle = '#FF6B00';
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fill();

    // Draw SPIN NOW text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', centerX, centerY - 5);
    ctx.fillText('NOW', centerX, centerY + 15);
}

// Add at the top of the file
const spinSound = document.getElementById('spinSound');
const winSound = document.getElementById('winSound');

// Update the spin function
function spin() {
    if (isSpinning) return;
    
    spinSound.currentTime = 0; // Reset sound to start
    spinSound.play();
    isSpinning = true;
    const spins = 8;
    const finalAngle = Math.random() * Math.PI * 2;
    const totalRotation = (spins * Math.PI * 2) + finalAngle;
    let currentTime = 0;
    const animationTime = 5000;

    function animate() {
        currentTime += 16;
        const progress = currentTime / animationTime;
        
        if (progress < 1) {
            currentRotation = easeOut(progress) * totalRotation;
            drawWheel();
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            const winningIndex = Math.floor(((totalRotation - currentRotation) % (Math.PI * 2)) / (Math.PI * 2 / prizes.length));
            showResult(prizes[winningIndex].value);
        }
    }

    animate();
}

function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Update the showResult function
// Update showResult to include icon
function showResult(prize) {
    winSound.currentTime = 0;
    winSound.play();

    const winningPrize = prizes.find(p => p.value === prize);
    
    Swal.fire({
        title: 'Congratulations! 🎉',
        html: `You won <strong>${winningPrize.icon} ${prize}</strong>!`,
        icon: 'success',
        confirmButtonText: 'Submit',
        confirmButtonColor: '#8A2BE2',
        background: '#1a1a1a',
        color: '#fff',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
        
        confirmButtonText: 'Claim Now',
        confirmButtonColor: '#8A2BE2',
        background: '#1a1a1a',
        color: '#fff',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Claim Your Prize',
               
                confirmButtonText: 'Submit',
                confirmButtonColor: '#8A2BE2',
                background: '#1a1a1a',
                color: '#fff',
                showCancelButton: true,
                focusConfirm: false,
                preConfirm: () => {
                    const phone = document.getElementById('phone').value;
                    const network = document.getElementById('network').value;
                    if (!phone || !network) {
                        Swal.showValidationMessage('Please fill in all fields');
                        return false;
                    }
                    if (!/^\d{11}$/.test(phone)) {
                        Swal.showValidationMessage('Please enter a valid 11-digit phone number');
                        return false;
                    }
                    return { phone, network };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Your prize claim has been submitted successfully!',
                        icon: 'success',
                        confirmButtonColor: '#8A2BE2',
                        background: '#1a1a1a',
                        color: '#fff'
                    });
                }
            });
        }
    });

    const result = document.querySelector('.winner-alert');
    result.style.display = 'block';
    result.textContent = `🔊 YOU won ${winningPrize.icon} ${prize}`;
}

spinButton.addEventListener('click', spin);
drawWheel();
