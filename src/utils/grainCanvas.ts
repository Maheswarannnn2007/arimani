import { GrainItem, PenStyle, InkColor } from '../types';

export function downloadImage(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function generateGrainCardDataUrl(
  text: string,
  penStyle: PenStyle = 'brush',
  inkColor: InkColor = 'black',
  customGrainImage?: string | null
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 800;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // Background - Warm Pulp Parchment
    ctx.fillStyle = '#FFF8F5';
    ctx.fillRect(0, 0, width, height);

    // Halftone dots pattern
    ctx.fillStyle = 'rgba(141, 75, 0, 0.08)';
    const dotSpacing = 16;
    for (let x = 10; x < width - 10; x += dotSpacing) {
      for (let y = 10; y < height - 10; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Heavy Brutalist Outer Comic Border
    ctx.strokeStyle = '#1E1B19';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Inner hairline border
    ctx.strokeStyle = '#8D4B00';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    // Header Banner
    ctx.fillStyle = '#8D4B00';
    ctx.fillRect(40, 40, width - 80, 56);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Anybody", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ARIMANIHUB // VINTAGE INSCRIBED RELIC', 56, 76);

    ctx.fillStyle = '#FFDCC3';
    ctx.font = 'bold 16px "Space Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('1200 DPI MICRO-CANVAS', width - 56, 76);

    // Rice Grain Centerpiece
    const centerX = width / 2;
    const centerY = height / 2 - 20;

    const drawGrainAndText = () => {
      // Grain drop shadow
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-0.06);

      ctx.shadowColor = 'rgba(30, 27, 25, 0.25)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 12;

      // Outer grain base
      ctx.fillStyle = '#FAF2EE';
      ctx.beginPath();
      ctx.ellipse(0, 0, 260, 68, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner grain highlight
      ctx.shadowColor = 'transparent';
      const grainGrad = ctx.createLinearGradient(0, -60, 0, 60);
      grainGrad.addColorStop(0, '#FFFFFF');
      grainGrad.addColorStop(0.5, '#FFF9F5');
      grainGrad.addColorStop(1, '#E9E1DD');
      ctx.fillStyle = grainGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 250, 62, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden Shimmer Line
      ctx.strokeStyle = '#FFB77D';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-180, -10);
      ctx.quadraticCurveTo(0, -35, 180, -8);
      ctx.stroke();

      // Rice grain tip taper marks
      ctx.strokeStyle = '#DBC2B0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-240, 0);
      ctx.lineTo(-210, 0);
      ctx.moveTo(210, 0);
      ctx.lineTo(240, 0);
      ctx.stroke();

      // Inscribed text
      let textColor = '#1E1B19';
      if (inkColor === 'amber') textColor = '#8D4B00';
      else if (inkColor === 'cyan') textColor = '#006591';
      else if (inkColor === 'red') textColor = '#BA1A1A';

      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (penStyle === 'brush') {
        ctx.font = '900 48px "Anybody", "Noto Sans Malayalam", sans-serif';
      } else if (penStyle === 'marker') {
        ctx.font = '800 42px "Anybody", "Noto Sans Malayalam", sans-serif';
      } else {
        ctx.font = '700 36px "Space Mono", "Noto Sans Malayalam", monospace';
      }

      ctx.fillText(text || 'അർജുൻ', 0, 2);
      ctx.restore();

      // Inscribed Name Callout Badge
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#1E1B19';
      ctx.lineWidth = 3;
      const badgeW = 280;
      const badgeH = 50;
      ctx.fillRect(centerX - badgeW / 2, centerY + 110, badgeW, badgeH);
      ctx.strokeRect(centerX - badgeW / 2, centerY + 110, badgeW, badgeH);

      ctx.fillStyle = textColor;
      ctx.font = 'bold 24px "Anybody", "Noto Sans Malayalam", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text || 'അർജുൻ', centerX, centerY + 142);

      // Folklore Adage Strip
      ctx.fillStyle = '#EEE7E3';
      ctx.fillRect(48, height - 160, width - 96, 70);
      ctx.strokeStyle = '#1E1B19';
      ctx.lineWidth = 2;
      ctx.strokeRect(48, height - 160, width - 96, 70);

      ctx.fillStyle = '#1E1B19';
      ctx.font = 'bold 17px "Noto Sans Malayalam", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('“ഓരോ അരിമണിയിലും അത് കഴിക്കേണ്ട ആളുടെ പേര് എഴുതിവെച്ചിട്ടുണ്ട്”', centerX, height - 130);

      ctx.fillStyle = '#554336';
      ctx.font = '13px "Space Mono", monospace';
      ctx.fillText('— MALAYALAM FOLKLORE ARCHIVE // KERALA TRADITION', centerX, height - 105);

      // Footer
      ctx.fillStyle = '#887364';
      ctx.font = 'bold 12px "Space Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('INK: ' + inkColor.toUpperCase() + ' // ' + penStyle.toUpperCase() + ' NIB', 52, height - 48);

      ctx.textAlign = 'right';
      ctx.fillText('BATCH #89 • CERTIFIED RELIC', width - 52, height - 48);

      resolve(canvas.toDataURL('image/png'));
    };

    if (customGrainImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw the custom background grain image with comic frame
        ctx.save();
        ctx.beginPath();
        ctx.rect(centerX - 240, centerY - 140, 480, 240);
        ctx.clip();
        ctx.drawImage(img, centerX - 240, centerY - 140, 480, 240);
        ctx.restore();
        ctx.strokeStyle = '#1E1B19';
        ctx.lineWidth = 4;
        ctx.strokeRect(centerX - 240, centerY - 140, 480, 240);

        // Draw Inscribed text over the custom grain
        let textColor = '#1E1B19';
        if (inkColor === 'amber') textColor = '#8D4B00';
        else if (inkColor === 'cyan') textColor = '#006591';
        else if (inkColor === 'red') textColor = '#BA1A1A';

        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 44px "Anybody", "Noto Sans Malayalam", sans-serif';
        ctx.shadowColor = 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 8;
        ctx.fillText(text || 'അർജുൻ', centerX, centerY - 10);
        ctx.shadowColor = 'transparent';

        // Inscribed Name Callout Badge
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1E1B19';
        ctx.lineWidth = 3;
        const badgeW = 280;
        const badgeH = 50;
        ctx.fillRect(centerX - badgeW / 2, centerY + 120, badgeW, badgeH);
        ctx.strokeRect(centerX - badgeW / 2, centerY + 120, badgeW, badgeH);

        ctx.fillStyle = textColor;
        ctx.font = 'bold 24px "Anybody", "Noto Sans Malayalam", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text || 'അർജുൻ', centerX, centerY + 152);

        // Folklore Adage Strip
        ctx.fillStyle = '#EEE7E3';
        ctx.fillRect(48, height - 160, width - 96, 70);
        ctx.strokeStyle = '#1E1B19';
        ctx.lineWidth = 2;
        ctx.strokeRect(48, height - 160, width - 96, 70);

        ctx.fillStyle = '#1E1B19';
        ctx.font = 'bold 17px "Noto Sans Malayalam", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('“ഓരോ അരിമണിയിലും അത് കഴിക്കേണ്ട ആളുടെ പേര് എഴുതിവെച്ചിട്ടുണ്ട്”', centerX, height - 130);

        ctx.fillStyle = '#554336';
        ctx.font = '13px "Space Mono", monospace';
        ctx.fillText('— MALAYALAM FOLKLORE ARCHIVE // KERALA TRADITION', centerX, height - 105);

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        drawGrainAndText();
      };
      img.src = customGrainImage;
    } else {
      drawGrainAndText();
    }
  });
}
