import { useEffect, useRef } from 'react';

interface CryptoChartBackgroundProps {
  variant?: 'green' | 'red' | 'mixed';
}

export function CryptoChartBackground({ variant = 'mixed' }: CryptoChartBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const candlesRef = useRef<Array<{open: number, close: number, high: number, low: number, volume: number}>>([]);
  const scrollOffsetRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let trendType: 'up' | 'down' | 'mixed' = 'mixed';
    if (variant === 'green') trendType = 'up';
    if (variant === 'red') trendType = 'down';

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const candleCount = Math.ceil(canvas.width / 50) + 2;
      candlesRef.current = generateCandlesticks(candleCount, trendType);
    };

    const generateCandlesticks = (count: number, trend: 'up' | 'down' | 'mixed') => {
      const candles: Array<{open: number, close: number, high: number, low: number, volume: number}> = [];
      let lastClose = candlesRef.current.length > 0
        ? candlesRef.current[candlesRef.current.length - 1].close
        : 50 + Math.random() * 30;

      for (let i = 0; i < count; i++) {
        const open = lastClose;
        let change;

        const greenBias = Math.random() < 0.65;

        if (trend === 'up') {
          change = greenBias
            ? (Math.random() * 0.8 + 0.2) * 60
            : (Math.random() * -0.5) * 40;
        } else if (trend === 'down') {
          change = greenBias
            ? (Math.random() * 0.5) * 40
            : (Math.random() * -0.8 - 0.2) * 60;
        } else {
          change = greenBias
            ? (Math.random() * 0.7 + 0.3) * 65
            : (Math.random() * -0.6) * 50;
        }

        const close = Math.max(5, Math.min(95, open + change));
        const wickRange = Math.abs(close - open) * 0.15 + 3;
        const high = Math.max(open, close) + Math.random() * wickRange;
        const low = Math.min(open, close) - Math.random() * wickRange;
        const volume = Math.random() * 100;

        candles.push({ open, close, high, low, volume });
        lastClose = close;
      }

      return candles;
    };

    const drawChart = () => {
      if (!canvas || !ctx) return;

      ctx.fillStyle = '#f5f5f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const volumeHeight = canvas.height * 0.20;
      const chartHeight = canvas.height * 0.75;
      const chartTop = 10;
      const chartBottom = chartTop + chartHeight;
      const volumeTop = chartBottom + 5;

      const horizontalLines = 8;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;

      for (let i = 0; i <= horizontalLines; i++) {
        const y = chartTop + (chartHeight / horizontalLines) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const verticalLines = Math.floor(canvas.width / 80);
      for (let i = 0; i <= verticalLines; i++) {
        const x = (canvas.width / verticalLines) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      const candleWidth = 50;

      const priceValues = candlesRef.current.flatMap(c => [c.high, c.low]);
      const minPrice = Math.min(...priceValues);
      const maxPrice = Math.max(...priceValues);
      const priceRange = maxPrice - minPrice;
      const chartPadding = priceRange * 0.1;

      let maxVolume = Math.max(...candlesRef.current.map(c => c.volume));
      if (maxVolume === 0) maxVolume = 1;

      ctx.lineWidth = 2;

      candlesRef.current.forEach((candle, i) => {
        const x = i * candleWidth - scrollOffsetRef.current;

        if (x < -candleWidth || x > canvas.width) return;

        const isGreen = candle.close > candle.open;

        const mapPrice = (price: number) => {
          return chartBottom - ((price - minPrice + chartPadding) / (priceRange + chartPadding * 2)) * chartHeight;
        };

        const openY = mapPrice(candle.open);
        const closeY = mapPrice(candle.close);
        const highY = mapPrice(candle.high);
        const lowY = mapPrice(candle.low);

        ctx.strokeStyle = isGreen ? '#22c55e' : '#ef4444';
        ctx.fillStyle = isGreen ? '#22c55e' : '#ef4444';

        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
        const bodyWidth = candleWidth * 0.75;

        ctx.fillRect(x + (candleWidth - bodyWidth) / 2, bodyTop, bodyWidth, bodyHeight);

        const volumeBarHeight = (candle.volume / maxVolume) * volumeHeight;
        const volumeY = volumeTop + volumeHeight - volumeBarHeight;

        ctx.globalAlpha = 0.4;
        ctx.fillRect(x + (candleWidth - bodyWidth) / 2, volumeY, bodyWidth, volumeBarHeight);
        ctx.globalAlpha = 1.0;
      });
    };

    const animate = () => {
      scrollOffsetRef.current += 0.3;

      const candleWidth = 50;
      if (scrollOffsetRef.current >= candleWidth) {
        scrollOffsetRef.current -= candleWidth;

        candlesRef.current.shift();

        const lastCandle = candlesRef.current[candlesRef.current.length - 1];
        const newCandles = generateCandlesticks(1, trendType);
        if (newCandles.length > 0) {
          newCandles[0].open = lastCandle.close;
          candlesRef.current.push(newCandles[0]);
        }
      }

      drawChart();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
