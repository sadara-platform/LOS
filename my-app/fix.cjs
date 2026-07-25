const fs = require('fs');

const content = fs.readFileSync('c:/Users/Ameer/Desktop/LOS/my-app/src/index.css', 'utf8');
const lines = content.split('\n');
const cleanLines = lines.slice(0, 1029);

const cleanCSS = `
/* Custom Scrollbar for Luxury Streetwear Vibe */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #0A0A0A;
}
::-webkit-scrollbar-thumb {
  background: #2D2D2D;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #D32F2F;
}

::selection {
  background-color: #D32F2F;
  color: #FFFFFF;
}

/* Organic droplets / blob layouts matching the elite editorial layout in the screenshot */
.droplet-mask {
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
}

.editorial-curve {
  border-radius: 0 0 100px 100px;
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float-slow 6s ease-in-out infinite;
}
`;

fs.writeFileSync('c:/Users/Ameer/Desktop/LOS/my-app/src/index.css', cleanLines.join('\n') + '\n' + cleanCSS);
console.log("Fixed!");
