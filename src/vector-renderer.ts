export interface Vector2D {
  x: number;
  y: number;
}

export interface VectorShape {
  points: Vector2D[];
  closed: boolean;
  color: string;
  lineWidth: number;
}

export interface Star {
  x: number;
  y: number;
  brightness: number;
  twinkle: number;
}

export class VectorRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private stars: Star[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupCanvas();
    this.generateStarfield();
  }

  private setupCanvas() {
    // Set canvas size to fill window minus status bar
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 40;
    
    // Enable crisp vector lines
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  private generateStarfield() {
    this.stars = [];
    const numStars = 150;
    
    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        brightness: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  private drawStarfield(deltaTime: number) {
    this.ctx.save();
    
    for (const star of this.stars) {
      // Update twinkle animation
      star.twinkle += deltaTime * 2;
      
      // Calculate twinkling brightness
      const twinkleFactor = Math.sin(star.twinkle) * 0.3 + 0.7;
      const alpha = star.brightness * twinkleFactor;
      
      // Draw star as a small glowing dot - made more visible
      this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.8})`;
      this.ctx.shadowColor = '#00ff00';
      this.ctx.shadowBlur = 3;
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, 1, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Add a brighter center dot for more visible stars
      if (star.brightness > 0.7) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, 0.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    
    this.ctx.restore();
  }

  clear(deltaTime: number = 0) {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw animated starfield
    this.drawStarfield(deltaTime);
  }

  drawShape(shape: VectorShape, position: Vector2D, rotation: number = 0, scale: number = 1) {
    if (shape.points.length < 2) return;

    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    this.ctx.rotate(rotation);
    this.ctx.scale(scale, scale);

    this.ctx.strokeStyle = shape.color;
    this.ctx.lineWidth = shape.lineWidth;
    this.ctx.shadowColor = shape.color;
    this.ctx.shadowBlur = 3;

    this.ctx.beginPath();
    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);

    for (let i = 1; i < shape.points.length; i++) {
      this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }

    if (shape.closed) {
      this.ctx.closePath();
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  drawLine(from: Vector2D, to: Vector2D, color: string = '#00ff00', lineWidth: number = 1) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawText(text: string, position: Vector2D, color: string = '#00ff00', size: number = 16) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px 'Courier New', monospace`;
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 5;
    this.ctx.fillText(text, position.x, position.y);
    this.ctx.restore();
  }

  getCanvasSize(): Vector2D {
    return { x: this.canvas.width, y: this.canvas.height };
  }

  resize() {
    this.setupCanvas();
    this.generateStarfield();
  }
}
